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
        <Card className="h-fit w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <Recycle className="size-5" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-base leading-tight sm:text-lg">
                            Circular Waste Input
                        </CardTitle>
                        <CardDescription className="mt-1 max-w-full text-xs leading-5 sm:text-sm">
                            Catat jenis, berat, sumber, dan status pengelolaan limbah.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="min-w-0 px-4 pt-4 pb-4 sm:px-6">
                {message ? (
                    <Alert className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-950">
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                ) : null}

                <form onSubmit={onSubmit} className="grid min-w-0 gap-4">
                    <div className="grid min-w-0 gap-4 md:grid-cols-2">
                        <div className="grid min-w-0 gap-2">
                            <Label>Waste Type</Label>
                            <Select name="wasteType" required>
                                <SelectTrigger className="w-full min-w-0">
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
                                <p className="text-xs text-red-600">{errors.wasteType[0]}</p>
                            ) : null}
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="weightKg">Weight Kg</Label>
                            <Input
                                id="weightKg"
                                name="weightKg"
                                type="number"
                                step="0.01"
                                placeholder="Contoh: 7.5"
                                required
                                className="w-full min-w-0"
                            />
                            {errors.weightKg ? (
                                <p className="text-xs text-red-600">{errors.weightKg[0]}</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="wasteSource">Waste Source</Label>
                        <Input
                            id="wasteSource"
                            name="wasteSource"
                            placeholder="Contoh: dapur kos, kantin, UMKM makanan"
                            required
                            className="w-full min-w-0"
                        />
                        {errors.wasteSource ? (
                            <p className="text-xs text-red-600">{errors.wasteSource[0]}</p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label>Management Status</Label>
                        <Select name="managementStatus" required>
                            <SelectTrigger className="w-full min-w-0">
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
                            <p className="text-xs text-red-600">
                                {errors.managementStatus[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="recordDate">Record Date</Label>
                        <Input
                            id="recordDate"
                            name="recordDate"
                            type="date"
                            className="w-full min-w-0"
                        />
                        <p className="text-xs text-muted-foreground">
                            Kosongkan jika ingin memakai tanggal hari ini.
                        </p>
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Tambahkan catatan pengelolaan limbah..."
                            rows={3}
                            className="min-h-20 w-full min-w-0 resize-none"
                        />
                        {errors.notes ? (
                            <p className="text-xs text-red-600">{errors.notes[0]}</p>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900 sm:w-fit"
                    >
                        {isPending ? "Saving circular record..." : "Save Waste Record"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}