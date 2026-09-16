import { google } from "googleapis";
import { cookies } from "next/headers";

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("google_tokens");

        if (!tokenCookie) {
            return Response.json(
                {
                    error: "Not authenticated with Google",
                },
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

        // Get pagination token from URL
        const { searchParams } = new URL(request.url);
        const pageToken = searchParams.get("pageToken");

        // Get 10 message IDs
        const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: 10,
            ...(pageToken ? { pageToken } : {}),
        });

        const messages = response.data.messages || [];

        // Fetch useful metadata for each email
        const emails = await Promise.all(
            messages.map(async (message) => {
                const emailResponse =
                    await gmail.users.messages.get({
                        userId: "me",
                        id: message.id,
                        format: "metadata",
                        metadataHeaders: [
                            "From",
                            "To",
                            "Subject",
                            "Date",
                        ],
                    });

                const email = emailResponse.data;

                const headers =
                    email.payload?.headers || [];

                function getHeader(name) {
                    const header = headers.find(
                        (header) =>
                            header.name.toLowerCase() ===
                            name.toLowerCase()
                    );

                    return header?.value || "";
                }

                return {
                    id: email.id,
                    threadId: email.threadId,
                    from: getHeader("From"),
                    to: getHeader("To"),
                    subject:
                        getHeader("Subject") || "No subject",
                    date: getHeader("Date"),
                    snippet: email.snippet || "",
                };
            })
        );

        // Get authenticated Gmail address
        const profileResponse =
            await gmail.users.getProfile({
                userId: "me",
            });

        return Response.json({
            success: true,
            emails,
            nextPageToken:
                response.data.nextPageToken || null,
            user: {
                email: profileResponse.data.emailAddress,
            },
        });

    } catch (error) {
        console.error("Fetch emails error:", error);

        return Response.json(
            {
                success: false,
                error: "Failed to fetch emails",
            },
            { status: 500 }
        );
    }
}