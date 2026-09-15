export function getHeader(headers, name) {
    const header = headers.find((header) => header.name.toLowerCase() === name.toLowerCase());
    return header?.value || "";
}


export function emailParser(message) {
    const headers = message.payload?.headers || [];
    return {
        id: message.id,
        threadId: message.threadId,

        from: getHeader(headers, "From"),
        to: getHeader(headers, "To"),
        subject: getHeader(headers, "Subject"),
        date: getHeader(headers, "Date"),

        messageId: getHeader(headers, "Message-ID"),
        replyTo: getHeader(headers, "Reply-To"),
        returnPath: getHeader(headers, "Return-Path"),

        headers,

        snippet: message.snippet || "",

        body: extractBody(message.payload),
    };
}



function decodeBase64Url(data) {
    if (!data) return "";
    return Buffer.from(data, "base64url").toString("utf-8");
}


function extractBody(payload) {
    if (!payload) return "";

    if (payload.body?.data) {
        return decodeBase64Url(payload.body.data);
    }

    if (payload.parts) {
        for (const part of payload.parts) {
            if (part.mimeType === "text/plain" && part.body?.data) {
                return decodeBase64Url(part.body.data);
            }
        }
        for (const part of payload.parts) {
            const body = extractBody(part);
            if (body) {
                return body;
            }
        }
    }
    return "";


}