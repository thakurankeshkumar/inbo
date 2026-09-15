import { Snippet } from "next/font/google";

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
    };
}