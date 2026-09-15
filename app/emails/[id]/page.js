"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EmailDetailsPage() {
    const params = useParams();

    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchEmail() {
            try {
                const response = await fetch(
                    `/api/emails/${params.id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to fetch email"
                    );
                }

                setEmail(data.email);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchEmail();
    }, [params.id]);

    if (loading) {
        return <h1>Loading email...</h1>;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }

    return (
        <main>
            <h1>{email.subject}</h1>

            <p>
                <strong>From:</strong> {email.from}
            </p>

            <p>
                <strong>To:</strong> {email.to}
            </p>

            <p>
                <strong>Date:</strong> {email.date}
            </p>

            <hr />

            <p>{email.body}</p>
        </main>
    );
}