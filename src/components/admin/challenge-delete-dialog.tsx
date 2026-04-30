"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type ChallengeDeleteDialogProps = {
    challenge: {
        id: string;
        name: string;
        participantCount: number;
    };
};

export function ChallengeDeleteDialog({
    challenge,
}: ChallengeDeleteDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    const isUsed = challenge.participantCount > 0;

    function handleDelete() {
        setMessage(null);

        startTransition(async () => {
            const res = await fetch(`/api/admin/challenges/${challenge.id}`, {
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
                setMessage(data.message || "Challenge gagal dihapus.");
                return;
            }

            setMessage("Challenge berhasil dihapus.");
            router.refresh();

            window.setTimeout(() => {
                setOpen(false);
                setMessage(null);
            }, 500);
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                    <Trash2 className="mr-2 size-3.5" />
                    Delete
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Hapus Challenge?</DialogTitle>
                    <DialogDescription>
                        Challenge yang sudah diikuti participant tidak bisa dihapus untuk
                        menjaga histori progress user.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {message ? (
                        <Alert className="border-red-200 bg-red-50 text-red-800">
                            <AlertDescription className="text-sm leading-6">
                                {message}
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Challenge
                        </p>
                        <p className="mt-2 font-semibold text-slate-950">
                            {challenge.name}
                        </p>

                        <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                            <p className="text-xs text-muted-foreground">
                                Participants
                            </p>
                            <p className="mt-1 text-lg font-semibold text-slate-950">
                                {challenge.participantCount}
                            </p>
                        </div>
                    </div>

                    {isUsed ? (
                        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                            <AlertDescription className="text-sm leading-6">
                                Challenge ini sudah memiliki participant, jadi tidak bisa
                                dihapus. Gunakan edit jika ingin memperbarui nama, deskripsi,
                                target, timeline, atau tipe challenge.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className="border-red-200 bg-red-50 text-red-800">
                            <AlertDescription className="text-sm leading-6">
                                Challenge ini belum memiliki participant. Menghapus challenge
                                akan menghilangkannya dari daftar challenge user.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Batal
                        </Button>

                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending || isUsed}
                            className="bg-red-700 text-white hover:bg-red-800"
                        >
                            {isPending ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 size-4" />
                            )}
                            Hapus Challenge
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}