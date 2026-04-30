"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, UserPlus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type FieldErrors = Record<string, string[] | undefined>;

type CommunityMemberFormProps = {
    communities: {
        id: string;
        name: string;
        cityName: string;
    }[];
    users: {
        id: string;
        name: string;
        email: string;
        cityName: string | null;
    }[];
};

export function CommunityMemberForm({
    communities,
    users,
}: CommunityMemberFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<FieldErrors>({});

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        setMessage(null);
        setErrors({});

        const payload = {
            communityId: formData.get("communityId"),
            userId: formData.get("userId"),
            memberRole: formData.get("memberRole") || "Member",
        };

        startTransition(async () => {
            const res = await fetch("/api/admin/community-members", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            let data: {
                message?: string;
                errors?: FieldErrors;
            } = {};

            try {
                data = await res.json();
            } catch {
                setMessage("Server mengembalikan respons tidak valid.");
                return;
            }

            if (!res.ok) {
                setMessage(data.message || "Member gagal ditambahkan.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("Member berhasil ditambahkan.");
            form.reset();
            router.refresh();
        });
    }

    const isDisabled = communities.length === 0 || users.length === 0;

    return (
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <UsersRound className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg">
                            Assign Community Member
                        </CardTitle>
                        <CardDescription className="text-xs leading-5 sm:text-sm">
                            Hubungkan user ke community untuk membangun kolaborasi
                            lintas kota, kampus, UMKM, dan komunitas lingkungan.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 pt-5 pb-4 sm:px-6">
                <form onSubmit={onSubmit} className="grid min-w-0 gap-4">
                    {message ? (
                        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
                            <AlertDescription className="text-sm leading-6">
                                {message}
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    <div className="grid min-w-0 gap-2">
                        <Label>Community</Label>
                        <Select name="communityId" required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih community" />
                            </SelectTrigger>
                            <SelectContent>
                                {communities.map((community) => (
                                    <SelectItem
                                        key={community.id}
                                        value={community.id}
                                    >
                                        {community.name} — {community.cityName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.communityId ? (
                            <p className="text-xs text-red-600">
                                {errors.communityId[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label>User</Label>
                        <Select name="userId" required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih user" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name} — {user.cityName ?? user.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.userId ? (
                            <p className="text-xs text-red-600">
                                {errors.userId[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="memberRole">Member Role</Label>
                        <Input
                            id="memberRole"
                            name="memberRole"
                            placeholder="Contoh: Member, Coordinator, Mentor"
                            defaultValue="Member"
                            className="w-full min-w-0"
                            required
                        />
                        {errors.memberRole ? (
                            <p className="text-xs text-red-600">
                                {errors.memberRole[0]}
                            </p>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending || isDisabled}
                        className="w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-900"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <UserPlus className="mr-2 size-4" />
                        )}
                        Assign Member
                    </Button>

                    {isDisabled ? (
                        <p className="text-xs leading-5 text-muted-foreground">
                            Pastikan sudah ada minimal satu community dan satu user.
                        </p>
                    ) : null}
                </form>
            </CardContent>
        </Card>
    );
}