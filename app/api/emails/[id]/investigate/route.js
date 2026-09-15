import { google } from "googleapis";
import { cookies } from "next/headers";
import { emailParser } from "@/app/lib/emailParser";
import { analyzeHeaders } from "@/app/lib/headerAnalyzer";


export async function POST(request, { params }) {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("google_tokens");
        if (!tokenCookie) {
            return Response.json({ error: "Not authenticated with google" }, { status: 401 });
        };
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

        const response = await gmail.users.messages.get({
            userId: "me",
            id: id,
            format: "full",
        });

        const email = emailParser(response.data);
        const headerAnalysis = analyzeHeaders(email.headers);

        return Response.json({
            success: true,
            result: {
                email: {
                    id: email.id,
                    from: email.from,
                    to: email.to,
                    subject: email.subject,
                    date: email.date
                },
                security: headerAnalysis,
            },
        });
    } catch (error) {
        console.error("Investigation error: ", error);
        return Response.json({ success: false, error: "Failed to investigate email", }, { status: 500 });
    }
}