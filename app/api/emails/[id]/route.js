import { google } from "googleapis";
import { cookies } from "next/headers";
import { emailParser } from "@/app/lib/emailParser";



export async function GET(request, { params }) {
    const cookiesStore = await cookies();
    const tokenCookie = cookiesStore.get("google_tokens");
    if (!tokenCookie) {
        return Response.json({ error: "Not authenticated with google" }, { status: 401 })
    }

    const tokens = JSON.parse(tokenCookie.value);
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

    const { id } = await params;
    const response = await gmail.users.messages.get({
        userId: "me",
        id: id,
        format: "full",
    });

    const email = emailParser(response.data);
    return Response.json({ email, });
}