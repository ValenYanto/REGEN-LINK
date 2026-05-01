import Link from "next/link";
import {
    ArrowLeft,
    BarChart3,
    Flame,
    ShieldCheck,
    Sparkles,
    Target,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { ActionCreateForm } from "@/components/admin/action-create-form";
import { ActionEditDialog } from "@/components/admin/action-edit-dialog";
import { ActionDeleteDialog } from "@/components/admin/action-delete-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const categoryLabels: Record<string, string> = {
    ENERGY: "Energi",
    WASTE: "Limbah",
    CIRCULAR: "Sirkular",
    COMMUNITY: "Komunitas",
    GENERAL: "Umum",
};

const difficultyLabels: Record<string, string> = {
    EASY: "Mudah",
    MEDIUM: "Sedang",
    HARD: "Sulit",
};

function formatNumber(value: number) {
    return new Intl.NumberFormat("id-ID").format(value);
}

function formatDate(value: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}

function getCategoryClass(category: string) {
    if (category === "ENERGY") {
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-300/15 dark:text-emerald-200 dark:hover:bg-emerald-300/15";
    }

    if (category === "WASTE") {
        return "bg-lime-100 text-lime-800 hover:bg-lime-100 dark:bg-lime-300/15 dark:text-lime-200 dark:hover:bg-lime-300/15";
    }

    if (category === "CIRCULAR") {
        return "bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-300/15 dark:text-teal-200 dark:hover:bg-teal-300/15";
    }

    if (category === "COMMUNITY") {
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-300/15 dark:text-amber-200 dark:hover:bg-amber-300/15";
    }

    return "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10";
}

function getDifficultyClass(difficulty: string) {
    if (difficulty === "EASY") {
        return "bg-emerald-50 text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-300/15 dark:text-emerald-200 dark:hover:bg-emerald-300/15";
    }

    if (difficulty === "MEDIUM") {
        return "bg-amber-50 text-amber-800 hover:bg-amber-50 dark:bg-amber-300/15 dark:text-amber-200 dark:hover:bg-amber-300/15";
    }

    return "bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-300/15 dark:text-red-200 dark:hover:bg-red-300/15";
}

