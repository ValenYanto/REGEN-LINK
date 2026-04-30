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

type ChallengeEditDialogProps = {
    challenge: {
        id: string;
        name: string;
        description: string;
        type: string;
        targetValue: number;
        startDate: Date;
        endDate: Date;
    };
};

function toDateInputValue(date: Date) {
    return date.toISOString().slice(0, 10);
}

const inputClassName =
    "dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50 dark:placeholder:text-slate-500";

export function ChallengeEditDialog({ challenge }: ChallengeEditDialogProps) {
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
            type: formData.get("type"),
            targetValue: formData.get("targetValue"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
        };

        startTransition(async () => {
            const res = await fetch(`/api/admin/challenges/${challenge.id}`, {
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
                setMessage(data.message || "Challenge gagal diperbarui.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("Challenge berhasil diperbarui.");
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
                    className="h-8 w-full justify-center border-emerald-900/15 bg-white text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50 dark:hover:bg-white/10 sm:w-auto 2xl:w-full"
                >
                    <Edit3 className="mr-2 size-3.5" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto border-emerald-900/10 bg-white text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-slate-50 sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-emerald-950 dark:text-emerald-50">
                        Edit Challenge
                    </DialogTitle>
                    <DialogDescription className="dark:text-slate-400">
                        Perubahan challenge akan memengaruhi target, timeline, dan
                        perhitungan progress participant.
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
                        <Label
                            className="dark:text-slate-200"
                            htmlFor={`name-${challenge.id}`}
                        >
                            Nama Challenge
                        </Label>
                        <Input
                            id={`name-${challenge.id}`}
                            name="name"
                            defaultValue={challenge.name}
                            required
                            className={inputClassName}
                        />
                        {errors.name ? (
                            <p className="text-xs text-red-600 dark:text-red-300">
                                {errors.name[0]}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-2">
                        <Label
                            className="dark:text-slate-200"
                            htmlFor={`description-${challenge.id}`}
                        >
                            Deskripsi
                        </Label>
                        <Textarea
                            id={`description-${challenge.id}`}
                            name="description"
                            defaultValue={challenge.description}
                            rows={5}
                            className={`min-h-32 resize-none ${inputClassName}`}
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
                            <Label className="dark:text-slate-200">
                                Tipe Challenge
                            </Label>
                            <Select name="type" defaultValue={challenge.type} required>
                                <SelectTrigger className={inputClassName}>
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ENERGY">Energi</SelectItem>
                                    <SelectItem value="WASTE">Limbah</SelectItem>
                                    <SelectItem value="CIRCULAR">Sirkular</SelectItem>
                                    <SelectItem value="CROSS_CITY">Lintas Kota</SelectItem>
                                    <SelectItem value="COMMUNITY">Komunitas</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.type[0]}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-2">
                            <Label
                                className="dark:text-slate-200"
                                htmlFor={`targetValue-${challenge.id}`}
                            >
                                Target Value
                            </Label>
                            <Input
                                id={`targetValue-${challenge.id}`}
                                name="targetValue"
                                type="number"
                                min="1"
                                step="0.01"
                                defaultValue={challenge.targetValue}
                                required
                                className={inputClassName}
                            />
                            {errors.targetValue ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.targetValue[0]}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label
                                className="dark:text-slate-200"
                                htmlFor={`startDate-${challenge.id}`}
                            >
                                Tanggal Mulai
                            </Label>
                            <Input
                                id={`startDate-${challenge.id}`}
                                name="startDate"
                                type="date"
                                defaultValue={toDateInputValue(challenge.startDate)}
                                required
                                className={inputClassName}
                            />
                            {errors.startDate ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.startDate[0]}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-2">
                            <Label
                                className="dark:text-slate-200"
                                htmlFor={`endDate-${challenge.id}`}
                            >
                                Tanggal Selesai
                            </Label>
                            <Input
                                id={`endDate-${challenge.id}`}
                                name="endDate"
                                type="date"
                                defaultValue={toDateInputValue(challenge.endDate)}
                                required
                                className={inputClassName}
                            />
                            {errors.endDate ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.endDate[0]}
                                </p>
                            ) : null}
                        </div>
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