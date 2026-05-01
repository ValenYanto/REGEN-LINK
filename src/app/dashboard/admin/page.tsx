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
    MapPinned,
    Network,
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
        totalCommunities,
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
        prisma.community.count(),
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
            label: "Communities",
            value: formatNumber(totalCommunities),
            caption: "Komunitas aktif",
            icon: Network,
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
    ];

    const impactStats = [
        {
            label: "Challenges",
            value: formatNumber(totalChallenges),
            caption: `${totalChallengeParticipants} partisipasi`,
            icon: Trophy,
        },
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

    const adminModules = [
        {
            href: "/dashboard/admin/users",
            icon: Users,
            title: "Users & Roles",
            description:
                "Kelola user, role admin, community leader, city node, score, dan badge user.",
            badge: "CRUD Active",
        },
        {
            href: "/dashboard/admin/actions",
            icon: Flame,
            title: "Action Master",
            description:
                "Buat, edit, hapus, dan pantau template aksi untuk rekomendasi dan challenge.",
            badge: "CRUD Active",
        },
        {
            href: "/dashboard/admin/challenges",
            icon: Trophy,
            title: "Challenges",
            description:
                "Kelola challenge energy, waste, circular, community, dan cross-city.",
            badge: "CRUD Active",
        },
        {
            href: "/dashboard/admin/badges",
            icon: BadgeCheck,
            title: "Badges",
            description:
                "Kelola badge, kategori, required score, dan monitor badge yang sudah terbuka.",
            badge: "CRUD Active",
        },
        {
            href: "/dashboard/admin/cities",
            icon: MapPinned,
            title: "Cities",
            description:
                "Kelola city node untuk leaderboard kota, city insights, dan data lintas wilayah.",
            badge: "Create Active",
        },
        {
            href: "/dashboard/admin/communities",
            icon: Network,
            title: "Communities",
            description:
                "Kelola komunitas, anggota komunitas, kota, dan kolaborasi antar pengguna.",
            badge: "CRUD Active",
        },
    ];

    return (
        <main className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-5 md:rounded-[2rem] md:p-7">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />

                <div className="relative flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm transition-colors dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 dark:shadow-none">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Admin Control Center</span>
                        </div>

                        <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-3xl md:text-4xl">
                            Admin Overview
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Pusat kendali REGEN-LINK untuk memantau user, kota,
                            komunitas, input energi, input limbah, action master,
                            challenge, badge, rekomendasi AI, dan dampak platform.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                {admin.name}
                            </Badge>
                            <Badge className="border-lime-200 bg-lime-50 text-lime-800 hover:bg-lime-50 dark:border-lime-300/20 dark:bg-lime-400/10 dark:text-lime-200 dark:hover:bg-lime-400/10">
                                {admin.role}
                            </Badge>
                            <Badge className="border-emerald-900/10 bg-white text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10">
                                {admin.city?.name ?? "No City Node"}
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur transition-colors dark:border-white/10 dark:bg-white/[0.07] dark:shadow-none lg:w-[320px]">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Platform Health
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-emerald-50">
                            {completionRate}%
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Completion rate dari seluruh action user.
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-[width] duration-500 ease-out dark:from-emerald-300 dark:to-lime-300"
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

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
                <Card className="w-full min-w-0 border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <CardTitle className="text-base text-emerald-950 dark:text-emerald-50 sm:text-lg">
                                    Modul Admin Aktif
                                </CardTitle>
                                <CardDescription className="mt-1 dark:text-slate-400">
                                    Semua pusat kontrol utama admin sudah tersedia.
                                    Pilih modul untuk mengelola data master dan aktivitas platform.
                                </CardDescription>
                            </div>

                            <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                Phase Admin Polish
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-3 px-4 pb-4 pt-4 sm:px-6 md:grid-cols-2">
                        {adminModules.map((module) => {
                            const Icon = module.icon;

                            return (
                                <AdminModuleLink
                                    key={module.href}
                                    href={module.href}
                                    icon={<Icon className="h-5 w-5" />}
                                    title={module.title}
                                    description={module.description}
                                    badge={module.badge}
                                />
                            );
                        })}
                    </CardContent>
                </Card>

                <aside className="min-w-0 space-y-5">
                    <Card className="w-full min-w-0 overflow-hidden border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-emerald-50/80 to-white px-4 py-4 dark:border-white/10 dark:from-emerald-400/[0.08] dark:to-white/[0.04] sm:px-6">
                            <Badge className="mb-3 w-fit border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                <Database className="mr-1.5 size-3" />
                                Latest Activity
                            </Badge>
                            <CardTitle className="break-words text-emerald-950 dark:text-emerald-50">
                                Data Monitor
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Ringkasan user terbaru dan action terbaru di platform.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4 p-4">
                            <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                                    User Terbaru
                                </p>

                                <div className="mt-3 space-y-3">
                                    {latestUsers.length === 0 ? (
                                        <p className="text-sm text-muted-foreground dark:text-slate-400">
                                            Belum ada user.
                                        </p>
                                    ) : (
                                        latestUsers.map((user) => (
                                            <div key={user.id} className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-950 dark:text-emerald-50">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground dark:text-slate-400">
                                                    {user.city?.name ?? "No City"} •{" "}
                                                    {user.regenerativeScore?.totalScore ?? 0} pts
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                                    Action Terbaru
                                </p>

                                <div className="mt-3 space-y-3">
                                    {latestActions.length === 0 ? (
                                        <p className="text-sm text-muted-foreground dark:text-slate-400">
                                            Belum ada action.
                                        </p>
                                    ) : (
                                        latestActions.map((item) => (
                                            <div key={item.id} className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-950 dark:text-emerald-50">
                                                    {item.action.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground dark:text-slate-400">
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

function AdminModuleLink({
    href,
    icon,
    title,
    description,
    badge,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
}) {
    return (
        <Link
            href={href}
            className="group min-w-0 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-emerald-300/30 dark:hover:bg-emerald-400/10 dark:hover:shadow-none"
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-emerald-400/10 dark:text-emerald-300 dark:shadow-none">
                    {icon}
                </div>

                <Badge className="border-emerald-200 bg-white text-[10px] text-emerald-700 shadow-sm hover:bg-white dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                    {badge}
                </Badge>
            </div>

            <p className="mt-4 font-medium text-slate-950 dark:text-emerald-50">
                {title}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                {description}
            </p>
        </Link>
    );
}
