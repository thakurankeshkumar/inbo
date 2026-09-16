"use client";

import { useRouter } from "next/navigation";

const pageWidth = "mx-auto w-full max-w-[1440px] px-[clamp(20px,5vw,80px)]";

function InboMark({ small = false }) {
    return (
        <span className={`flex items-end gap-1 ${small ? "h-6" : "h-8"}`} aria-hidden="true">
            <span className={`rounded-full bg-[#1262d6] ${small ? "h-5 w-2" : "h-7 w-3"}`} />
            <span className={`rounded-full bg-[#1262d6] ${small ? "h-6 w-2" : "h-8 w-3"}`} />
        </span>
    );
}

function GoogleIcon() {
    return (
        <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.18-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z" />
            <path fill="#34A853" d="M12 21.9c2.63 0 4.84-.87 6.45-2.37l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.55 0-4.71-1.72-5.48-4.03H3.27v2.52A9.75 9.75 0 0 0 12 21.9Z" />
            <path fill="#FBBC05" d="M6.52 13.98A5.86 5.86 0 0 1 6.21 12c0-.69.12-1.36.31-1.98V7.5H3.27A9.92 9.92 0 0 0 2.1 12c0 1.62.39 3.15 1.17 4.5l3.25-2.52Z" />
            <path fill="#EA4335" d="M12 5.99c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.08 14.63 2.1 12 2.1a9.75 9.75 0 0 0-8.73 5.4l3.25 2.52C7.29 7.71 9.45 5.99 12 5.99Z" />
        </svg>
    );
}

function OutlookIcon() {
    return (
        <span className="grid grid-cols-2 gap-0.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#303236]" />
            <span className="h-2.5 w-2.5 rounded-xs bg-[#303236]" />
            <span className="h-2.5 w-2.5 rounded-xs bg-[#303236]" />
            <span className="h-2.5 w-2.5 rounded-xs bg-[#303236]" />
        </span>
    );
}

function FeatureIcon({ type }) {
    if (type === "shield") {
        return <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-2.9 7.8-7 10-4.1-2.2-7-5.5-7-10V6l7-3Z" /><path d="m8.7 12 2.1 2.1 4.5-4.5" /></svg>;
    }
    if (type === "chart") {
        return <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 19h16M6 17v-4M11 17V8M16 17v-7M21 17V5" /></svg>;
    }
    return <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>;
}

function InboxPreview() {
    const rows = ["w-32", "w-24"];

    return (
        <div className="relative w-full min-w-0">
            <div className="absolute right-[-7%] top-[-12%] aspect-square w-[68%] rounded-[48%] bg-[#e7f3ff]" />
            <div className="absolute bottom-[-10%] left-[-9%] aspect-[1.2] w-[45%] rounded-[48%] bg-[#eef8ff]" />
            <div className="relative mx-auto aspect-[1.55] w-full overflow-hidden rounded-[clamp(16px,2vw,24px)] border border-[#e7edf4] bg-white shadow-[0_22px_55px_rgba(24,76,140,0.11)]">
                <div className="flex h-[14%] items-center gap-2 border-b border-[#edf1f5] px-[4%]"><InboMark small /><span className="text-[clamp(14px,1.5vw,20px)] font-bold tracking-[-0.04em] text-[#102f66]">Inbo</span><span className="ml-auto flex aspect-square w-[6%] items-center justify-center rounded-full bg-[#eff6ff] text-[clamp(10px,1vw,14px)] text-[#123b76]">A</span></div>
                <div className="grid h-[86%] grid-cols-[22%_78%]">
                    <aside className="border-r border-[#edf1f5] bg-[#fbfdff] p-[8%] text-[clamp(7px,0.8vw,11px)]"><div className="mb-[18%] flex items-center gap-2 rounded-lg bg-[#e8f3ff] px-[10%] py-[9%] font-medium text-[#164d91]">✉ <span>Inbox</span></div><div className="mb-[18%] flex items-center gap-2 px-[10%] font-medium text-[#475b75]">▥ <span>Analysis</span></div><div className="flex items-center gap-2 px-[10%] font-medium text-[#475b75]">⚙ <span>Settings</span></div></aside>
                    <div className="p-[4%]"><div className="mb-[4%] flex items-center gap-[3%] px-[1%] py-[1%]"><span className="aspect-square w-[8%] rounded-full bg-[#e8edf2]" /><div className="flex-1 space-y-[3%]"><span className="block h-2 w-32 max-w-full rounded-full bg-[#e5eaf0]" /><span className="block h-2 w-20 max-w-full rounded-full bg-[#e5eaf0]" /></div><span className="text-lg text-[#aeb9c6]">›</span></div><div className="mb-[4%] flex items-center gap-[3%] rounded-lg bg-[#fff0f0] px-[3%] py-[3%] text-[clamp(7px,0.8vw,11px)] text-[#db3d3d]"><span className="flex aspect-square w-[8%] items-center justify-center rounded-full bg-[#ee4b4b] text-base font-bold text-white">!</span><span className="flex-1 font-medium">Suspicious email detected</span><span className="text-lg">›</span></div>{rows.map((width) => <div className="mb-[5%] flex items-center gap-[3%] px-[1%]" key={width}><span className="aspect-square w-[8%] rounded-full bg-[#e8edf2]" /><div className="flex-1 space-y-[3%]"><span className={`block h-2 ${width} max-w-full rounded-full bg-[#e5eaf0]`} /><span className="block h-2 w-20 max-w-full rounded-full bg-[#e5eaf0]" /></div><span className="text-lg text-[#aeb9c6]">›</span></div>)}</div>
                </div>
            </div>
        </div>
    );
}

