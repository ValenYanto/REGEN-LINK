"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CommunityMemberRemoveButtonProps = {
    memberId: string;
    memberName: string;
};

export function CommunityMemberRemoveButton({
    memberId,
    memberName,
}: CommunityMemberRemoveButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    function handleRemove() {
        const confirmed = window.confirm(
            `Hapus ${memberName} dari community ini?`
        );

        if (!confirmed) return;

        setMessage(null);

        startTransition(async () => {
            const res = await fetch(`/api/admin/community-members/${memberId}`, {
                method: "DELETE",
            });

            let data: {
                message?: string;
            } = {};

            try {
                data = await res.json();
            } catch {
                setMessage("Server mengembalikan respons tidak valid.");
                return;
            }

            if (!res.ok) {
                setMessage(data.message || "Member gagal dihapus.");
                return;
            }

            router.refresh();
        });
    }

    return (
        <div className="space-y-2">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={handleRemove}
                className="size-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                title="Remove member"
            >
                {isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                ) : (
                    <X className="size-3.5" />
                )}
            </Button>

            {message ? (
                <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-300/20 dark:bg-red-400/10 dark:text-red-200">
                    <AlertDescription className="text-xs leading-5">
                        {message}
                    </AlertDescription>
                </Alert>
            ) : null}
        </div>
    );
}