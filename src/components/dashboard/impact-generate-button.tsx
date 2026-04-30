"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ImpactGenerateButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    function handleGenerate() {
        setMessage(null);

        startTransition(async () => {
            const res = await fetch("/api/impact/generate", {
                method: "POST",
            });

            let data: {
                message?: string;
                userActions?: unknown[];
                skippedActions?: unknown[];
            } = {};

            try {
                data = await res.json();
            } catch {
                setMessage("Server mengembalikan respons yang tidak valid.");
                return;
            }

            if (!res.ok) {
                setMessage(
                    data.message ||
                    "Rekomendasi belum bisa dibuat. Pastikan data energi atau limbah sudah tersedia."
                );
                return;
            }

            const createdCount = data.userActions?.length ?? 0;
            const skippedCount = data.skippedActions?.length ?? 0;

            if (createdCount === 0 && skippedCount > 0) {
                setMessage(
                    data.message ||
                    "Semua rekomendasi sudah tersedia. Lanjutkan atau selesaikan aksi yang ada terlebih dahulu."
                );
            } else {
                setMessage(
                    `Berhasil membuat ${createdCount} aksi baru. ${skippedCount} aksi dilewati karena sudah pernah dibuat.`
                );
            }

            router.refresh();
        });
    }

    return (
        <div className="min-w-0 space-y-3">
            {message ? (
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
                    <AlertDescription className="text-sm leading-6">
                        {message}
                    </AlertDescription>
                </Alert>
            ) : null}

            <Button
                onClick={handleGenerate}
                disabled={isPending}
                className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900"
            >
                <Sparkles className="mr-2 size-4 shrink-0" />
                <span className="truncate">
                    {isPending
                        ? "Menganalisis data..."
                        : "Generate Rekomendasi & Estimasi Dampak"}
                </span>
            </Button>

            <p className="text-xs leading-5 text-muted-foreground">
                Sistem akan membaca data terbaru, menghindari duplikasi aksi, lalu
                membuat rekomendasi yang bisa kamu jalankan di halaman Aksi.
            </p>
        </div>
    );
}