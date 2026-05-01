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

type ActionDeleteDialogProps = {
    action: {
        id: string;
        name: string;
        userActionCount: number;
        recommendationCount: number;
    };
};

export function ActionDeleteDialog({ action }: ActionDeleteDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    const isUsed =
        action.userActionCount > 0 || action.recommendationCount > 0;

    function handleDelete() {
        setMessage(null);

        startTransition(async () => {
            const res = await fetch(`/api/admin/actions/${action.id}`, {
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
                setMessage(data.message || "Action gagal dihapus.");
                return;
            }

            setMessage("Action berhasil dihapus.");
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

            <DialogContent className="sm:max-w-lg dark:border-white/10 dark:bg-slate-950 dark:text-slate-50">
                <DialogHeader>
                    <DialogTitle>Hapus Action Master?</DialogTitle>
                    <DialogDescription>
                        Action yang sudah dipakai user atau rekomendasi AI tidak bisa
                        dihapus untuk menjaga histori data tetap aman.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {message ? (
                        <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-300/20 dark:bg-red-400/10 dark:text-red-200">
                            <AlertDescription className="text-sm leading-6">
                                {message}
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                            Action
                        </p>
                        <p className="mt-2 font-semibold text-slate-950 dark:text-emerald-50">
                            {action.name}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:ring-white/10">
                                <p className="text-xs text-muted-foreground dark:text-slate-400">
                                    User Actions
                                </p>
                                <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-emerald-50">
                                    {action.userActionCount}
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:ring-white/10">
                                <p className="text-xs text-muted-foreground dark:text-slate-400">
                                    AI Recommendations
                                </p>
                                <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-emerald-50">
                                    {action.recommendationCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    {isUsed ? (
                        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100">
                            <AlertDescription className="text-sm leading-6">
                                Action ini sudah dipakai, jadi tidak bisa dihapus. Gunakan edit
                                jika ingin memperbarui nama, deskripsi, kategori, atau score.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-300/20 dark:bg-red-400/10 dark:text-red-200">
                            <AlertDescription className="text-sm leading-6">
                                Action ini belum dipakai. Menghapus action akan menghilangkan
                                template ini dari sistem rekomendasi.
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
                            Hapus Action
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
