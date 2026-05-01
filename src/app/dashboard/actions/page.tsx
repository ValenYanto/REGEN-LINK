import { redirect } from "next/navigation";
import {
    BadgeCheck,
    CheckCircle2,
    Flame,
    Sparkles,
    PlayCircle,
    Target,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { ActionStatusControls } from "@/components/dashboard/action-status-controls";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const statusLabels: Record<string, string> = {
    PLANNED: "Direncanakan",
    IN_PROGRESS: "Berjalan",
    COMPLETED: "Selesai",
    VERIFIED: "Terverifikasi",
    CANCELLED: "Dibatalkan",
};

const statusClassNames: Record<string, string> = {
    PLANNED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    IN_PROGRESS: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    COMPLETED: "bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200",
    VERIFIED: "bg-lime-100 text-lime-800 hover:bg-lime-100",
    CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
};

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

function formatNumber(value: number, maximumFractionDigits = 1) {
    return value.toLocaleString("id-ID", {
        maximumFractionDigits,
    });
}

export default async function ActionsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;

    const [userActions, regenerativeScore, userBadges, badges] = await Promise.all([
        prisma.userAction.findMany({
            where: {
                userId,
            },
            include: {
                action: true,
                impactEstimation: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.regenerativeScore.findUnique({
            where: {
                userId,
            },
        }),

        prisma.userBadge.findMany({
            where: {
                userId,
            },
            include: {
                badge: true,
            },
            orderBy: {
                earnedAt: "desc",
            },
        }),

        prisma.badge.findMany({
            orderBy: {
                requiredScore: "asc",
            },
        }),
    ]);

    const plannedCount = userActions.filter(
        (item) => item.status === "PLANNED"
    ).length;

    const inProgressCount = userActions.filter(
        (item) => item.status === "IN_PROGRESS"
    ).length;

    const completedCount = userActions.filter(
        (item) => item.status === "COMPLETED" || item.status === "VERIFIED"
    ).length;

    const totalCo2Avoided = userActions.reduce(
        (total, item) =>
            total + (item.impactEstimation?.estimatedCo2ReducedKg ?? 0),
        0
    );

    const score = regenerativeScore?.totalScore ?? 0;
    const level = regenerativeScore?.level ?? "Perintis Aksi";
    const completionRate =
        userActions.length > 0
            ? Math.round((completedCount / userActions.length) * 100)
            : 0;

    return (
        <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-5 md:rounded-[2rem] md:p-8">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />

                <div className="relative grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-end">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex max-w-full items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 dark:shadow-none text-xs font-medium text-emerald-800 shadow-sm">
                            <Flame className="mr-1.5 size-3.5 shrink-0" />
                            <span className="truncate">Climate Action Execution</span>
                        </div>

                        <h1 className="max-w-3xl break-words text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-3xl md:text-5xl">
                            Pusat Aksi
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 md:text-base">
                            Jalankan rekomendasi dari Pusat Dampak, ubah status aksi,
                            lalu dapatkan kenaikan regenerative score saat aksi selesai.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="max-w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                                <span className="truncate">{level}</span>
                            </Badge>
                            <Badge variant="secondary" className="dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                {score.toLocaleString("id-ID")} pts
                            </Badge>
                            <Badge variant="outline" className="dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                {formatNumber(totalCo2Avoided)} kg CO₂ avoided
                            </Badge>
                        </div>
                    </div>

                    <div className="min-w-0 rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Current Score
                        </p>
                        <p className="mt-2 break-words text-3xl font-semibold text-emerald-950 dark:text-emerald-50">
                            {score.toLocaleString("id-ID")}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Level: {level}
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                            <div
                                className="h-full rounded-full bg-emerald-950 transition-[width] duration-500 ease-out dark:bg-emerald-300"
                                style={{
                                    width: `${Math.min((score / 500) * 100, 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardMetricCard
                    label="Direncanakan"
                    value={plannedCount.toString()}
                    caption="Aksi siap dimulai"
                    icon={<Target className="size-5" />}
                />

                <DashboardMetricCard
                    label="Sedang Berjalan"
                    value={inProgressCount.toString()}
                    caption="Aksi dalam proses"
                    icon={<PlayCircle className="size-5" />}
                />

                <DashboardMetricCard
                    label="Selesai"
                    value={completedCount.toString()}
                    caption="Aksi sudah berdampak"
                    icon={<CheckCircle2 className="size-5" />}
                />

                <DashboardMetricCard
                    label="Badge"
                    value={userBadges.length.toString()}
                    caption="Lencana terbuka"
                    icon={<BadgeCheck className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <div className="min-w-0 space-y-4">
                    {userActions.length === 0 ? (
                        <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                            <CardContent className="p-8 text-center sm:p-10">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-800">
                                    <Sparkles className="size-6" />
                                </div>
                                <h2 className="mt-5 text-xl font-semibold text-emerald-950 dark:text-emerald-50">
                                    Belum ada aksi.
                                </h2>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground dark:text-slate-400">
                                    Buka Pusat Dampak, lalu klik Generate Rekomendasi &
                                    Estimasi Dampak untuk membuat aksi pertama.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        userActions.map((userAction) => (
                            <Card
                                key={userAction.id}
                                className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none"
                            >
                                <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] px-4 py-4 sm:px-6">
                                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex min-w-0 gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                                                <Flame className="size-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <CardTitle className="line-clamp-2 text-base sm:text-lg">
                                                    {userAction.action.name}
                                                </CardTitle>
                                                <CardDescription className="mt-1 line-clamp-3 text-xs leading-5 sm:text-sm sm:leading-6">
                                                    {userAction.action.description}
                                                </CardDescription>
                                            </div>
                                        </div>

                                        <Badge
                                            className={
                                                (statusClassNames[userAction.status] ??
                                                    "bg-slate-100 text-slate-700") +
                                                " w-fit shrink-0"
                                            }
                                        >
                                            {statusLabels[userAction.status] ?? userAction.status}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="min-w-0 space-y-5 px-4 pt-5 pb-4 sm:px-6">
                                    <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                        <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-emerald-300">
                                                Kategori
                                            </p>
                                            <p className="mt-2 truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                {categoryLabels[userAction.action.category] ??
                                                    userAction.action.category}
                                            </p>
                                        </div>

                                        <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-lime-50/50 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-emerald-300">
                                                Kesulitan
                                            </p>
                                            <p className="mt-2 truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                {difficultyLabels[
                                                    userAction.action.difficultyLevel
                                                ] ?? userAction.action.difficultyLevel}
                                            </p>
                                        </div>

                                        <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-white p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-emerald-300">
                                                Base Score
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                +{userAction.action.baseImpactScore}
                                            </p>
                                        </div>

                                        <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-white p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-emerald-300">
                                                Dampak CO₂
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                {formatNumber(
                                                    userAction.impactEstimation
                                                        ?.estimatedCo2ReducedKg ?? 0
                                                )}{" "}
                                                kg
                                            </p>
                                        </div>
                                    </div>

                                    {userAction.notes ? (
                                        <div className="min-w-0 rounded-2xl border border-dashed border-emerald-900/20 bg-emerald-50/40 p-4 transition-colors dark:border-emerald-300/20 dark:bg-emerald-400/10">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-300">
                                                Alasan AI
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-emerald-50/80">
                                                {userAction.notes}
                                            </p>
                                        </div>
                                    ) : null}

                                    <ActionStatusControls
                                        userActionId={userAction.id}
                                        status={userAction.status}
                                    />
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <aside className="min-w-0 space-y-5">
                    <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                            <Badge className="mb-3 w-fit max-w-full border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                <BadgeCheck className="mr-1.5 size-3 shrink-0" />
                                <span className="truncate">Progress Aksi</span>
                            </Badge>

                            <CardTitle className="break-words text-emerald-950 dark:text-emerald-50">
                                Kesiapan Eksekusi
                            </CardTitle>

                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Setiap aksi selesai akan menaikkan score berdasarkan tingkat
                                kesulitan dan estimasi dampak.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-5">
                            <div className="rounded-3xl border border-emerald-900/10 bg-[#f7faf6] p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                                    Completion Rate
                                </p>

                                <p className="mt-3 text-4xl font-semibold text-emerald-950 dark:text-emerald-50">
                                    {completionRate}%
                                </p>

                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    {completedCount} dari {userActions.length} aksi selesai.
                                </p>

                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-[width] duration-500 ease-out dark:from-emerald-300 dark:to-lime-300"
                                        style={{
                                            width: `${completionRate}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                            <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                                Badge Pengguna
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Badge terbuka otomatis berdasarkan regenerative score.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-5">
                            {badges.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-emerald-50/40 p-6 text-center transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                    <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                                        Belum ada badge tersedia.
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                                        Badge akan muncul setelah data badge tersedia di sistem.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {badges.map((badge) => {
                                        const isUnlocked = userBadges.some(
                                            (userBadge) => userBadge.badgeId === badge.id
                                        );

                                        return (
                                            <div
                                                key={badge.id}
                                                className={
                                                    isUnlocked
                                                        ? "min-w-0 rounded-2xl border border-emerald-900/10 bg-emerald-50 p-4 transition-colors dark:border-emerald-300/20 dark:bg-emerald-400/10"
                                                        : "min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 opacity-80 transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:opacity-70"
                                                }
                                            >
                                                <div className="flex min-w-0 items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                            {badge.name}
                                                        </p>
                                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                                            {badge.description}
                                                        </p>
                                                    </div>

                                                    <Badge
                                                        className={
                                                            isUnlocked
                                                                ? "shrink-0 bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200"
                                                                : "shrink-0 bg-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                                                        }
                                                    >
                                                        {isUnlocked ? "Terbuka" : `${badge.requiredScore} pts`}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base">Cara Kerja</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                            <p>
                                1. Aksi dibuat dari rekomendasi rule-based AI di Pusat Dampak.
                            </p>
                            <p>2. Klik Mulai Aksi untuk menandai aksi sedang berjalan.</p>
                            <p>3. Klik Tandai Selesai setelah aksi dilakukan.</p>
                            <p>
                                4. Score, badge, dan progress challenge akan diperbarui otomatis.
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </div>
    );
}
