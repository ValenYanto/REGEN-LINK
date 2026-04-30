"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Flame, Loader2, Plus } from "lucide-react";

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

export function ActionCreateForm() {
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
            category: formData.get("category"),
            difficultyLevel: formData.get("difficultyLevel"),
            baseImpactScore: formData.get("baseImpactScore"),
        };

        startTransition(async () => {
            const res = await fetch("/api/admin/actions", {
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
                setMessage(data.message || "Action gagal dibuat.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("Action berhasil dibuat.");
            form.reset();
            router.refresh();
        });
    }

    return (
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <Flame className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg">
                            Tambah Action Master
                        </CardTitle>
                        <CardDescription className="text-xs leading-5 sm:text-sm">
                            Buat template aksi baru yang dapat dipakai recommendation engine.
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
                        <Label className="dark:text-slate-200" htmlFor="name">Nama Aksi</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Contoh: Kurangi pemakaian AC 1 jam per hari"
                            className="w-full min-w-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500"
                            required
                        />
                        {errors.name ? (
                            <p className="text-xs text-red-600 dark:text-red-300">{errors.name[0]}</p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label className="dark:text-slate-200" htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Jelaskan aksi, konteks, dan dampak yang diharapkan..."
                            rows={4}
                            className="min-h-28 resize-none dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500"
                            required
                        />
                        {errors.description ? (
                            <p className="text-xs text-red-600 dark:text-red-300">
                                {errors.description[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                        <div className="grid min-w-0 gap-2">
                            <Label className="dark:text-slate-200">Kategori</Label>
                            <Select name="category" required>
                                <SelectTrigger className="w-full dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ENERGY">Energi</SelectItem>
                                    <SelectItem value="WASTE">Limbah</SelectItem>
                                    <SelectItem value="CIRCULAR">Sirkular</SelectItem>
                                    <SelectItem value="COMMUNITY">Komunitas</SelectItem>
                                    <SelectItem value="GENERAL">Umum</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.category[0]}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label className="dark:text-slate-200">Kesulitan</Label>
                            <Select name="difficultyLevel" required>
                                <SelectTrigger className="w-full dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                    <SelectValue placeholder="Pilih kesulitan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EASY">Mudah</SelectItem>
                                    <SelectItem value="MEDIUM">Sedang</SelectItem>
                                    <SelectItem value="HARD">Sulit</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.difficultyLevel ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.difficultyLevel[0]}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label className="dark:text-slate-200" htmlFor="baseImpactScore">Base Impact Score</Label>
                        <Input
                            id="baseImpactScore"
                            name="baseImpactScore"
                            type="number"
                            min="1"
                            max="500"
                            placeholder="Contoh: 25"
                            className="w-full min-w-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500"
                            required
                        />
                        {errors.baseImpactScore ? (
                            <p className="text-xs text-red-600 dark:text-red-300">
                                {errors.baseImpactScore[0]}
                            </p>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 size-4" />
                        )}
                        Tambah Action
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}