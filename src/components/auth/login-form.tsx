"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
    ArrowLeft,
    Fingerprint,
    KeyRound,
    Loader2,
    RotateCcw,
} from "lucide-react";
import { useState } from "react";

import { AuthStatusLine } from "@/components/auth/auth-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const registered = searchParams.get("registered");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail || !password) {
            setError("Email dan password wajib diisi.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: trimmedEmail,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setError("Email atau password tidak valid.");
                return;
            }

            router.push(callbackUrl);
            router.refresh();
        } catch (error) {
            console.error("[LOGIN_CLIENT_ERROR]", error);
            setError(
                "Terjadi kesalahan koneksi. Pastikan server berjalan dan coba lagi."
            );
        } finally {
            setIsLoading(false);
        }
    }

    function resetCredentials() {
        setEmail("");
        setPassword("");
        setError("");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Button
                asChild
                variant="ghost"
                className="h-auto rounded-none px-0 text-[11px] font-black uppercase tracking-[0.12em] text-[#005c43] hover:bg-transparent hover:text-[#00a66a] dark:text-emerald-300 dark:hover:text-emerald-200"
            >
                <Link href="/">
                    <ArrowLeft className="mr-2 size-3.5" />
                    Back to Landing
                </Link>
            </Button>

            {registered ? (
                <Alert className="border-[#99e6c8] bg-[#ecfdf6] text-[#005c43] dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                    <AlertDescription className="text-xs font-bold uppercase tracking-[0.12em]">
                        Registrasi berhasil. Silakan masuk menggunakan akun baru.
                    </AlertDescription>
                </Alert>
            ) : null}

            {error ? (
                <Alert className="border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
                    <AlertDescription className="text-sm font-semibold">
                        {error}
                    </AlertDescription>
                </Alert>
            ) : null}

            <div className="space-y-2">
                <Label
                    htmlFor="email"
                    className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a] dark:text-slate-300"
                >
                    Email
                </Label>

                <div className="relative">
                    <Fingerprint
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b8a85] dark:text-slate-500"
                    />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="h-[54px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.03em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:border-emerald-300"
                        placeholder="email@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="password"
                    className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a] dark:text-slate-300"
                >
                    Password
                </Label>

                <div className="relative">
                    <KeyRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b8a85] dark:text-slate-500"
                    />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="h-[54px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.03em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:border-emerald-300"
                        placeholder="Masukkan password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        required
                    />
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-3">
                    <Checkbox className="h-5 w-5 rounded-none border-[#98a3ad] data-[state=checked]:border-[#005c43] data-[state=checked]:bg-[#005c43] dark:border-white/20 dark:data-[state=checked]:border-emerald-300 dark:data-[state=checked]:bg-emerald-300" />
                    <span className="text-[11px] font-black uppercase tracking-[0.08em] text-[#7b8a85] dark:text-slate-400">
                        Persistent Session
                    </span>
                </label>

                <button
                    type="button"
                    onClick={resetCredentials}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#005c43] transition hover:text-[#00a66a] disabled:pointer-events-none disabled:opacity-50 dark:text-emerald-300 dark:hover:text-emerald-200"
                >
                    <RotateCcw size={12} />
                    Reset
                </button>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="h-[56px] w-full rounded-none bg-[#00734f] text-[13px] font-black uppercase tracking-[0.18em] text-white shadow-none transition hover:bg-[#005c43] disabled:opacity-70 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Signing In...
                    </>
                ) : (
                    "Sign In"
                )}
            </Button>

            <div className="pt-3 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7b8a85] dark:text-slate-400">
                    Belum punya akun?
                </p>
                <Link
                    href="/register"
                    className="mt-2 inline-block border-b-2 border-[#005c43] text-[12px] font-black uppercase tracking-[0.08em] text-[#005c43] transition hover:text-[#00a66a] dark:border-emerald-300 dark:text-emerald-300 dark:hover:text-emerald-200"
                >
                    Daftar Sekarang
                </Link>
            </div>

            <AuthStatusLine />
        </form>
    );
}