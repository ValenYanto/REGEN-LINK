"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Building2,
    Fingerprint,
    KeyRound,
    Loader2,
    Mail,
    UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AuthStatusLine } from "@/components/auth/auth-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type City = {
    id: string;
    name: string;
    province: string;
    country: string;
};

export function RegisterForm() {
    const router = useRouter();

    const [cities, setCities] = useState<City[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cityId, setCityId] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCitiesLoading, setIsCitiesLoading] = useState(true);

    useEffect(() => {
        async function loadCities() {
            try {
                const response = await fetch("/api/cities");
                const data = await response.json();

                setCities(data.cities ?? []);

                if (data.cities?.[0]?.id) {
                    setCityId(data.cities[0].id);
                }
            } catch {
                setError("Gagal mengambil data kota.");
            } finally {
                setIsCitiesLoading(false);
            }
        }

        loadCities();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    cityId,
                }),
            });

            let data: {
                message?: string;
            } = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                setError(
                    data.message ?? "Registrasi gagal. Periksa data dan coba lagi."
                );
                setIsLoading(false);
                return;
            }

            router.push("/login?registered=1");
            router.refresh();
        } catch (error) {
            console.error("[REGISTER_CLIENT_ERROR]", error);
            setError(
                "Terjadi kesalahan koneksi. Pastikan server berjalan dan coba lagi."
            );
        } finally {
            setIsLoading(false);
        }
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

            {error && (
                <Alert className="border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
                    <AlertDescription className="text-sm font-semibold">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a] dark:text-slate-300">
                    Operator Name
                </Label>

                <div className="relative">
                    <UserRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b8a85] dark:text-slate-500"
                    />
                    <Input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="h-[52px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.03em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:border-emerald-300"
                        placeholder="NAME"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a] dark:text-slate-300">
                    Researcher Email
                </Label>

                <div className="relative">
                    <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b8a85] dark:text-slate-500"
                    />
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="h-[52px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.03em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:border-emerald-300"
                        placeholder="EMAIL"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a] dark:text-slate-300">
                    City Node
                </Label>

                <div className="relative">
                    <Building2
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#7b8a85] dark:text-slate-500"
                    />

                    <Select
                        value={cityId}
                        onValueChange={setCityId}
                        disabled={isCitiesLoading}
                    >
                        <SelectTrigger className="h-[52px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.03em] text-[#111827] shadow-none focus:ring-[#005c43]/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:focus:border-emerald-300">
                            <SelectValue placeholder="Select city node" />
                        </SelectTrigger>
                        <SelectContent className="border-[#98a3ad] bg-white text-[#111827] dark:border-white/10 dark:bg-slate-950 dark:text-slate-50">
                            {cities.map((city) => (
                                <SelectItem key={city.id} value={city.id}>
                                    {city.name}, {city.province}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a] dark:text-slate-300">
                    Access Protocol
                </Label>

                <div className="relative">
                    <KeyRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b8a85] dark:text-slate-500"
                    />
                    <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="h-[52px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.08em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:border-emerald-300"
                        placeholder="MINIMUM 8 CHARACTERS"
                        required
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading || isCitiesLoading}
                className="h-[56px] w-full rounded-none bg-[#00734f] text-[13px] font-black uppercase tracking-[0.18em] text-white shadow-none transition hover:bg-[#005c43] dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Registering Node...
                    </>
                ) : (
                    "Request Access Protocol"
                )}
            </Button>

            <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1 bg-[#d9e1e5] dark:bg-white/10" />
                <Fingerprint size={16} className="text-[#7b8a85] dark:text-slate-500" />
                <Separator className="flex-1 bg-[#d9e1e5] dark:bg-white/10" />
            </div>

            <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7b8a85] dark:text-slate-400">
                    Already have authorization?
                </p>
                <Link
                    href="/login"
                    className="mt-2 inline-block border-b-2 border-[#005c43] text-[12px] font-black uppercase tracking-[0.08em] text-[#005c43] transition hover:text-[#00a66a] dark:border-emerald-300 dark:text-emerald-300 dark:hover:text-emerald-200"
                >
                    Establish Connection
                </Link>
            </div>

            <AuthStatusLine />
        </form>
    );
}
