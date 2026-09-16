import { google } from "googleapis";
import { cookies } from "next/headers";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
        return Response.json({ error: "Authorization code not found" }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const cookieStore = await cookies();
    const storedState = cookieStore.get("oauth_state")?.value;

    if (!state || !storedState || state !== storedState) { return Response.json({ error: "Invalid OAuth state", }, { status: 400, }); }
    const { tokens } = await oauth2Client.getToken(code);

    cookieStore.set("google_tokens", JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
    cookieStore.delete("oauth_state");

    return Response.redirect("http://localhost:3000/emails")
}