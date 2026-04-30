"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Edit3, Loader2, Save } from "lucide-react";

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type FieldErrors = Record<string, string[] | undefined>;

type CommunityEditDialogProps = {
    community: {
        id: string;
        name: string;
        type: string;
        cityId: string;
    };
    cities: {
        id: string;
        name: string;
        province: string;
    }[];
};

export function CommunityEditDialog({
    community,
    cities,
}: CommunityEditDialogProps) {
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
            type: formData.get("type"),
            cityId: formData.get("cityId"),
        };

        startTransition(async () => {
            const res = await fetch(`/api/admin/communities/${community.id}`, {
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
                setMessage(data.message || "Community gagal diperbarui.");
                setErrors(data.errors || {});
                return;
            }

            setMessage("Community berhasil diperbarui.");
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
                    <DialogTitle>Edit Community</DialogTitle>
                    <DialogDescription>
                        Perubahan community akan memengaruhi pengelompokan user,
                        city insight, dan monitoring kolaborasi.
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
                        <Label className="dark:text-slate-200" htmlFor={`name-${community.id}`}>
                            Nama Community
                        </Label>
                        <Input
                            id={`name-${community.id}`}
                            name="name"
                            defaultValue={community.name}
                            required
                        />
                        {errors.name ? (
                            <p className="text-xs text-red-600 dark:text-red-300">{errors.name[0]}</p>
                        ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label className="dark:text-slate-200">Tipe Community</Label>
                            <Select
                                name="type"
                                defaultValue={community.type}
                                required
                            >
                                <SelectTrigger className="dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                    <SelectValue placeholder="Pilih tipe community" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CAMPUS">Campus</SelectItem>
                                    <SelectItem value="CITY">City</SelectItem>
                                    <SelectItem value="UMKM">UMKM</SelectItem>
                                    <SelectItem value="YOUTH_ORGANIZATION">
                                        Youth Organization
                                    </SelectItem>
                                    <SelectItem value="ENVIRONMENTAL_COMMUNITY">
                                        Environmental Community
                                    </SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.type[0]}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-2">
                            <Label className="dark:text-slate-200">City Node</Label>
                            <Select
                                name="cityId"
                                defaultValue={community.cityId}
                                required
                            >
                                <SelectTrigger className="dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-50">
                                    <SelectValue placeholder="Pilih city node" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city.id} value={city.id}>
                                            {city.name}, {city.province}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.cityId ? (
                                <p className="text-xs text-red-600 dark:text-red-300">
                                    {errors.cityId[0]}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-emerald-950 text-emerald-50 hover:bg-emerald-900"
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