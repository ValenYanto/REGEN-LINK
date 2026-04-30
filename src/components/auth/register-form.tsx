"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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
            const response = await fetch("/api/register", {
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

            const data = await response.json();

            if (!response.ok) {
                setError(data.message ?? "Registrasi gagal.");
                setIsLoading(false);
                return;
            }

            router.push("/login?registered=1");
            router.refresh();
        } catch {
            setError("Terjadi kesalahan koneksi.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <Alert className="border-red-200 bg-red-50 text-red-700">
                    <AlertDescription className="text-sm font-semibold">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a]">
                    Operator Name
                </Label>

                <div className="relative">
                    <UserRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b8a85]"
                    />
                    <Input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="h-[52px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.03em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15"
                        placeholder="VALEN NODE"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a]">
                    Researcher Email
                </Label>

                <div className="relative">
                    <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7b8a85]"
                    />
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="h-[52px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.03em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15"
                        placeholder="operator@regenlink.id"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a]">
                    City Node
                </Label>

                <div className="relative">
                    <Building2
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#7b8a85]"
                    />

                    <Select
                        value={cityId}
                        onValueChange={setCityId}
                        disabled={isCitiesLoading}
                    >
                        <SelectTrigger className="h-[52px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.03em] text-[#111827] shadow-none focus:ring-[#005c43]/15">
                            <SelectValue placeholder="Select city node" />
                        </SelectTrigger>
                        <SelectContent>
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
                <Label className="text-[12px] font-black uppercase tracking-[0.08em] text-[#3f4f4a]">
                    Access Protocol
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
                        className="h-[52px] rounded-none border-[#98a3ad] bg-[#f8fafb] pl-12 text-[15px] font-bold tracking-[0.08em] text-[#111827] shadow-none focus-visible:border-[#005c43] focus-visible:ring-[#005c43]/15"
                        placeholder="MINIMUM 8 CHARACTERS"
                        required
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading || isCitiesLoading}
                className="h-[56px] w-full rounded-none bg-[#00734f] text-[13px] font-black uppercase tracking-[0.18em] text-white shadow-none transition hover:bg-[#005c43]"
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
                <Separator className="flex-1 bg-[#d9e1e5]" />
                <Fingerprint size={16} className="text-[#7b8a85]" />
                <Separator className="flex-1 bg-[#d9e1e5]" />
            </div>

            <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7b8a85]">
                    Already have authorization?
                </p>
                <Link
                    href="/login"
                    className="mt-2 inline-block border-b-2 border-[#005c43] text-[12px] font-black uppercase tracking-[0.08em] text-[#005c43] transition hover:text-[#00a66a]"
                >
                    Establish Connection
                </Link>
            </div>

            <AuthStatusLine />
        </form>
    );
}