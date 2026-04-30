"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ActionStatusControlsProps = {
    userActionId: string;
    status: string;
};

export function ActionStatusControls({
    userActionId,
    status,
}: ActionStatusControlsProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    function updateStatus(nextStatus: "IN_PROGRESS" | "COMPLETED") {
        setMessage(null);

        startTransition(async () => {
            const res = await fetch(`/api/user-actions/${userActionId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: nextStatus,
                }),
            });

            let data: {
                message?: string;
                scoreIncrement?: number;
                awardedBadges?: unknown[];
            } = {};

            try {
                data = await res.json();
            } catch {
                setMessage("Server mengembalikan respons yang tidak valid.");
                return;
            }

            if (!res.ok) {
                setMessage(data.message || "Status aksi belum bisa diperbarui.");
                return;
            }

            const badgeCount = data.awardedBadges?.length ?? 0;

            setMessage(
                nextStatus === "COMPLETED"
                    ? badgeCount > 0
                        ? `Aksi selesai. +${data.scoreIncrement ?? 0} score dan ${badgeCount} badge terbuka.`
                        : `Aksi selesai. +${data.scoreIncrement ?? 0} score.`
                    : "Aksi dimulai. Lanjutkan sampai selesai untuk menaikkan score."
            );

            router.refresh();
        });
    }

    const isPlanned = status === "PLANNED";
    const isInProgress = status === "IN_PROGRESS";
    const isCompleted = status === "COMPLETED" || status === "VERIFIED";

    return (
        <div className="min-w-0 space-y-3">
            {message ? (
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                    <AlertDescription className="text-sm leading-6">
                        {message}
                    </AlertDescription>
                </Alert>
            ) : null}

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
                {isPlanned ? (
                    <Button
                        type="button"
                        onClick={() => updateStatus("IN_PROGRESS")}
                        disabled={isPending}
                        variant="outline"
                        className="w-full border-emerald-900/20 text-emerald-950 dark:text-emerald-50 hover:bg-emerald-50 sm:w-fit"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <PlayCircle className="mr-2 size-4" />
                        )}
                        Mulai Aksi
                    </Button>
                ) : null}

                {isPlanned || isInProgress ? (
                    <Button
                        type="button"
                        onClick={() => updateStatus("COMPLETED")}
                        disabled={isPending}
                        className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900 sm:w-fit"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="mr-2 size-4" />
                        )}
                        Tandai Selesai
                    </Button>
                ) : null}

                {isCompleted ? (
                    <Button type="button" disabled variant="secondary" className="w-full sm:w-fit">
                        <CheckCircle2 className="mr-2 size-4" />
                        Aksi Selesai
                    </Button>
                ) : null}
            </div>
        </div>
    );
}