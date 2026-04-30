"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Building2, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type FieldErrors = Record<string, string[] | undefined>;

export function CityCreateForm() {
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
            province: formData.get("province"),
            country: formData.get("country") || "Indonesia",
        };

        startTransition(async () => {
            const res = await fetch("/api/admin/cities", {
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
                setMessage(data.message || "City gagal dibuat.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("City berhasil dibuat.");
            form.reset();
            router.refresh();
        });
    }

    return (
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <Building2 className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg">
                            Tambah City Node
                        </CardTitle>
                        <CardDescription className="text-xs leading-5 sm:text-sm">
                            Buat city node baru untuk menghubungkan user, komunitas, dan
                            insight lintas kota.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 pt-5 pb-4 sm:px-6">
                <form onSubmit={onSubmit} className="grid min-w-0 gap-4">
                    {message ? (
                        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
                            <AlertDescription className="text-sm leading-6">
                                {message}
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="name">Nama Kota</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Contoh: Bogor"
                            className="w-full min-w-0"
                            required
                        />
                        {errors.name ? (
                            <p className="text-xs text-red-600">{errors.name[0]}</p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="province">Provinsi</Label>
                        <Input
                            id="province"
                            name="province"
                            placeholder="Contoh: Jawa Barat"
                            className="w-full min-w-0"
                            required
                        />
                        {errors.province ? (
                            <p className="text-xs text-red-600">{errors.province[0]}</p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="country">Negara</Label>
                        <Input
                            id="country"
                            name="country"
                            placeholder="Indonesia"
                            defaultValue="Indonesia"
                            className="w-full min-w-0"
                            required
                        />
                        {errors.country ? (
                            <p className="text-xs text-red-600">{errors.country[0]}</p>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 size-4" />
                        )}
                        Tambah City Node
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}