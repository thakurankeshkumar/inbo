import { google } from "googleapis";
import { cookies, headers } from "next/headers";
import { emailParser } from "@/app/lib/emailParser";
import { analyzeHeaders } from "@/app/lib/headerAnalyzer";

export async function GET() {
    const cookiesStore = await cookies();
    const tokenCookies = cookiesStore.get("google_tokens");
    if (!tokenCookies) {
        return Response.json({ error: "Not authenticated with Google" }, { status: 401 });
    }

    const tokens = JSON.parse(tokenCookies.value);
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({
        version: "v1",
        auth: oauth2Client,
    });

    const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: 10,
    })

    const messages = response.data.messages || [];
    const emails = []

    for (const message of messages) {
        const emailResponse = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
            format: "metadata",
            metadataHeaders: ["From", "To", "Subject", "Date"]
        })
        const headers = emailResponse.data.payload?.headers || [];

        const getHeader = (name) => {
            const header = headers.find(
                (header) =>
                    header.name.toLowerCase() === name.toLowerCase()
            );

            return header?.value || "";
        };
        // const parsedEmail = emailParser(emailResponse.data);
        // const headerAnalysis = analyzeHeaders(parsedEmail.headers)
        emails.push({
            id: emailResponse.data.id,
            threadId: emailResponse.data.threadId,
            from: getHeader("From"),
            to: getHeader("To"),
            subject: getHeader("Subject"),
            date: getHeader("Date"),
            snippet: emailResponse.data.snippet || "",
        });
    }



    return Response.json({ emails });
}