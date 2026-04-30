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

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Failed to update action.");
                return;
            }

            const badgeCount = data.awardedBadges?.length ?? 0;

            setMessage(
                nextStatus === "COMPLETED"
                    ? badgeCount > 0
                        ? `Action completed. +${data.scoreIncrement ?? 0} score. ${badgeCount} badge unlocked.`
                        : `Action completed. +${data.scoreIncrement ?? 0} score.`
                    : "Action started."
            );

            router.refresh();
        });
    }

    const isPlanned = status === "PLANNED";
    const isInProgress = status === "IN_PROGRESS";
    const isCompleted = status === "COMPLETED" || status === "VERIFIED";

    return (
        <div className="space-y-3">
            {message ? (
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            ) : null}

            <div className="flex flex-wrap gap-2">
                {isPlanned ? (
                    <Button
                        type="button"
                        onClick={() => updateStatus("IN_PROGRESS")}
                        disabled={isPending}
                        variant="outline"
                        className="border-emerald-900/20 text-emerald-950 hover:bg-emerald-50"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <PlayCircle className="mr-2 size-4" />
                        )}
                        Start Action
                    </Button>
                ) : null}

                {isPlanned || isInProgress ? (
                    <Button
                        type="button"
                        onClick={() => updateStatus("COMPLETED")}
                        disabled={isPending}
                        className="bg-emerald-950 text-emerald-50 hover:bg-emerald-900"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="mr-2 size-4" />
                        )}
                        Mark as Completed
                    </Button>
                ) : null}

                {isCompleted ? (
                    <Button type="button" disabled variant="secondary">
                        <CheckCircle2 className="mr-2 size-4" />
                        Completed
                    </Button>
                ) : null}
            </div>
        </div>
    );
}