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
                setMessage("Server mengembalikan response yang tidak valid.");
                return;
            }

            if (!res.ok) {
                setMessage(data.message || "Failed to generate impact.");
                return;
            }

            const createdCount = data.userActions?.length ?? 0;
            const skippedCount = data.skippedActions?.length ?? 0;

            if (createdCount === 0 && skippedCount > 0) {
                setMessage(
                    data.message ||
                    "Semua rekomendasi sudah ada. Selesaikan action yang tersedia dulu."
                );
            } else {
                setMessage(
                    `Berhasil membuat ${createdCount} action baru. ${skippedCount} action dilewati karena sudah ada.`
                );
            }

            router.refresh();
        });
    }

    return (
        <div className="space-y-3">
            {message ? (
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            ) : null}

            <Button
                onClick={handleGenerate}
                disabled={isPending}
                className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900"
            >
                <Sparkles className="mr-2 size-4" />
                {isPending
                    ? "Generating climate intelligence..."
                    : "Generate Impact & Recommendation"}
            </Button>
        </div>
    );
}