import Link from "next/link";
import {
    Activity,
    Award,
    BadgeCheck,
    BarChart3,
    Building2,
    CheckCircle2,
    Database,
    Flame,
    Leaf,
    Recycle,
    ShieldCheck,
    Sparkles,
    Trophy,
    Users,
    Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function formatNumber(value: number) {
    return new Intl.NumberFormat("id-ID").format(value);
}

function formatDecimal(value: number) {
    return new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 1,
    }).format(value);
}

function formatDate(value?: Date | null) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}

export default async function AdminOverviewPage() {
    const admin = await requireAdmin();

    const [
        totalUsers,
        totalCities,
        totalEnergyRecords,
        totalWasteRecords,
        totalActions,
        totalUserActions,
        totalCompletedActions,
        totalRecommendations,
        totalImpactEstimations,
        totalBadges,
        totalUserBadges,
        totalChallenges,
        totalChallengeParticipants,
        energyAggregate,
        wasteAggregate,
        scoreAggregate,
        latestUsers,
        latestActions,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.city.count(),
        prisma.energyRecord.count(),
        prisma.wasteRecord.count(),
        prisma.action.count(),
        prisma.userAction.count(),
        prisma.userAction.count({
            where: {
                status: {
                    in: ["COMPLETED", "VERIFIED"],
                },
            },
        }),
        prisma.aiRecommendation.count(),
        prisma.impactEstimation.count(),
        prisma.badge.count(),
        prisma.userBadge.count(),
        prisma.challenge.count(),
        prisma.challengeParticipant.count(),

        prisma.energyRecord.aggregate({
            _sum: {
                monthlyKwh: true,
                electricityCost: true,
            },
        }),

        prisma.wasteRecord.aggregate({
            _sum: {
                weightKg: true,
            },
        }),

        prisma.regenerativeScore.aggregate({
            _sum: {
                totalScore: true,
            },
            _avg: {
                totalScore: true,
            },
        }),

        prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                city: true,
                regenerativeScore: true,
            },
        }),

        prisma.userAction.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                user: true,
                action: true,
            },
        }),
    ]);

    const totalKwh = energyAggregate._sum.monthlyKwh ?? 0;
    const totalCost = energyAggregate._sum.electricityCost ?? 0;
    const totalWasteKg = wasteAggregate._sum.weightKg ?? 0;
    const totalScore = scoreAggregate._sum.totalScore ?? 0;
    const averageScore = scoreAggregate._avg.totalScore ?? 0;

    const completionRate =
        totalUserActions > 0
            ? Math.round((totalCompletedActions / totalUserActions) * 100)
            : 0;

    const platformStats = [
        {
            label: "Total Users",
            value: formatNumber(totalUsers),
            caption: "Akun dalam platform",
            icon: Users,
        },
        {
            label: "Cities",
            value: formatNumber(totalCities),
            caption: "City node terdaftar",
            icon: Building2,
        },
        {
            label: "Energy Records",
            value: formatNumber(totalEnergyRecords),
            caption: `${formatDecimal(totalKwh)} kWh tercatat`,
            icon: Zap,
        },
        {
            label: "Waste Records",
            value: formatNumber(totalWasteRecords),
            caption: `${formatDecimal(totalWasteKg)} kg tercatat`,
            icon: Recycle,
        },
        {
            label: "Actions Master",
            value: formatNumber(totalActions),
            caption: "Template aksi tersedia",
            icon: Flame,
        },
        {
            label: "Completed Actions",
            value: formatNumber(totalCompletedActions),
            caption: `${completionRate}% completion rate`,
            icon: CheckCircle2,
        },
        {
            label: "AI Recommendations",
            value: formatNumber(totalRecommendations),
            caption: "Rekomendasi tergenerate",
            icon: Sparkles,
        },
        {
            label: "Challenges",
            value: formatNumber(totalChallenges),
            caption: `${totalChallengeParticipants} partisipasi`,
            icon: Trophy,
        },
    ];

    const impactStats = [
        {
            label: "Total Score",
            value: formatNumber(totalScore),
            caption: `Rata-rata ${formatDecimal(averageScore)} pts/user`,
            icon: Leaf,
        },
        {
            label: "Electricity Cost",
            value: `Rp${formatNumber(totalCost)}`,
            caption: "Biaya listrik tercatat",
            icon: BarChart3,
        },
        {
            label: "Impact Estimates",
            value: formatNumber(totalImpactEstimations),
            caption: "Estimasi dampak tersimpan",
            icon: Activity,
        },
        {
            label: "Badges Awarded",
            value: formatNumber(totalUserBadges),
            caption: `${totalBadges} badge master`,
            icon: Award,
        },
    ];

    return (
        <main className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(135deg,#06140f,#0a1f17_52%,#07130f)] p-4 text-white shadow-2xl shadow-emerald-950/20 sm:p-5 md:rounded-[2rem] md:p-7">
                <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Admin Control Center</span>
                        </div>

                        <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                            Admin Overview
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/75">
                            Pusat kontrol untuk memantau data platform, aktivitas user,
                            rekomendasi AI, aksi, challenge, badge, dan kontribusi lintas kota.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border-emerald-300/20 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
                                {admin.name}
                            </Badge>
                            <Badge className="border-lime-300/20 bg-lime-400/15 text-lime-100 hover:bg-lime-400/15">
                                {admin.role}
                            </Badge>
                            <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                                {admin.city?.name ?? "No City Node"}
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:w-[300px]">
                        <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/65">
                            Platform Health
                        </p>
                        <p className="mt-2 text-3xl font-semibold">
                            {completionRate}%
                        </p>
                        <p className="mt-1 text-xs leading-5 text-emerald-50/70">
                            Completion rate dari seluruh action user.
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.65)]"
                                style={{
                                    width: `${completionRate}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {platformStats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={item.label}
                            className="w-full min-w-0 border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none"
                        >
                            <CardContent className="flex min-w-0 items-center justify-between gap-3 p-5">
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50">
                                        {item.value}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-muted-foreground dark:text-slate-400">
                                        {item.caption}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {impactStats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={item.label}
                            className="w-full min-w-0 border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none"
                        >
                            <CardContent className="flex min-w-0 items-center justify-between gap-3 p-5">
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50">
                                        {item.value}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-muted-foreground dark:text-slate-400">
                                        {item.caption}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <Card className="w-full min-w-0 border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                    <CardHeader className="px-4 py-4 sm:px-6">
                        <CardTitle className="text-base sm:text-lg">
                            Modul Admin Berikutnya
                        </CardTitle>
                        <CardDescription>
                            Phase 11A baru membuat admin overview. CRUD akan dibuat bertahap
                            pada phase berikutnya.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-3 px-4 pb-4 sm:px-6 md:grid-cols-2">
                        <AdminNextLink
                            href="/dashboard/admin/users"
                            icon={<Users className="h-5 w-5" />}
                            title="Users & Roles"
                            description="Kelola user, role admin, community leader, dan city node."
                        />
                        <AdminNextLink
                            href="/dashboard/admin/actions"
                            icon={<Flame className="h-5 w-5" />}
                            title="Action Master"
                            description="Buat, edit, dan hapus template aksi rekomendasi."
                        />
                        <AdminNextLink
                            href="/dashboard/admin/challenges"
                            icon={<Trophy className="h-5 w-5" />}
                            title="Challenges"
                            description="Kelola tantangan energi, limbah, komunitas, dan lintas kota."
                        />
                        <AdminNextLink
                            href="/dashboard/admin/badges"
                            icon={<BadgeCheck className="h-5 w-5" />}
                            title="Badges"
                            description="Kelola badge, kategori, dan required score."
                        />
                    </CardContent>
                </Card>

                <aside className="min-w-0 space-y-5">
                    <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-emerald-950 text-white shadow-sm">
                        <CardHeader>
                            <Badge className="mb-3 w-fit bg-emerald-300/15 text-emerald-100 hover:bg-emerald-300/15">
                                <Database className="mr-1.5 size-3" />
                                Latest Activity
                            </Badge>
                            <CardTitle className="break-words text-white">
                                Data Monitor
                            </CardTitle>
                            <CardDescription className="text-emerald-50/70">
                                Ringkasan user terbaru dan action terbaru di platform.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">
                                    User Terbaru
                                </p>

                                <div className="mt-3 space-y-3">
                                    {latestUsers.length === 0 ? (
                                        <p className="text-sm text-emerald-50/70">
                                            Belum ada user.
                                        </p>
                                    ) : (
                                        latestUsers.map((user) => (
                                            <div key={user.id} className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-xs text-emerald-50/60">
                                                    {user.city?.name ?? "No City"} •{" "}
                                                    {user.regenerativeScore?.totalScore ?? 0} pts
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">
                                    Action Terbaru
                                </p>

                                <div className="mt-3 space-y-3">
                                    {latestActions.length === 0 ? (
                                        <p className="text-sm text-emerald-50/70">
                                            Belum ada action.
                                        </p>
                                    ) : (
                                        latestActions.map((item) => (
                                            <div key={item.id} className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {item.action.name}
                                                </p>
                                                <p className="truncate text-xs text-emerald-50/60">
                                                    {item.user.name} • {item.status} •{" "}
                                                    {formatDate(item.createdAt)}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </main>
    );
}

function AdminNextLink({
    href,
    icon,
    title,
    description,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="group min-w-0 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04] transition hover:border-emerald-300 hover:bg-emerald-50"
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-emerald-400/10 dark:text-emerald-300 dark:shadow-none">
                    {icon}
                </div>
                <span className="text-xs font-medium text-emerald-700 opacity-0 transition group-hover:opacity-100">
                    Soon
                </span>
            </div>
            <p className="mt-4 font-medium text-slate-950 dark:text-emerald-50">{title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                {description}
            </p>
        </Link>
    );
}
