"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Plus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type FieldErrors = Record<string, string[] | undefined>;

type CommunityCreateFormProps = {
    cities: {
        id: string;
        name: string;
        province: string;
    }[];
};

export function CommunityCreateForm({ cities }: CommunityCreateFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<FieldErrors>({});

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        setMessage(null);
        setErrors({});

        const payload = {
            name: formData.get("name"),
            type: formData.get("type"),
            cityId: formData.get("cityId"),
        };

        startTransition(async () => {
            const res = await fetch("/api/admin/communities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            let data: {
                message?: string;
                errors?: FieldErrors;
            } = {};

            try {
                data = await res.json();
            } catch {
                setMessage("Server mengembalikan respons tidak valid.");
                return;
            }

            if (!res.ok) {
                setMessage(data.message || "Community gagal dibuat.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("Community berhasil dibuat.");
            form.reset();
            router.refresh();
        });
    }

    return (
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <UsersRound className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg">
                            Tambah Community
                        </CardTitle>
                        <CardDescription className="text-xs leading-5 sm:text-sm">
                            Buat komunitas baru untuk mengelompokkan user berdasarkan city,
                            kampus, UMKM, atau komunitas lingkungan.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 pt-5 pb-4 sm:px-6">
                <form onSubmit={onSubmit} className="grid min-w-0 gap-4">
                    {message ? (
                        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                            <AlertDescription className="text-sm leading-6">
                                {message}
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    <div className="grid min-w-0 gap-2">
                        <Label className="dark:text-slate-200" htmlFor="name">Nama Community</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Contoh: Green Campus IPB"
                            className="w-full min-w-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500"
                            required
                        />
                        {errors.name ? (
                            <p className="text-xs text-red-600 dark:text-red-300">{errors.name[0]}</p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label className="dark:text-slate-200">Tipe Community</Label>
                        <Select name="type" required>
                            <SelectTrigger className="w-full dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                <SelectValue placeholder="Pilih tipe community" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CAMPUS">Campus</SelectItem>
                                <SelectItem value="CITY">City</SelectItem>
                                <SelectItem value="UMKM">UMKM</SelectItem>
                                <SelectItem value="YOUTH_ORGANIZATION">
                                    Youth Organization
                                </SelectItem>
                                <SelectItem value="ENVIRONMENTAL_COMMUNITY">
                                    Environmental Community
                                </SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type ? (
                            <p className="text-xs text-red-600 dark:text-red-300">{errors.type[0]}</p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label className="dark:text-slate-200">City Node</Label>
                        <Select name="cityId" required>
                            <SelectTrigger className="w-full dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                <SelectValue placeholder="Pilih city node" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((city) => (
                                    <SelectItem key={city.id} value={city.id}>
                                        {city.name}, {city.province}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.cityId ? (
                            <p className="text-xs text-red-600 dark:text-red-300">{errors.cityId[0]}</p>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending || cities.length === 0}
                        className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 size-4" />
                        )}
                        Tambah Community
                    </Button>

                    {cities.length === 0 ? (
                        <p className="text-xs leading-5 text-muted-foreground dark:text-slate-400">
                            Tambahkan city node terlebih dahulu sebelum membuat community.
                        </p>
                    ) : null}
                </form>
            </CardContent>
        </Card>
    );
}