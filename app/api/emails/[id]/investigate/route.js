import { google } from "googleapis";
import { cookies } from "next/headers";
import { emailParser } from "@/app/lib/emailParser";
import { analyzeHeaders } from "@/app/lib/headerAnalyzer";
import { analyzeUrls } from "@/app/lib/urlAnalyzer";
import { analyzeWithGroq } from "@/app/lib/groq";
import { geolocateIP } from "@/app/lib/ipGeolocation";

export async function POST(request, { params }) {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("google_tokens");

        if (!tokenCookie) {
            return Response.json(
                { error: "Not authenticated with google" },
                { status: 401 }
            );
        }

        const token = JSON.parse(tokenCookie.value);

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        oauth2Client.setCredentials(token);

        const gmail = google.gmail({
            version: "v1",
            auth: oauth2Client,
        });

        const { id } = await params;

        if (!id) {
            return Response.json(
                {
                    success: false,
                    error: "Email ID is required",
                },
                { status: 400 }
            );
        }

        // Get the selected email from Gmail
        const response = await gmail.users.messages.get({
            userId: "me",
            id: id,
            format: "full",
        });

        // Parse the email
        const email = emailParser(response.data);

        // Analyze technical email evidence
        const headerAnalysis = analyzeHeaders(email.headers);
        const urlAnalysis = analyzeUrls(email.body);

        const sourceIP = headerAnalysis.ips?.[0] || null;
        const geoLocation = sourceIP ? await geolocateIP(sourceIP) : null;


        // Prepare compact data for Groq
        const aiAnalysis = await analyzeWithGroq({
            subject: email.subject,
            sender: email.from,
            body: email.body,
            urls: urlAnalysis.slice(0, 50),
            domains: urlAnalysis.map((item) => item.domain),
            authentication: headerAnalysis.authentication,
        });

        console.log(geoLocation)

        return Response.json({
            success: true,
            result: {
                email: {
                    id: email.id,
                    from: email.from,
                    to: email.to,
                    subject: email.subject,
                    date: email.date,
                },

                security: {
                    headers: headerAnalysis,
                    urls: urlAnalysis,
                    geoLocation,
                },

                aiAnalysis,
            },
        });

    } catch (error) {
        console.error("Investigation error:", error);

        if (error?.code === 404) {
            return Response.json(
                {
                    success: false,
                    error: "Email not found",
                },
                { status: 404 }
            );
        }

        if (error?.code === 401 || error?.response?.status === 401) {
            return Response.json(
                {
                    success: false,
                    error: "Google authentication has expired. Please sign in again.",
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: false,
                error: "Failed to investigate email",
            },
            { status: 500 }
        );
    }
}