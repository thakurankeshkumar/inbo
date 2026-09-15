"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EmailDetailsPage() {
    const params = useParams();

    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [investigating, setInvestigating] = useState(false);
    const [result, setResult] = useState(null);

    async function investigateEmail() {
        try {
            setInvestigating(true);

            const response = await fetch(
                `/api/emails/${params.id}/investigate`,
                {
                    method: "POST",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Investigation failed"
                );
            }

            setResult(data.result);

        } catch (error) {
            setError(error.message);
        } finally {
            setInvestigating(false);
        }
    }

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
            <button onClick={investigateEmail} disabled={investigating}>{investigating ? "Investigating..." : "Investigate Email"}</button>
            {result && (
                <div>
                    <h2>Investigation Result</h2>

                    <h3>Authentication</h3>

                    <p>
                        SPF: {result.security.authentication.spf}
                    </p>

                    <p>
                        DKIM: {result.security.authentication.dkim}
                    </p>

                    <p>
                        DMARC: {result.security.authentication.dmarc}
                    </p>

                    <h3>Findings</h3>

                    {result.security.findings.length === 0 ? (
                        <p>No security findings.</p>
                    ) : (
                        result.security.findings.map((finding, index) => (
                            <div key={index}>
                                <strong>{finding.type}</strong>
                                <p>{finding.description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </main>
    );
}