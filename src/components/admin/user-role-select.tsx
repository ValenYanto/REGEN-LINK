"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

type UserRoleSelectProps = {
    userId: string;
    currentRole: string;
    disabled?: boolean;
};

const roleLabels: Record<string, string> = {
    USER: "User",
    COMMUNITY_LEADER: "Community Leader",
    ADMIN: "Admin",
};

export function UserRoleSelect({
    userId,
    currentRole,
    disabled = false,
}: UserRoleSelectProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    function updateRole(role: string) {
        setMessage(null);

        startTransition(async () => {
            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role,
                }),
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
                setMessage(data.message || "Role gagal diperbarui.");
                return;
            }

            setMessage("Role berhasil diperbarui.");
            router.refresh();
        });
    }

    return (
        <div className="min-w-0 space-y-2">
            <div className="flex min-w-0 items-center gap-2">
                <Select
                    defaultValue={currentRole}
                    onValueChange={updateRole}
                    disabled={disabled || isPending}
                >
                    <SelectTrigger className="h-9 w-full min-w-[170px] rounded-xl border-emerald-900/10 bg-white">
                        <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">{roleLabels.USER}</SelectItem>
                        <SelectItem value="COMMUNITY_LEADER">
                            {roleLabels.COMMUNITY_LEADER}
                        </SelectItem>
                        <SelectItem value="ADMIN">{roleLabels.ADMIN}</SelectItem>
                    </SelectContent>
                </Select>

                {isPending ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-emerald-700" />
                ) : null}
            </div>

            {message ? (
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                    <AlertDescription className="text-xs leading-5">
                        {message}
                    </AlertDescription>
                </Alert>
            ) : null}
        </div>
    );
}