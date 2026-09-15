import { google } from "googleapis";
import { cookies } from "next/headers";

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
            format: "full",
        })
        emails.push(emailResponse.data);
    }



    return Response.json({ emails });
}