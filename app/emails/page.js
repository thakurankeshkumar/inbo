"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EmailsPage() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchEmails() {
            try {
                const response = await fetch("/api/emails");

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch emails");
                }

                setEmails(data.emails || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchEmails();
    }, []);

    if (loading) {
        return <h1>Loading emails...</h1>;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }

    return (
        <main>
            <h1>My Emails</h1>

            {emails.map((email) => (
                <div key={email.id}>
                    <Link href={`/emails/${email.id}`}>
                        <h3>{email.subject}</h3>
                        <p>{email.from}</p>
                        <p>{email.snippet}</p>
                    </Link>

                    <hr />
                </div>
            ))}
        </main>
    );
}