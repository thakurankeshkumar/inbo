"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";


// =====================================================
// HELPER: GET SENDER NAME
// =====================================================

function getSenderName(sender) {
    if (!sender) { return "Unknown sender"; }
    if (sender.includes("<")) {
        return sender.split("<")[0].trim();
    }
    return sender.split("@")[0];
}


// =====================================================
// HELPER: GET INITIAL
// =====================================================

function getInitial(sender) {
    const name = getSenderName(sender);
    return name.charAt(0).toUpperCase() || "?";
}


// =====================================================
// AI CLASSIFICATION STYLE
// =====================================================

function getClassificationStyle(classification) {
    switch (classification?.toLowerCase()) {
        case "phishing":
            return {
                label: "Phishing detected",
                bg: "bg-[#FFF1F1]",
                border: "border-[#FFD5D5]",
                text: "text-[#D92D20]",
                dot: "bg-[#EF4444]",
            };

        case "suspicious":
            return {
                label: "Suspicious email",
                bg: "bg-[#FFF8E8]",
                border: "border-[#FDE5B0]",
                text: "text-[#C77A00]",
                dot: "bg-[#F59E0B]",
            };

        case "safe":
            return {
                label: "No significant threat detected",
                bg: "bg-[#ECFDF3]",
                border: "border-[#C9F0D9]",
                text: "text-[#16824A]",
                dot: "bg-[#22A55A]",
            };

        default:
            return {
                label: "Analysis completed",
                bg: "bg-[#F3F6FA]",
                border: "border-[#E1E7EF]",
                text: "text-[#475467]",
                dot: "bg-[#98A2B3]",
            };
    }
}


// =====================================================
// SKELETON
// =====================================================

