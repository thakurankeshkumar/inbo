import { google } from "googleapis";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
    const state = crypto.randomBytes(32).toString("hex");

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/gmail.readonly",
        ],
        state,
        prompt: "consent",
    });

    const cookieStore = await cookies();

    cookieStore.set("oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 10 * 60,
    });

    return Response.redirect(url);
}