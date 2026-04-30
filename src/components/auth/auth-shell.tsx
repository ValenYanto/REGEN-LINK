import Image from "next/image";
import Link from "next/link";
import { Activity, Network } from "lucide-react";

import { Separator } from "@/components/ui/separator";

type AuthShellProps = {
    mode: "login" | "register";
    children: React.ReactNode;
};

export function AuthShell({ mode, children }: AuthShellProps) {
    const isLogin = mode === "login";

    return (
        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#f4f7f8] text-[#111827]">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#00a66a]/8 blur-3xl" />
                <div className="absolute bottom-20 right-20 h-[340px] w-[340px] rounded-full bg-[#0b6b4b]/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,95,70,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(6,95,70,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
            </div>

            <section className="relative z-10 flex flex-1 items-center justify-center px-5 py-12">
                <div className="w-full max-w-[470px]">
                    <div className="rounded-[6px] border border-[#cbd5dc] bg-white/95 px-8 py-9 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur md:px-10">
                        <div className="flex flex-col items-center text-center">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                                    <Image
                                        src="/logo.png"
                                        alt="REGEN-LINK Logo"
                                        fill
                                        sizes="44px"
                                        className="object-contain"
                                        priority
                                    />
                                </div>

                                <div className="text-left">
                                    <h1 className="text-[28px] font-black uppercase leading-none tracking-[0.16em] text-[#005c43]">
                                        REGEN-LINK
                                    </h1>
                                    <p className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#7b8a85]">
                                        {isLogin
                                            ? "V3.2 Scientific Node Access"
                                            : "V3.2 New Node Registration"}
                                    </p>
                                </div>
                            </Link>

                            <Separator className="mt-7 bg-[#d9e1e5]" />
                        </div>

                        <div className="mt-8">{children}</div>
                    </div>

                    <div className="mt-7 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa8a4]">
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#2ed5a0]" />
                            System Ready
                        </span>
                        <span>•</span>
                        <span>Encryption: AES-256-GCM</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">Node: 12.0.4.1</span>
                    </div>
                </div>
            </section>

            <footer className="relative z-10 border-t border-[#dce3e7] bg-white/70 px-6 py-7">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#8d9bb3] md:flex-row md:items-center md:justify-between">
                    <p>© 2026 REGEN-LINK. Technical Precision Logistics.</p>

                    <div className="flex flex-wrap gap-7">
                        <Link href="#" className="transition hover:text-[#005c43]">
                            Privacy Protocol
                        </Link>
                        <Link href="#" className="transition hover:text-[#005c43]">
                            API Docs
                        </Link>
                        <Link href="#" className="transition hover:text-[#005c43]">
                            Compliance
                        </Link>
                        <Link href="#" className="transition hover:text-[#005c43]">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}

export function AuthSystemIcon() {
    return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#cbd5dc] bg-[#f6faf9] text-[#005c43]">
            <Network size={18} />
        </div>
    );
}

export function AuthStatusLine() {
    return (
        <div className="mt-7 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#7b8a85]">
            <Activity size={13} className="text-[#00a66a]" />
            Secure regenerative access layer active
        </div>
    );
}