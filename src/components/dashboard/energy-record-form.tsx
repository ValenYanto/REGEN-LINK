"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Zap } from "lucide-react";

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

export function EnergyRecordForm() {
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
            monthlyKwh: formData.get("monthlyKwh"),
            electricityCost: formData.get("electricityCost"),
            housingType: formData.get("housingType"),
            occupants: formData.get("occupants"),
            dominantDevices: formData.get("dominantDevices"),
            notes: formData.get("notes"),
            recordDate: formData.get("recordDate"),
        };

        startTransition(async () => {
            const res = await fetch("/api/energy-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Failed to create energy record.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("Energy telemetry berhasil disimpan.");
            form.reset();
            router.refresh();
        });
    }


    return (
        <Card className="h-fit overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <Zap className="size-5" />
                    </div>
                    <div>
                        <CardTitle>Energy Telemetry Input</CardTitle>
                        <CardDescription>
                            Catat konsumsi listrik bulanan untuk membaca pola efisiensi energi.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {message ? (
                    <Alert className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-950">
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                ) : null}

                <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="monthlyKwh">Monthly kWh</Label>
                            <Input
                                id="monthlyKwh"
                                name="monthlyKwh"
                                type="number"
                                step="0.01"
                                placeholder="Contoh: 220"
                                required
                            />
                            {errors.monthlyKwh ? (
                                <p className="text-xs text-red-600">{errors.monthlyKwh[0]}</p>
                            ) : null}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="electricityCost">Electricity Cost</Label>
                            <Input
                                id="electricityCost"
                                name="electricityCost"
                                type="number"
                                step="100"
                                placeholder="Contoh: 315000"
                                required
                            />
                            {errors.electricityCost ? (
                                <p className="text-xs text-red-600">
                                    {errors.electricityCost[0]}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Housing Type</Label>
                            <Select name="housingType" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe tempat tinggal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="KOS">Kos</SelectItem>
                                    <SelectItem value="HOUSE">Rumah</SelectItem>
                                    <SelectItem value="APARTMENT">Apartemen</SelectItem>
                                    <SelectItem value="DORMITORY">Asrama / Dormitory</SelectItem>
                                    <SelectItem value="UMKM">UMKM</SelectItem>
                                    <SelectItem value="OTHER">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.housingType ? (
                                <p className="text-xs text-red-600">{errors.housingType[0]}</p>
                            ) : null}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="occupants">Occupants</Label>
                            <Input
                                id="occupants"
                                name="occupants"
                                type="number"
                                placeholder="Contoh: 3"
                                required
                            />
                            {errors.occupants ? (
                                <p className="text-xs text-red-600">{errors.occupants[0]}</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="dominantDevices">Dominant Devices</Label>
                        <Input
                            id="dominantDevices"
                            name="dominantDevices"
                            placeholder="Contoh: AC, laptop, rice cooker, refrigerator"
                            required
                        />
                        {errors.dominantDevices ? (
                            <p className="text-xs text-red-600">
                                {errors.dominantDevices[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="recordDate">Record Date</Label>
                        <Input id="recordDate" name="recordDate" type="date" />
                        <p className="text-xs text-muted-foreground">
                            Kosongkan jika ingin memakai tanggal hari ini.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Tambahkan catatan pola konsumsi listrik..."
                            rows={3}
                            className="min-h-20 resize-none"
                        />
                        {errors.notes ? (
                            <p className="text-xs text-red-600">{errors.notes[0]}</p>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-emerald-950 text-emerald-50 hover:bg-emerald-900"
                    >
                        {isPending ? "Saving telemetry..." : "Save Energy Record"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}