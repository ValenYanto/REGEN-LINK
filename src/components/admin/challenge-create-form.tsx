"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Plus, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function ChallengeCreateForm() {
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
            description: formData.get("description"),
            type: formData.get("type"),
            targetValue: formData.get("targetValue"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
        };

        startTransition(async () => {
            const res = await fetch("/api/admin/challenges", {
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
                setMessage(data.message || "Challenge gagal dibuat.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("Challenge berhasil dibuat.");
            form.reset();
            router.refresh();
        });
    }

    return (
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <Trophy className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg">
                            Tambah Challenge
                        </CardTitle>
                        <CardDescription className="text-xs leading-5 sm:text-sm">
                            Buat challenge baru untuk mendorong aksi energi, limbah,
                            komunitas, dan kontribusi lintas kota.
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
                        <Label htmlFor="name">Nama Challenge</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Contoh: 7 Hari Hemat Energi"
                            className="w-full min-w-0"
                            required
                        />
                        {errors.name ? (
                            <p className="text-xs text-red-600">{errors.name[0]}</p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Jelaskan tujuan challenge dan aksi yang dihitung..."
                            rows={4}
                            className="min-h-28 resize-none"
                            required
                        />
                        {errors.description ? (
                            <p className="text-xs text-red-600">
                                {errors.description[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                        <div className="grid min-w-0 gap-2">
                            <Label>Tipe Challenge</Label>
                            <Select name="type" required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ENERGY">Energi</SelectItem>
                                    <SelectItem value="WASTE">Limbah</SelectItem>
                                    <SelectItem value="CIRCULAR">Sirkular</SelectItem>
                                    <SelectItem value="CROSS_CITY">Lintas Kota</SelectItem>
                                    <SelectItem value="COMMUNITY">Komunitas</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type ? (
                                <p className="text-xs text-red-600">{errors.type[0]}</p>
                            ) : null}
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="targetValue">Target Value</Label>
                            <Input
                                id="targetValue"
                                name="targetValue"
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="Contoh: 50"
                                className="w-full min-w-0"
                                required
                            />
                            {errors.targetValue ? (
                                <p className="text-xs text-red-600">
                                    {errors.targetValue[0]}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="startDate">Tanggal Mulai</Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                className="w-full min-w-0"
                                required
                            />
                            {errors.startDate ? (
                                <p className="text-xs text-red-600">
                                    {errors.startDate[0]}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="endDate">Tanggal Selesai</Label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="date"
                                className="w-full min-w-0"
                                required
                            />
                            {errors.endDate ? (
                                <p className="text-xs text-red-600">
                                    {errors.endDate[0]}
                                </p>
                            ) : null}
                        </div>
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
                        Tambah Challenge
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}