export default function HomePage() {
    const router = useRouter();

    function handleGoogleLogin() {
        router.push("/api/auth/google");
    }

    return (
        <main className="min-h-screen overflow-x-hidden bg-white text-[#0d1728]">
            <header className={`${pageWidth} flex min-h-[88px] items-center justify-between gap-6 py-5`}>
                <a href="#about" className="flex shrink-0 items-center gap-2.5"><InboMark /><span className="text-[clamp(24px,2.2vw,32px)] font-bold tracking-[-0.06em] text-[#123567]">Inbo</span></a>
                <nav className="hidden items-center gap-[clamp(24px,3vw,48px)] text-xs font-medium text-[#1e2d45] md:flex"><a href="#about" className="hover:text-[#1262d6]">About</a><a href="#how-it-works" className="hover:text-[#1262d6]">How it works</a><a href="#privacy" className="hover:text-[#1262d6]">Privacy</a></nav>
                <div className="shrink-0 rounded-full bg-[#e7f2ff] px-[clamp(14px,1.7vw,24px)] py-3 text-[clamp(10px,0.9vw,13px)] font-medium text-[#1750a1]">Safer inboxes. Always.</div>
            </header>

            <section id="about" className={`${pageWidth} flex min-h-[calc(100svh-88px)] items-center pb-[clamp(64px,9vh,120px)] pt-[clamp(48px,8vh,108px)] max-lg:min-h-0`}>
                <div className="grid w-full min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-[clamp(48px,7vw,112px)] max-lg:grid-cols-1 max-lg:gap-16">
                    <div className="min-w-0 max-w-[590px]">
                        <p className="mb-[clamp(20px,2.5vh,32px)] text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6c9edc]">A safer tomorrow</p>
                        <h1 className="text-[clamp(48px,5.2vw,78px)] font-bold leading-[1.02] tracking-[-0.065em]">A safer inbox<br /><span className="text-[#1469d9]">starts here.</span></h1>
                        <p className="mt-[clamp(20px,3vh,32px)] max-w-[470px] text-[clamp(16px,1.35vw,20px)] leading-7 text-[#536b8d]">Inbo helps you detect email threats and<br className="hidden sm:block" /> focus on what matters.</p>
                        <div className="mt-[clamp(28px,4vh,48px)] flex flex-wrap gap-x-[clamp(20px,3vw,44px)] gap-y-5">{[{ type: "shield", text: "Detects", sub: "threats" }, { type: "chart", text: "Clear", sub: "insights" }, { type: "lock", text: "Your data", sub: "stays private" }].map((feature) => <div className="flex items-center gap-3" key={feature.text}><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-[#123c79]"><FeatureIcon type={feature.type} /></span><span className="text-xs leading-5 text-[#1b2c44]">{feature.text}<br />{feature.sub}</span></div>)}</div>
                        <div className="mt-[clamp(28px,4vh,48px)] flex flex-wrap gap-3"><button onClick={handleGoogleLogin} className="flex h-14 min-w-[236px] flex-1 items-center justify-center gap-4 rounded-full border border-[#dfe5ec] bg-white px-5 text-sm font-semibold text-[#182334] shadow-[0_3px_10px_rgba(20,45,80,0.04)] transition hover:border-[#b8c9df] hover:shadow-md active:scale-[0.99] sm:flex-none"><GoogleIcon />Continue with Google</button><button type="button" disabled className="flex h-14 min-w-[236px] flex-1 items-center justify-center gap-4 rounded-full border border-[#dfe5ec] bg-[#f4f6f8] px-5 text-xs text-[#263344] sm:flex-none"><OutlookIcon /><span>Sign in with Outlook<br /><span className="text-[11px]">(Coming soon)</span></span></button></div>
                    </div>
                    <InboxPreview />
                </div>
            </section>

            <div className={`${pageWidth} flex max-w-[700px] items-center gap-5 pb-20 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-[#8292a9]`}><span className="h-px flex-1 bg-[#dce5ef]" />Built for a safer digital world<span className="h-px flex-1 bg-[#dce5ef]" /></div>
            <section id="how-it-works" className="border-t border-[#edf1f5] bg-[#fbfcfe] px-5 py-20 sm:px-10 lg:px-0"><div className={`${pageWidth} px-0!`}><p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6c9edc]">How it works</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#10233f]">Investigate an email when you need to.</h2><p className="mt-4 max-w-2xl leading-7 text-[#64748b]">Inbo fetches your emails through Google authorization. Select a message whenever you want its technical evidence evaluated for potential threats.</p></div></section>
            <section id="privacy" className="border-t border-[#edf1f5] px-5 py-20 sm:px-10 lg:px-0"><div className={`${pageWidth} px-0!`}><p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6c9edc]">Privacy</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#10233f]">Your inbox stays yours.</h2><p className="mt-4 max-w-2xl leading-7 text-[#64748b]">Inbo uses Google authorization with read-only Gmail access. Investigation starts only when you choose to investigate a specific email.</p></div></section>
            <footer className="border-t border-[#edf1f5] px-5 py-8 sm:px-10 lg:px-0"><div className={`${pageWidth} px-0! flex flex-col items-start justify-between gap-4 text-xs text-[#8593a8] sm:flex-row sm:items-center`}><div className="flex items-center gap-2"><InboMark small /><span className="font-semibold text-[#58708f]">Inbo</span></div><span>© 2026 Inbo. Privacy-first email threat detection.</span></div></footer>
        </main>
    );
}