function EmailDetailsSkeleton() {
    return (
        <main className="min-h-screen bg-[#F8FAFD]">
            {/* Header */}
            <header className="border-b border-[#E7EBF2] bg-white">
                <div className="mx-auto flex h-[82px] max-w-[1400px] items-center px-5 sm:px-8">
                    <div className="h-8 w-24 animate-pulse rounded bg-[#E8EDF4]" />
                    <div className="ml-auto h-10 w-36 animate-pulse rounded-full bg-[#EEF2F7]" />
                </div>
            </header>

            {/* Content */}

            <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
                <div className="h-5 w-28 animate-pulse rounded bg-[#E6EBF2]" />
                <div className="mt-6 rounded-3xl border border-[#E4E9F0] bg-white p-7">
                    <div className="flex gap-4">
                        <div className="h-14 w-14 animate-pulse rounded-full bg-[#E8EDF5]" />
                        <div className="flex-1">
                            <div className="h-5 w-48 animate-pulse rounded bg-[#E6EBF2]" />
                            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-[#EEF1F5]" />
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="h-5 w-3/4 animate-pulse rounded bg-[#EEF1F5]" />
                        <div className="h-5 w-full animate-pulse rounded bg-[#EEF1F5]" />
                        <div className="h-5 w-5/6 animate-pulse rounded bg-[#EEF1F5]" />
                        <div className="h-5 w-2/3 animate-pulse rounded bg-[#EEF1F5]" />
                    </div>
                </div>
            </div>
        </main>
    );
}


// =====================================================
// MAIN PAGE
// =====================================================

export default function EmailDetailsPage() {
    const params = useParams();
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [investigating, setInvestigating] = useState(false);
    const [result, setResult] = useState(null);


    // =================================================
    // FETCH EMAIL
    // =================================================

    useEffect(() => {
        async function fetchEmail() {
            try {
                setLoading(true);
                const response = await fetch(`/api/emails/${params.id}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch email");
                }
                setEmail(data.email);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) { fetchEmail(); }
    }, [params.id]);


    // =================================================
    // INVESTIGATE EMAIL
    // =================================================

    async function investigateEmail() {
        try {
            setInvestigating(true);
            setError("");
            const response = await fetch(`/api/emails/${params.id}/investigate`, { method: "POST", });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error || "Investigation failed"); }
            setResult(data.result);
        } catch (error) {
            setError(error.message);
        } finally {
            setInvestigating(false);
        }
    }


    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return <EmailDetailsSkeleton />;
    }


    // =================================================
    // ERROR
    // =================================================

    if (error && !email) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-5">
                <div className="w-full max-w-md rounded-3xl border border-[#E4E9F0] bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF1F1] text-[#D92D20]">!</div>
                    <h1 className="mt-4 text-lg font-semibold text-[#182230]">Unable to open email</h1>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">{error}</p>
                    <Link href="/emails" className="mt-6 inline-flex rounded-xl bg-[#2453C5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E47AA]">
                        Back to inbox
                    </Link>
                </div>
            </main>
        );
    }


    // =================================================
    // EMAIL INFORMATION
    // =================================================

    const senderName = getSenderName(email?.from);
    const senderInitial = getInitial(email?.from);


    return (
        <main className="min-h-screen bg-[#F8FAFD] text-[#111827]">
            {/* =================================================
                HEADER
            ================================================= */}
            <header className="border-b border-[#E7EBF2] bg-white">
                <div className="mx-auto flex h-[82px] max-w-[1400px] items-center px-5 sm:px-8">
                    {/* Logo */}
                    <Link href="/emails" className="flex items-center gap-3">
                        <div className="flex items-end gap-1">
                            <span className="h-7 w-3 rounded-full bg-[#2453C5]" />
                            <span className="h-10 w-3 rounded-full bg-[#5BA9E8]" />
                        </div>
                        <span className="text-[27px] font-bold tracking-[-0.04em]">Inbo</span>
                    </Link>

                    {/* Back to inbox */}

                    <Link href="/emails" className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#52617A] transition hover:bg-[#F3F6FA]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M19 12H5M11 18l-6-6 6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Back to inbox
                    </Link>
                </div>
            </header>


            {/* =================================================
                PAGE CONTENT
            ================================================= */}

            <div className="mx-auto max-w-[1100px] px-5 py-7 sm:px-8 sm:py-9">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-[#8A95A8]">
                    <Link href="/emails" className="transition hover:text-[#2453C5]"> Inbox</Link>
                    <span>/</span>
                    <span className="text-[#52617A]">Email</span>
                </div>


                {/* =================================================
                    EMAIL CARD
                ================================================= */}

                <section className="overflow-hidden rounded-3xl border border-[#E2E7EF] bg-white shadow-[0_8px_35px_rgba(31,55,90,0.04)]">
                    {/* Email header */}
                    <div className="border-b border-[#EDF0F4] px-6 py-7 sm:px-8">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E4EEFF] text-lg font-semibold text-[#2453C5]">
                                {senderInitial}
                            </div>
                            {/* Sender */}
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl font-bold tracking-[-0.02em] text-[#15284D]">
                                    {email.subject || "No subject"}
                                </h1>
                                <div className="mt-3 space-y-1">
                                    <p className="truncate text-sm font-semibold text-[#344054]">{senderName}</p>
                                    <p className="truncate text-sm text-[#8A95A8]">{email.from}</p>
                                    <p className="truncate text-sm text-[#8A95A8]">To: {email.to}</p>
                                </div>
                            </div>
                            {/* Date */}
                            <div className="hidden shrink-0 text-right sm:block">
                                <p className="text-sm text-[#7A879B]">{email.date}</p>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        EMAIL BODY
                    ================================================= */}

                    <div className="px-6 py-8 sm:px-8">
                        <div className="max-w-none whitespace-pre-wrap break-words text-[15px] leading-7 text-[#344054]">
                            {email.body || "No email body available."}
                        </div>
                    </div>


                    {/* =================================================
                        ACTION AREA
                    ================================================= */}

                    <div className="border-t border-[#EDF0F4] bg-[#FBFCFE] px-6 py-6 sm:px-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#24324A]">Ready to investigate?</p>
                                <p className="mt-1 text-sm text-[#8A95A8]">
                                    Analyze authentication, URLs and email content with AI.
                                </p>
                            </div>
                            <button type="button" onClick={investigateEmail} disabled={investigating}
                                className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-[#2453C5] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E47AA] disabled:cursor-not-allowed disabled:opacity-60">

                                {investigating ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Investigating...
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M9 3h6M10 3v4l-4.5 8.2A3 3 0 0 0 8.1 20h7.8a3 3 0 0 0 2.6-4.8L14 7V3"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            <path
                                                d="M8 15h8"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        Investigate Email
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </section>


                {/* =================================================
                    ERROR DURING INVESTIGATION
                ================================================= */}

                {error && email && (
                    <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}


                {/* =================================================
                    INVESTIGATION RESULT
                ================================================= */}

                {result && (
                    <section className="mt-7 space-y-5">
                        {/* =================================================
                            AI THREAT ANALYSIS
                        ================================================= */}
                        {result.aiAnalysis && (() => {
                            const classification = getClassificationStyle(result.aiAnalysis.classification);
                            const confidence = Math.round((result.aiAnalysis.confidence || 0) * 100);
                            return (
                                <div className="rounded-3xl border border-[#E2E7EF] bg-white p-6 shadow-[0_8px_35px_rgba(31,55,90,0.04)] sm:p-8">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2453C5]">
                                                AI THREAT ANALYSIS
                                            </p>
                                            <h2 className="mt-2 text-xl font-bold text-[#15284D]">
                                                Investigation result
                                            </h2>
                                        </div>
                                        <div
                                            className={`rounded-full px-4 py-2 text-sm font-semibold ${classification.bg} ${classification.text}`}>
                                            {confidence}% confidence
                                        </div>
                                    </div>
                                    {/* Classification */}
                                    <div className={`mt-6 rounded-2xl border p-5 ${classification.bg} ${classification.border}`}>
                                        <div className="flex items-center gap-3">
                                            <span className={`h-3 w-3 rounded-full ${classification.dot}`} />
                                            <span className={`text-base font-bold ${classification.text}`}>{classification.label}</span>
                                        </div>
                                        {result.aiAnalysis.summary && (
                                            <p className="mt-3 text-sm leading-6 text-[#475467]">
                                                {result.aiAnalysis.summary}
                                            </p>
                                        )}
                                    </div>
                                    {/* AI Indicators */}

                                    <div className="mt-7">
                                        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#52617A]">
                                            AI indicators
                                        </h3>
                                        {result.aiAnalysis.indicators?.length === 0 ? (
                                            <div className="mt-3 rounded-2xl border border-[#E8EDF3] bg-[#FBFCFE] px-5 py-4">
                                                <p className="text-sm text-[#667085]">
                                                    No suspicious indicators detected.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mt-3 space-y-3">
                                                {result.aiAnalysis.indicators.map(
                                                    (indicator, index) => (
                                                        <div key={index} className="rounded-2xl border border-[#E8EDF3] bg-[#FBFCFE] p-5">
                                                            <div className="flex items-center gap-3">
                                                                <span className={`h-2.5 w-2.5 rounded-full ${indicator.severity === "high"
                                                                    ? "bg-[#EF4444]"
                                                                    : indicator.severity === "medium"
                                                                        ? "bg-[#F59E0B]"
                                                                        : "bg-[#22A55A]"
                                                                    }`}
                                                                />
                                                                <p className="text-sm font-semibold capitalize text-[#253858]">{indicator.type}</p>
                                                                <span className="ml-auto text-xs font-semibold uppercase text-[#8A95A8]">
                                                                    {indicator.severity}
                                                                </span>
                                                            </div>
                                                            <p className="mt-3 text-sm leading-6 text-[#667085]">
                                                                {indicator.explanation}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                        {/* =================================================
                            TECHNICAL ANALYSIS
                        ================================================= */}

                        <div className="rounded-3xl border border-[#E2E7EF] bg-white p-6 shadow-[0_8px_35px_rgba(31,55,90,0.04)] sm:p-8">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2453C5]">TECHNICAL ANALYSIS</p>
                                <h2 className="mt-2 text-xl font-bold text-[#15284D]">Email security evidence</h2>
                                <p className="mt-2 text-sm text-[#8A95A8]">
                                    Deterministic checks performed on the selected email.
                                </p>
                            </div>

                            {/* =================================================
                                AUTHENTICATION
                            ================================================= */}

                            <div className="mt-7">
                                <h3 className="text-sm font-bold text-[#253858]">
                                    Authentication
                                </h3>
                                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                    {[
                                        {
                                            name: "SPF",
                                            value: result.security?.headers?.authentication?.spf,
                                        },
                                        {
                                            name: "DKIM",
                                            value: result.security?.headers?.authentication?.dkim,
                                        },
                                        {
                                            name: "DMARC",
                                            value: result.security?.headers?.authentication?.dmarc,
                                        },
                                    ].map((item) => {
                                        const passed = item.value === "pass";
                                        return (
                                            <div key={item.name} className="rounded-2xl border border-[#E8EDF3] bg-[#FBFCFE] p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-[#344054]">{item.name}</span>
                                                    <span className={`h-2.5 w-2.5 rounded-full ${passed ? "bg-[#22A55A]" : item.value === "fail"
                                                        ? "bg-[#EF4444]" : "bg-[#98A2B3]"}`} />
                                                </div>
                                                <p className={`mt-2 text-sm font-semibold capitalize ${passed ? "text-[#16824A]" : item.value === "fail"
                                                    ? "text-[#D92D20]" : "text-[#667085]"}`}>{item.value || "unknown"}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                            {/* =================================================
                                HEADER FINDINGS
                            ================================================= */}
                            <div className="mt-8">
                                <h3 className="text-sm font-bold text-[#253858]">
                                    Header findings
                                </h3>
                                {result.security?.headers?.findings?.length === 0 ? (
                                    <div className="mt-3 rounded-2xl border border-[#DCEFE3] bg-[#F3FBF6] px-5 py-4">
                                        <p className="text-sm text-[#287A4B]">
                                            No security findings from the authentication headers.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-3 space-y-3">
                                        {result.security.headers.findings.map(
                                            (finding, index) => (
                                                <div key={index} className="rounded-2xl border border-[#FDE0E0] bg-[#FFF7F7] p-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                                                        <span className="text-sm font-semibold text-[#B42318]">{finding.type}</span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-[#667085]">{finding.description}</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>


                            {/* =================================================
                                URL ANALYSIS
                            ================================================= */}

                            <div className="mt-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-[#253858]">
                                        URL analysis
                                    </h3>

                                    <span className="rounded-full bg-[#F1F5FA] px-3 py-1 text-xs font-semibold text-[#667085]">
                                        {result.security?.urls?.length || 0} URLs
                                    </span>

                                </div>


                                {result.security?.urls?.length === 0 ? (

                                    <div className="mt-3 rounded-2xl border border-[#E8EDF3] bg-[#FBFCFE] px-5 py-4">

                                        <p className="text-sm text-[#667085]">
                                            No URLs found in this email.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="mt-3 space-y-3">

                                        {result.security.urls.map(
                                            (url, index) => (

                                                <div
                                                    key={index}
                                                    className="rounded-2xl border border-[#E8EDF3] bg-[#FBFCFE] p-5"
                                                >

                                                    <div className="flex items-start justify-between gap-4">

                                                        <div className="min-w-0">

                                                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8A95A8]">
                                                                Domain
                                                            </p>

                                                            <p className="mt-1 truncate text-sm font-semibold text-[#253858]">
                                                                {url.domain || "Unknown"}
                                                            </p>

                                                        </div>


                                                        <span
                                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${url.https
                                                                ? "bg-[#ECFDF3] text-[#16824A]"
                                                                : "bg-[#FFF1F1] text-[#D92D20]"
                                                                }`}
                                                        >
                                                            {url.https
                                                                ? "HTTPS"
                                                                : "HTTP"}
                                                        </span>

                                                    </div>


                                                    <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-[#E8EDF3]">

                                                        <p className="break-all text-xs leading-5 text-[#667085]">
                                                            {url.url}
                                                        </p>

                                                    </div>


                                                    {url.findings?.length > 0 && (

                                                        <div className="mt-3 space-y-2">

                                                            {url.findings.map(
                                                                (finding, findingIndex) => (

                                                                    <div
                                                                        key={findingIndex}
                                                                        className="rounded-xl bg-[#FFF8E8] px-4 py-3"
                                                                    >

                                                                        <p className="text-xs font-semibold text-[#A15C00]">
                                                                            {finding.severity}
                                                                        </p>

                                                                        <p className="mt-1 text-xs leading-5 text-[#667085]">
                                                                            {finding.description}
                                                                        </p>

                                                                    </div>

                                                                )
                                                            )}

                                                        </div>

                                                    )}

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                RECEIVED HEADERS
                            ================================================= */}

                            <div className="mt-8">

                                <h3 className="text-sm font-bold text-[#253858]">
                                    Received headers
                                </h3>

                                <p className="mt-1 text-xs text-[#98A2B3]">
                                    Mail relay information observed in the message headers.
                                </p>


                                {result.security?.headers?.received?.length === 0 ? (

                                    <div className="mt-3 rounded-2xl border border-[#E8EDF3] bg-[#FBFCFE] px-5 py-4">

                                        <p className="text-sm text-[#667085]">
                                            No received headers available.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="mt-3 space-y-2">

                                        {result.security.headers.received.map(
                                            (header, index) => (

                                                <div
                                                    key={index}
                                                    className="rounded-2xl bg-[#F7F9FC] p-4"
                                                >

                                                    <p className="break-words font-mono text-xs leading-6 text-[#667085]">
                                                        {header}
                                                    </p>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    </section>

                )}

            </div>

        </main>
    );
}