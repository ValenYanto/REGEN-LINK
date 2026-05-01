"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Edit3, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type FieldErrors = Record<string, string[] | undefined>;

type ActionEditDialogProps = {
    action: {
        id: string;
        name: string;
        description: string;
        category: string;
        difficultyLevel: string;
        baseImpactScore: number;
    };
};

export function ActionEditDialog({ action }: ActionEditDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
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
            name: formData.get("name"),
            description: formData.get("description"),
            category: formData.get("category"),
            difficultyLevel: formData.get("difficultyLevel"),
            baseImpactScore: formData.get("baseImpactScore"),
        };

        startTransition(async () => {
            const res = await fetch(`/api/admin/actions/${action.id}`, {
                method: "PATCH",
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
                setMessage(data.message || "Action gagal diperbarui.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("Action berhasil diperbarui.");
            router.refresh();

            window.setTimeout(() => {
                setOpen(false);
                setMessage(null);
                setErrors({});
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
                    className="h-8 border-emerald-900/15 text-emerald-950 dark:text-emerald-50 hover:bg-emerald-50"
                >
                    <Edit3 className="mr-2 size-3.5" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl dark:border-white/10 dark:bg-slate-950 dark:text-slate-50">
                <DialogHeader>
                    <DialogTitle>Edit Action Master</DialogTitle>
                    <DialogDescription>
                        Perubahan action master akan memengaruhi tampilan action dan
                        rekomendasi baru ke depannya.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="grid gap-4">
                    {message ? (
                        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                            <AlertDescription className="text-sm leading-6">
                                {message}
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    <div className="grid gap-2">
                        <Label className="dark:text-slate-200" htmlFor={`name-${action.id}`}>Nama Aksi</Label>
                        <Input
                            id={`name-${action.id}`}
                            name="name"
                            defaultValue={action.name}
                            required
                        />
                        {errors.name ? (
                            <p className="text-xs text-red-600 dark:text-red-300">{errors.name[0]}</p>
                        ) : null}
                    </div>

                    <div className="grid gap-2">
                        <Label className="dark:text-slate-200" htmlFor={`description-${action.id}`}>Deskripsi</Label>
                        <Textarea
                            id={`description-${action.id}`}
                            name="description"
                            defaultValue={action.description}
                            rows={5}
                            className="min-h-32 resize-none"
                            required
                        />
                        {errors.description ? (
                            <p className="text-xs text-red-600 dark:text-red-300">
                                {errors.description[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label className="dark:text-slate-200">Kategori</Label>
                            <Select name="category" defaultValue={action.category} required>
                                <SelectTrigger className="dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ENERGY">Energi</SelectItem>
                                    <SelectItem value="WASTE">Limbah</SelectItem>
                                    <SelectItem value="CIRCULAR">Sirkular</SelectItem>
                                    <SelectItem value="COMMUNITY">Komunitas</SelectItem>
                                    <SelectItem value="GENERAL">Umum</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.category[0]}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-2">
                            <Label className="dark:text-slate-200">Kesulitan</Label>
                            <Select
                                name="difficultyLevel"
                                defaultValue={action.difficultyLevel}
                                required
                            >
                                <SelectTrigger className="dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                    <SelectValue placeholder="Pilih kesulitan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EASY">Mudah</SelectItem>
                                    <SelectItem value="MEDIUM">Sedang</SelectItem>
                                    <SelectItem value="HARD">Sulit</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.difficultyLevel ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.difficultyLevel[0]}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label className="dark:text-slate-200" htmlFor={`baseImpactScore-${action.id}`}>
                            Base Impact Score
                        </Label>
                        <Input
                            id={`baseImpactScore-${action.id}`}
                            name="baseImpactScore"
                            type="number"
                            min="1"
                            max="500"
                            defaultValue={action.baseImpactScore}
                            required
                        />
                        {errors.baseImpactScore ? (
                            <p className="text-xs text-red-600 dark:text-red-300">
                                {errors.baseImpactScore[0]}
                            </p>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-emerald-950 text-emerald-50 hover:bg-emerald-900 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 size-4" />
                        )}
                        Simpan Perubahan
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
