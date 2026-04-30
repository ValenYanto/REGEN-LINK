"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Recycle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FieldErrors = Record<string, string[] | undefined>;

export function WasteRecordForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [message, setMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<FieldErrors>({});

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;

        setMessage(null);
        setErrors({});

        const formData = new FormData(form);

        const payload = {
            wasteType: formData.get("wasteType"),
            weightKg: formData.get("weightKg"),
            wasteSource: formData.get("wasteSource"),
            managementStatus: formData.get("managementStatus"),
            notes: formData.get("notes"),
            recordDate: formData.get("recordDate"),
        };

        startTransition(async () => {
            const res = await fetch("/api/waste-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Failed to create waste record.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("Circular waste record berhasil disimpan.");
            form.reset();
            router.refresh();
        });
    }

    return (
        <Card className="h-fit w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <Recycle className="size-5" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-base leading-tight text-emerald-950 dark:text-emerald-50 sm:text-lg">
                            Circular Waste Input
                        </CardTitle>
                        <CardDescription className="mt-1 max-w-full text-xs leading-5 dark:text-slate-400 sm:text-sm">
                            Catat jenis, berat, sumber, dan status pengelolaan limbah.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="min-w-0 px-4 pt-4 pb-4 sm:px-6">
                {message ? (
                    <Alert className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                ) : null}

                <form onSubmit={onSubmit} className="grid min-w-0 gap-4">
                    <div className="grid min-w-0 gap-4 md:grid-cols-2">
                        <div className="grid min-w-0 gap-2">
                            <Label className="dark:text-slate-200">Waste Type</Label>
                            <Select name="wasteType" required>
                                <SelectTrigger className="w-full min-w-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                    <SelectValue placeholder="Pilih jenis limbah" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FOOD">Food Waste</SelectItem>
                                    <SelectItem value="PLASTIC">Plastic</SelectItem>
                                    <SelectItem value="PAPER">Paper</SelectItem>
                                    <SelectItem value="ORGANIC">Organic</SelectItem>
                                    <SelectItem value="METAL">Metal</SelectItem>
                                    <SelectItem value="GLASS">Glass</SelectItem>
                                    <SelectItem value="MIXED">Mixed</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.wasteType ? (
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    {errors.wasteType[0]}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="weightKg" className="dark:text-slate-200">
                                Weight Kg
                            </Label>
                            <Input
                                id="weightKg"
                                name="weightKg"
                                type="number"
                                step="0.01"
                                placeholder="Contoh: 7.5"
                                required
                                className="w-full min-w-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500"
                            />
                            {errors.weightKg ? (
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    {errors.weightKg[0]}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="wasteSource" className="dark:text-slate-200">
                            Waste Source
                        </Label>
                        <Input
                            id="wasteSource"
                            name="wasteSource"
                            placeholder="Contoh: dapur kos, kantin, UMKM makanan"
                            required
                            className="w-full min-w-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500"
                        />
                        {errors.wasteSource ? (
                            <p className="text-xs text-red-600 dark:text-red-400">
                                {errors.wasteSource[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label className="dark:text-slate-200">Management Status</Label>
                        <Select name="managementStatus" required>
                            <SelectTrigger className="w-full min-w-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                <SelectValue placeholder="Pilih status pengelolaan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NOT_SORTED">Belum Dipilah</SelectItem>
                                <SelectItem value="SORTED">Sudah Dipilah</SelectItem>
                                <SelectItem value="RECYCLED">Didaur Ulang</SelectItem>
                                <SelectItem value="COMPOSTED">Dikomposkan</SelectItem>
                                <SelectItem value="DONATED">Didonasikan</SelectItem>
                                <SelectItem value="SENT_TO_WASTE_BANK">
                                    Dikirim ke Bank Sampah
                                </SelectItem>
                                <SelectItem value="OTHER">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.managementStatus ? (
                            <p className="text-xs text-red-600 dark:text-red-400">
                                {errors.managementStatus[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="recordDate" className="dark:text-slate-200">
                            Record Date
                        </Label>
                        <Input
                            id="recordDate"
                            name="recordDate"
                            type="date"
                            className="w-full min-w-0 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50"
                        />
                        <p className="text-xs text-muted-foreground dark:text-slate-400">
                            Kosongkan jika ingin memakai tanggal hari ini.
                        </p>
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="notes" className="dark:text-slate-200">
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Tambahkan catatan pengelolaan limbah..."
                            rows={3}
                            className="min-h-20 w-full min-w-0 resize-none dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500"
                        />
                        {errors.notes ? (
                            <p className="text-xs text-red-600 dark:text-red-400">
                                {errors.notes[0]}
                            </p>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200 sm:w-fit"
                    >
                        {isPending ? "Saving circular record..." : "Save Waste Record"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}