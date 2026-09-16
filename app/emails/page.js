"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function EmailSkeleton() {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-[#E5E9F0] bg-white px-5 py-4">

            {/* Checkbox */}
            <div className="h-5 w-5 shrink-0 animate-pulse rounded border border-[#E2E6ED] bg-[#F1F3F7]" />

            {/* Avatar */}
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-[#E8EDF5]" />

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-2">

                <div className="h-4 w-32 animate-pulse rounded bg-[#E8EDF5]" />

                <div className="h-4 w-56 animate-pulse rounded bg-[#EEF1F5]" />

                <div className="h-3 w-3/4 animate-pulse rounded bg-[#F0F2F6]" />

            </div>

            {/* Status */}
            <div className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-[#E0E5EC]" />

        </div>
    );
}

export default function EmailsPage() {
    const [emails, setEmails] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [nextPageToken, setNextPageToken] = useState(null);

    const [userEmail, setUserEmail] = useState("");


    // =========================
    // FETCH FIRST 10 EMAILS
    // =========================

    useEffect(() => {
        async function fetchEmails() {
            try {
                setLoading(true);

                const response = await fetch("/api/emails");

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to fetch emails"
                    );
                }

                setEmails(data.emails || []);
                setNextPageToken(data.nextPageToken || null);

                if (data.user?.email) {
                    setUserEmail(data.user.email);
                }

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        }

        fetchEmails();
    }, []);


    // =========================
    // FETCH USER EMAIL
    // =========================

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await fetch("/api/auth/profile");

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (data.email) {
                    setUserEmail(data.email);
                }

            } catch {
                // Profile is not required for the inbox.
            }
        }

        fetchUserProfile();
    }, []);


    // =========================
    // LOAD NEXT 10 EMAILS
    // =========================

    async function loadMoreEmails() {
        if (!nextPageToken || loadingMore) {
            return;
        }

        try {
            setLoadingMore(true);

            const response = await fetch(
                `/api/emails?pageToken=${encodeURIComponent(
                    nextPageToken
                )}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to load more emails"
                );
            }

            setEmails((previousEmails) => [
                ...previousEmails,
                ...(data.emails || []),
            ]);

            setNextPageToken(data.nextPageToken || null);

        } catch (error) {
            setError(error.message);

        } finally {
            setLoadingMore(false);
        }
    }


    // =========================
    // SEARCH
    // =========================

    const filteredEmails = useMemo(() => {
        const query = search.toLowerCase().trim();

        if (!query) {
            return emails;
        }

        return emails.filter((email) => {
            return (
                email.subject?.toLowerCase().includes(query) ||
                email.from?.toLowerCase().includes(query) ||
                email.snippet?.toLowerCase().includes(query)
            );
        });
    }, [emails, search]);


    // =========================
    // SKELETON LOADING
    // =========================

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F8FAFD] text-[#111827]">

                {/* Header skeleton */}
                <header className="border-b border-[#E7EBF2] bg-white">
                    <div className="flex h-[86px] items-center px-6 sm:px-8 lg:px-10">

                        <div className="flex w-[230px] items-center gap-3">
                            <div className="h-9 w-6 animate-pulse rounded-full bg-[#E6EBF3]" />
                            <div className="h-7 w-20 animate-pulse rounded bg-[#E6EBF3]" />
                        </div>

                        <div className="h-12 max-w-[760px] flex-1 animate-pulse rounded-full bg-[#F0F3F7]" />

                        <div className="ml-8 h-12 w-32 animate-pulse rounded-full bg-[#E8EDF5]" />

                    </div>
                </header>


                <div className="flex min-h-[calc(100vh-86px)]">

                    {/* Sidebar skeleton */}
                    <aside className="hidden w-[230px] shrink-0 border-r border-[#E2E7EF] bg-white px-5 py-8 lg:block">

                        <div className="h-12 animate-pulse rounded-2xl bg-[#EEF2F7]" />

                        <div className="mt-3 h-12 animate-pulse rounded-2xl bg-[#F4F6F9]" />

                        <div className="mt-8 rounded-2xl bg-[#F1F6FD] p-5">
                            <div className="h-4 w-24 animate-pulse rounded bg-[#DCE8F8]" />
                            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-[#E3ECF8]" />
                        </div>

                    </aside>


                    {/* Email skeletons */}
                    <section className="min-w-0 flex-1">

                        <div className="mx-auto max-w-[1100px] px-5 py-7 sm:px-8">

                            <div className="mb-6">
                                <div className="h-7 w-20 animate-pulse rounded bg-[#E4E9F0]" />
                                <div className="mt-2 h-4 w-20 animate-pulse rounded bg-[#EEF1F5]" />
                            </div>

                            <div className="space-y-2.5">
                                {Array.from({ length: 10 }).map(
                                    (_, index) => (
                                        <EmailSkeleton key={index} />
                                    )
                                )}
                            </div>

                        </div>

                    </section>

                </div>

            </main>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error && emails.length === 0) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F8FAFD] px-6">

                <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                        !
                    </div>

                    <h1 className="mt-4 text-lg font-semibold text-[#1F2937]">
                        Unable to load emails
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-xl bg-[#2453C5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E47AA]"
                    >
                        Try again
                    </button>

                </div>

            </main>
        );
    }


    return (
        <main className="min-h-screen bg-[#F8FAFD] text-[#111827]">

            {/* ================= HEADER ================= */}

            <header className="border-b border-[#E7EBF2] bg-white">

                <div className="flex h-[86px] items-center px-6 sm:px-8 lg:px-10">

                    {/* Logo */}

                    <Link
                        href="/"
                        className="flex w-[230px] shrink-0 items-center gap-3"
                    >

                        <div className="flex items-end gap-1">
                            <span className="h-7 w-3 rounded-full bg-[#2453C5]" />
                            <span className="h-10 w-3 rounded-full bg-[#5BA9E8]" />
                        </div>

                        <span className="text-[28px] font-bold tracking-[-0.04em]">
                            Inbo
                        </span>

                    </Link>


                    {/* Search */}

                    <div className="flex flex-1 px-5">

                        <div className="relative w-full max-w-[760px]">

                            <svg
                                className="absolute left-5 top-1/2 -translate-y-1/2"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="6.5"
                                    stroke="#8290A8"
                                    strokeWidth="2"
                                />

                                <path
                                    d="m16 16 5 5"
                                    stroke="#8290A8"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search emails..."
                                className="h-12 w-full rounded-full border border-[#E1E6EF] bg-[#F5F7FB] pl-14 pr-5 text-sm text-[#111827] outline-none transition focus:border-[#AFC5F5] focus:bg-white focus:ring-4 focus:ring-[#2453C5]/5"
                            />

                        </div>

                    </div>


                    {/* User */}

                    <div className="ml-auto flex min-w-0 items-center">

                        <div
                            title={userEmail || "Google account"}
                            className="max-w-[260px] truncate rounded-full bg-[#EEF4FF] px-5 py-2.5 text-sm font-medium text-[#2453C5]"
                        >
                            {userEmail || "Google account"}
                        </div>

                    </div>

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <div className="flex min-h-[calc(100vh-86px)]">

                {/* ================= SIDEBAR ================= */}

                <aside className="hidden w-[230px] shrink-0 border-r border-[#E2E7EF] bg-white px-5 py-8 lg:flex lg:flex-col">

                    <div className="space-y-2">

                        {/* All */}

                        <div className="flex items-center justify-between rounded-2xl bg-[#E5F0FF] px-4 py-3.5 text-[#2453C5]">

                            <div className="flex items-center gap-3">

                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="14"
                                        rx="2"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />

                                    <path
                                        d="m4 7 8 6 8-6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                <span className="text-sm font-semibold">
                                    All
                                </span>

                            </div>

                            <span className="rounded-full bg-[#D5E6FF] px-2.5 py-1 text-xs font-semibold">
                                {emails.length}
                            </span>

                        </div>


                        {/* Not investigated */}

                        <div className="flex items-center gap-3 px-4 py-3.5 text-[#9AA4B5]">

                            <span className="h-3 w-3 rounded-full bg-[#CBD2DC]" />

                            <span className="text-sm font-medium">
                                Not investigated
                            </span>

                        </div>

                    </div>


                    {/* Bottom information */}

                    <div className="mt-auto rounded-2xl bg-[#F0F6FF] p-5">

                        <div className="flex items-start gap-3">

                            <svg
                                className="mt-0.5 shrink-0 text-[#2453C5]"
                                width="25"
                                height="25"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M12 3 4.5 6v5c0 4.8 3.1 8.9 7.5 10 4.4-1.1 7.5-5.2 7.5-10V6L12 3Z"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                />

                                <path
                                    d="m9 12 2 2 4-4"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <div>

                                <p className="text-sm font-semibold text-[#183A78]">
                                    Safer emails.
                                </p>

                                <p className="mt-1 text-sm text-[#49658E]">
                                    Investigate before you act.
                                </p>

                            </div>

                        </div>

                    </div>

                </aside>


                {/* ================= EMAIL LIST ================= */}

                <section className="min-w-0 flex-1">

                    <div className="mx-auto max-w-[1100px] px-5 py-7 sm:px-8">

                        {/* Heading */}

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h1 className="text-2xl font-bold tracking-tight">
                                    All
                                </h1>

                                <p className="mt-1 text-sm text-[#8A95A8]">
                                    {filteredEmails.length}{" "}
                                    {filteredEmails.length === 1
                                        ? "email"
                                        : "emails"}
                                </p>

                            </div>


                            <div className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[#24324A] shadow-sm ring-1 ring-[#E5E9F0]">
                                Newest
                            </div>

                        </div>


                        {/* Error while loading more */}

                        {error && emails.length > 0 && (
                            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Emails */}

                        <div className="space-y-2.5">

                            {filteredEmails.length === 0 ? (

                                <div className="rounded-2xl border border-[#E4E8EF] bg-white px-6 py-16 text-center">

                                    <p className="font-medium text-[#374151]">
                                        No emails found
                                    </p>

                                    <p className="mt-2 text-sm text-[#9CA3AF]">
                                        Try a different search.
                                    </p>

                                </div>

                            ) : (

                                filteredEmails.map((email) => {

                                    const sender =
                                        email.from || "Unknown sender";

                                    const senderName =
                                        sender.includes("<")
                                            ? sender
                                                .split("<")[0]
                                                .trim()
                                            : sender.split("@")[0];

                                    const initial =
                                        senderName
                                            ?.charAt(0)
                                            ?.toUpperCase() || "?";

                                    return (
                                        <Link
                                            key={email.id}
                                            href={`/emails/${email.id}`}
                                            className="group flex items-center gap-4 rounded-2xl border border-[#E5E9F0] bg-white px-5 py-4 transition-all hover:border-[#C8D8F7] hover:shadow-[0_8px_30px_rgba(36,83,197,0.06)]"
                                        >

                                            {/* Checkbox visual */}

                                            <span
                                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#AEB8C8]"
                                            />


                                            {/* Avatar */}

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E5EFFF] text-base font-semibold text-[#2453C5]">
                                                {initial}
                                            </div>


                                            {/* Email information */}

                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-sm font-semibold text-[#15284D]">
                                                    {senderName}
                                                </p>

                                                <p className="mt-0.5 truncate text-[15px] font-medium text-[#263A60]">
                                                    {email.subject || "No subject"}
                                                </p>

                                                <p className="mt-1 truncate text-sm text-[#8995A9]">
                                                    {email.snippet || "No preview available"}
                                                </p>

                                            </div>


                                            {/* Not investigated */}

                                            <div className="hidden shrink-0 sm:block">
                                                <span
                                                    title="Not investigated"
                                                    className="block h-3 w-3 rounded-full bg-[#CBD2DC]"
                                                />
                                            </div>

                                        </Link>
                                    );
                                })

                            )}

                        </div>


                        {/* ================= LOAD MORE ================= */}

                        {nextPageToken && (
                            <div className="flex justify-center py-8">

                                <button
                                    type="button"
                                    onClick={loadMoreEmails}
                                    disabled={loadingMore}
                                    className="min-w-[170px] rounded-xl border border-[#DCE3ED] bg-white px-6 py-3 text-sm font-semibold text-[#2453C5] shadow-sm transition hover:border-[#BFD0EE] hover:bg-[#F7FAFF] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loadingMore ? (
                                        <span className="flex items-center justify-center gap-2">

                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D5E2F8] border-t-[#2453C5]" />

                                            Loading...

                                        </span>
                                    ) : (
                                        "Load 10 more"
                                    )}
                                </button>

                            </div>
                        )}

                    </div>

                </section>

            </div>

        </main>
    );
}