export default async function AdminActionsPage() {
    const admin = await requireAdmin();

    const actions = await prisma.action.findMany({
        orderBy: [
            {
                category: "asc",
            },
            {
                name: "asc",
            },
        ],
        include: {
            userActions: {
                select: {
                    id: true,
                    status: true,
                },
            },
            aiRecommendations: {
                select: {
                    id: true,
                },
            },
        },
    });

    const totalActions = actions.length;
    const totalUserActions = actions.reduce(
        (sum, action) => sum + action.userActions.length,
        0
    );
    const totalRecommendations = actions.reduce(
        (sum, action) => sum + action.aiRecommendations.length,
        0
    );
    const averageBaseScore =
        actions.length > 0
            ? Math.round(
                actions.reduce(
                    (sum, action) => sum + Number(action.baseImpactScore),
                    0
                ) / actions.length
            )
            : 0;

    return (
        <main className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-5 md:rounded-[2rem] md:p-7">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />

                <div className="relative flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="mb-4 border-emerald-900/10 bg-white text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                        >
                            <Link href="/dashboard/admin">
                                <ArrowLeft className="mr-2 size-4" />
                                Kembali ke Admin
                            </Link>
                        </Button>

                        <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm transition-colors dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 dark:shadow-none">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Admin Action Master</span>
                        </div>

                        <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-3xl md:text-4xl">
                            Kelola Action Master
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Tambahkan, pantau, edit, dan hapus template aksi yang
                            digunakan oleh recommendation engine untuk menghasilkan
                            UserAction dan impact estimation.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                Admin: {admin.name}
                            </Badge>
                            <Badge className="border-emerald-900/10 bg-white text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10">
                                {totalActions} action master
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur transition-colors dark:border-white/10 dark:bg-white/[0.07] dark:shadow-none lg:w-[320px]">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Recommendation Source
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-emerald-50">
                            {formatNumber(totalRecommendations)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Rekomendasi AI yang memakai action master.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminActionStatCard
                    label="Action Master"
                    value={formatNumber(totalActions)}
                    caption="Template aksi"
                    icon={<Flame className="size-5" />}
                />
                <AdminActionStatCard
                    label="User Actions"
                    value={formatNumber(totalUserActions)}
                    caption="Aksi yang dibuat user"
                    icon={<Target className="size-5" />}
                />
                <AdminActionStatCard
                    label="AI Recommendations"
                    value={formatNumber(totalRecommendations)}
                    caption="Rekomendasi tergenerate"
                    icon={<Sparkles className="size-5" />}
                />
                <AdminActionStatCard
                    label="Avg Base Score"
                    value={formatNumber(averageBaseScore)}
                    caption="Rata-rata score aksi"
                    icon={<BarChart3 className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
                <Card className="w-full min-w-0 overflow-hidden border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                        <CardTitle className="text-base text-emerald-950 dark:text-emerald-50 sm:text-lg">
                            Action Directory
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                            Daftar action master yang dipakai untuk rekomendasi,
                            progress, score, dan challenge.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        {actions.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                                    Belum ada action master.
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                                    Tambahkan action pertama melalui form di samping.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-emerald-900/10 dark:divide-white/10">
                                {actions.map((action) => {
                                    const userActionCount = action.userActions.length;
                                    const recommendationCount =
                                        action.aiRecommendations.length;

                                    return (
                                        <article
                                            key={action.id}
                                            className="bg-white px-4 py-5 transition hover:bg-emerald-50/30 dark:bg-transparent dark:hover:bg-white/[0.04] sm:px-5"
                                        >
                                            <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_260px] 2xl:items-start">
                                                <div className="min-w-0">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors dark:bg-emerald-400/10 dark:text-emerald-300">
                                                            <Flame className="size-4" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                <div className="min-w-0">
                                                                    <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-emerald-950 dark:text-emerald-50 sm:text-base">
                                                                        {action.name}
                                                                    </h3>
                                                                    <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                                                        {action.description}
                                                                    </p>
                                                                </div>

                                                                <div className="flex shrink-0 flex-wrap gap-2">
                                                                    <Badge
                                                                        className={getCategoryClass(
                                                                            action.category
                                                                        )}
                                                                    >
                                                                        {categoryLabels[
                                                                            action.category
                                                                        ] ?? action.category}
                                                                    </Badge>

                                                                    <Badge
                                                                        className={getDifficultyClass(
                                                                            action.difficultyLevel
                                                                        )}
                                                                    >
                                                                        {difficultyLabels[
                                                                            action.difficultyLevel
                                                                        ] ?? action.difficultyLevel}
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                                                <ActionInfoBox
                                                                    label="Base Score"
                                                                    value={`+${formatNumber(
                                                                        Number(
                                                                            action.baseImpactScore
                                                                        )
                                                                    )}`}
                                                                />
                                                                <ActionInfoBox
                                                                    label="User Actions"
                                                                    value={formatNumber(
                                                                        userActionCount
                                                                    )}
                                                                    helper="Aksi user"
                                                                />
                                                                <ActionInfoBox
                                                                    label="AI Rec"
                                                                    value={formatNumber(
                                                                        recommendationCount
                                                                    )}
                                                                    helper="Rekomendasi"
                                                                />
                                                                <ActionInfoBox
                                                                    label="Created"
                                                                    value={formatDate(
                                                                        action.createdAt
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-emerald-900/10 bg-slate-50/70 p-3 transition-colors dark:border-white/10 dark:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-end 2xl:flex-col 2xl:items-stretch">
                                                    <ActionEditDialog
                                                        action={{
                                                            id: action.id,
                                                            name: action.name,
                                                            description:
                                                                action.description,
                                                            category: action.category,
                                                            difficultyLevel:
                                                                action.difficultyLevel,
                                                            baseImpactScore: Number(
                                                                action.baseImpactScore
                                                            ),
                                                        }}
                                                    />

                                                    <ActionDeleteDialog
                                                        action={{
                                                            id: action.id,
                                                            name: action.name,
                                                            userActionCount,
                                                            recommendationCount,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <aside className="min-w-0 space-y-5">
                    <ActionCreateForm />

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                            <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                                Action Master Rules
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Catatan penggunaan action dalam REGEN-LINK.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-5 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                            <p>
                                1. Nama action harus unik agar recommendation engine tidak
                                membuat duplikasi aksi.
                            </p>
                            <p>
                                2. Category menentukan action masuk ke flow energy, waste,
                                circular, community, atau general.
                            </p>
                            <p>
                                3. Difficulty dan base score dipakai saat user menyelesaikan
                                action.
                            </p>
                            <p>
                                4. Action yang sudah dipakai oleh user action atau rekomendasi
                                AI tidak bisa dihapus untuk menjaga histori data.
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </main>
    );
}

function AdminActionStatCard({
    label,
    value,
    caption,
    icon,
}: {
    label: string;
    value: string;
    caption: string;
    icon: React.ReactNode;
}) {
    return (
        <Card className="w-full min-w-0 border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardContent className="flex min-w-0 items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                        {label}
                    </p>
                    <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50">
                        {value}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground dark:text-slate-400">
                        {caption}
                    </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors dark:bg-emerald-400/10 dark:text-emerald-300">
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}

function ActionInfoBox({
    label,
    value,
    helper,
}: {
    label: string;
    value: string;
    helper?: string;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-white px-3 py-3 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
                {label}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                {value}
            </p>
            {helper ? (
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground dark:text-slate-400">
                    {helper}
                </p>
            ) : null}
        </div>
    );
}
