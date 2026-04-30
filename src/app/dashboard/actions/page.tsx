import { redirect } from "next/navigation";
import {
    Activity,
    BadgeCheck,
    CheckCircle2,
    Flame,
    Leaf,
    PlayCircle,
    Sparkles,
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
    PLANNED: "Planned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    VERIFIED: "Verified",
    CANCELLED: "Cancelled",
};

const statusClassNames: Record<string, string> = {
    PLANNED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    IN_PROGRESS: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    COMPLETED: "bg-emerald-950 text-emerald-50 hover:bg-emerald-950",
    VERIFIED: "bg-lime-100 text-lime-800 hover:bg-lime-100",
    CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
};

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

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-[#f7faf6] p-6 shadow-sm md:p-8">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl" />

                <div className="relative grid gap-6 lg:grid-cols-[1fr_300px] lg:items-end">
                    <div>
                        <div className="mb-5 inline-flex items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                            <Flame className="mr-1.5 size-3.5" />
                            Climate Action Execution
                        </div>

                        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                            Actions Center
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                            Jalankan rekomendasi aksi dari Impact Center, ubah status menjadi
                            selesai, dan naikkan regenerative score berdasarkan dampak aksi.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                            Current Score
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-emerald-950">
                            {regenerativeScore?.totalScore ?? 0}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Level: {regenerativeScore?.level ?? "Seed"}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                <DashboardMetricCard
                    label="Planned"
                    value={plannedCount.toString()}
                    caption="Aksi yang siap dimulai"
                    icon={<Target className="size-5" />}
                />

                <DashboardMetricCard
                    label="In Progress"
                    value={inProgressCount.toString()}
                    caption="Aksi sedang berjalan"
                    icon={<PlayCircle className="size-5" />}
                />

                <DashboardMetricCard
                    label="Completed"
                    value={completedCount.toString()}
                    caption="Aksi selesai"
                    icon={<CheckCircle2 className="size-5" />}
                />

                <DashboardMetricCard
                    label="Badges"
                    value={userBadges.length.toString()}
                    caption="Badge berhasil dibuka"
                    icon={<BadgeCheck className="size-5" />}
                />
            </section>

            <section className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                    {userActions.length === 0 ? (
                        <Card className="border-emerald-900/10 bg-white/95 shadow-sm">
                            <CardContent className="p-10 text-center">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-800">
                                    <Sparkles className="size-6" />
                                </div>
                                <h2 className="mt-5 text-xl font-semibold text-emerald-950">
                                    Belum ada action.
                                </h2>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                    Buka Impact Center, lalu klik Generate Impact &
                                    Recommendation untuk membuat action pertama.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        userActions.map((userAction) => (
                            <Card
                                key={userAction.id}
                                className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm"
                            >
                                <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                                                <Flame className="size-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {userAction.action.name}
                                                </CardTitle>
                                                <CardDescription className="mt-1 max-w-2xl leading-6">
                                                    {userAction.action.description}
                                                </CardDescription>
                                            </div>
                                        </div>

                                        <Badge
                                            className={
                                                statusClassNames[userAction.status] ??
                                                "bg-slate-100 text-slate-700"
                                            }
                                        >
                                            {statusLabels[userAction.status] ?? userAction.status}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-5 pt-5">
                                    <div className="grid gap-3 md:grid-cols-4">
                                        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4">
                                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                Category
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-950">
                                                {userAction.action.category}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-emerald-900/10 bg-lime-50/50 p-4">
                                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                Difficulty
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-950">
                                                {userAction.action.difficultyLevel}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                Base Score
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-950">
                                                +{userAction.action.baseImpactScore}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                CO₂ Impact
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-950">
                                                {(
                                                    userAction.impactEstimation?.estimatedCo2ReducedKg ?? 0
                                                ).toLocaleString("id-ID", {
                                                    maximumFractionDigits: 1,
                                                })}{" "}
                                                kg
                                            </p>
                                        </div>
                                    </div>

                                    {userAction.notes ? (
                                        <div className="rounded-2xl border border-dashed border-emerald-900/20 bg-emerald-50/30 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                                                AI Reason
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
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

                <aside className="space-y-5">
                    <Card className="overflow-hidden border-emerald-900/10 bg-emerald-950 text-white shadow-sm">
                        <CardHeader>
                            <Badge className="mb-3 w-fit bg-emerald-300/15 text-emerald-100 hover:bg-emerald-300/15">
                                <BadgeCheck className="mr-1.5 size-3" />
                                Action Progress
                            </Badge>
                            <CardTitle className="text-white">Execution Readiness</CardTitle>
                            <CardDescription className="text-emerald-50/70">
                                Setiap action selesai akan menaikkan score berdasarkan difficulty
                                dan estimasi dampak.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/70">
                                    Completion Rate
                                </p>
                                <p className="mt-3 text-4xl font-semibold">
                                    {userActions.length > 0
                                        ? Math.round((completedCount / userActions.length) * 100)
                                        : 0}
                                    %
                                </p>
                                <p className="mt-2 text-sm text-emerald-50/70">
                                    {completedCount} dari {userActions.length} action selesai.
                                </p>

                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.65)]"
                                        style={{
                                            width: `${userActions.length > 0
                                                ? Math.round((completedCount / userActions.length) * 100)
                                                : 0
                                                }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Badge Pengguna</CardTitle>
                            <CardDescription>
                                Badge terbuka otomatis berdasarkan regenerative score.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {badges.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada badge tersedia.
                                </p>
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
                                                        ? "rounded-2xl border border-emerald-900/10 bg-emerald-50 p-4"
                                                        : "rounded-2xl border border-slate-200 bg-slate-50 p-4 opacity-70"
                                                }
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-emerald-950">
                                                            {badge.name}
                                                        </p>
                                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                            {badge.description}
                                                        </p>
                                                    </div>

                                                    <Badge
                                                        className={
                                                            isUnlocked
                                                                ? "bg-emerald-950 text-emerald-50 hover:bg-emerald-950"
                                                                : "bg-slate-200 text-slate-700 hover:bg-slate-200"
                                                        }
                                                    >
                                                        {isUnlocked ? "Unlocked" : `${badge.requiredScore} pts`}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">How it works</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                            <p>
                                1. Action dibuat dari rekomendasi rule-based AI di Impact
                                Center.
                            </p>
                            <p>
                                2. Klik Start Action untuk menandai aksi sedang berjalan.
                            </p>
                            <p>
                                3. Klik Mark as Completed setelah aksi selesai dilakukan.
                            </p>
                            <p>
                                4. Score akan bertambah otomatis saat action berubah menjadi
                                completed.
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </div>
    );
}