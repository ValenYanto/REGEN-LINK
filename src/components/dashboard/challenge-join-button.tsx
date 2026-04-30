"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ChallengeJoinButtonProps = {
    challengeId: string;
    isJoined: boolean;
};

export function ChallengeJoinButton({
    challengeId,
    isJoined,
}: ChallengeJoinButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    function handleJoin() {
        setMessage(null);

        startTransition(async () => {
            const res = await fetch(`/api/challenges/${challengeId}/join`, {
                method: "POST",
            });

            let data: {
                message?: string;
            } = {};

            try {
                data = await res.json();
            } catch {
                setMessage("Server mengembalikan respons yang tidak valid.");
                return;
            }

            if (!res.ok) {
                setMessage(data.message || "Belum bisa bergabung ke challenge.");
                return;
            }

            setMessage("Berhasil bergabung ke challenge. Selesaikan aksi untuk menaikkan progress.");
            router.refresh();
        });
    }

    if (isJoined) {
        return (
            <Button type="button" disabled variant="secondary" className="w-full">
                <Trophy className="mr-2 size-4" />
                Sudah Bergabung
            </Button>
        );
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
                type="button"
                onClick={handleJoin}
                disabled={isPending}
                className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900"
            >
                {isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                    <Trophy className="mr-2 size-4" />
                )}
                Gabung Challenge
            </Button>
        </div>
    );
}