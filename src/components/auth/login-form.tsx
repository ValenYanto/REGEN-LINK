"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Fingerprint, KeyRound, Loader2, RotateCcw } from "lucide-react";
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

    const [email, setEmail] = useState("demo@regenlink.id");
    const [password, setPassword] = useState("password123");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
        });

        setIsLoading(false);

        if (result?.error) {
            setError("Access denied. Email atau access protocol tidak valid.");
            return;
        }

        router.push(callbackUrl);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {registered && (
                <Alert className="border-[#99e6c8] bg-[#ecfdf6] text-[#005c43]">
                    <AlertDescription className="text-xs font-bold uppercase tracking-[0.12em]">
                        Node registration accepted. Please establish connection.
                    </AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert className="border-red-200 bg-red-50 text-red-700">
                    <AlertDescription className="text-sm font-semibold">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a]">
                    Researcher ID / Email
                </Label>

                <div className="relative">
                    <Fingerprint
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b8a85]"
                    />
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="h-[54px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.03em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15"
                        placeholder="ID_ALPHA_00"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a]">
                    Access Protocol / Password
                </Label>

                <div className="relative">
                    <KeyRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b8a85]"
                    />
                    <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="h-[54px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.08em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15"
                        placeholder="••••••••••••"
                        required
                    />
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-3">
                    <Checkbox className="h-5 w-5 rounded-none border-[#98a3ad] data-[state=checked]:border-[#005c43] data-[state=checked]:bg-[#005c43]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.08em] text-[#7b8a85]">
                        Persistent Session
                    </span>
                </label>

                <button
                    type="button"
                    onClick={() => {
                        setEmail("");
                        setPassword("");
                        setError("");
                    }}
                    className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#005c43] transition hover:text-[#00a66a]"
                >
                    <RotateCcw size={12} />
                    Reset Credentials
                </button>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="h-[56px] w-full rounded-none bg-[#00734f] text-[13px] font-black uppercase tracking-[0.18em] text-white shadow-none transition hover:bg-[#005c43]"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Establishing...
                    </>
                ) : (
                    "Establish Connection"
                )}
            </Button>

            <div className="pt-3 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7b8a85]">
                    No authorization credentials?
                </p>
                <Link
                    href="/register"
                    className="mt-2 inline-block border-b-2 border-[#005c43] text-[12px] font-black uppercase tracking-[0.08em] text-[#005c43] transition hover:text-[#00a66a]"
                >
                    Request Access Protocol
                </Link>
            </div>

            <AuthStatusLine />
        </form>
    );
}
