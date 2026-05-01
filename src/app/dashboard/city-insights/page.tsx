import { redirect } from "next/navigation";
import {
    BarChart3,
    Building2,
    CheckCircle2,
    Crown,
    Leaf,
    MapPin,
    Recycle,
    Trophy,
    Users,
    Zap,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type CityInsight = {
    id: string;
    name: string;
    province: string;
    country: string;
    userCount: number;
    totalScore: number;
    totalEnergyKwh: number;
    totalWasteKg: number;
    completedActions: number;
    badgeCount: number;
    rank: number;
};

function getRankLabel(rank: number) {
    if (rank === 1) return "Top City";
    if (rank === 2) return "Runner Up";
    if (rank === 3) return "Top 3";
    return `Rank ${rank}`;
}

function getRankBadgeClass(rank: number) {
    if (rank === 1) {
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-300/15 dark:text-yellow-200 dark:hover:bg-yellow-300/15";
    }

    if (rank === 2) {
        return "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10";
    }

    if (rank === 3) {
        return "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-300/15 dark:text-orange-200 dark:hover:bg-orange-300/15";
    }

    return "bg-emerald-50 text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10";
}

export default async function CityInsightsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUserId = session.user.id;

    const [currentUser, cities] = await Promise.all([
        prisma.user.findUnique({
            where: {
                id: currentUserId,
            },
            include: {
                city: true,
            },
        }),

        prisma.city.findMany({
            include: {
                users: {
                    include: {
                        regenerativeScore: true,
                        energyRecords: true,
                        wasteRecords: true,
                        userActions: {
                            where: {
                                status: {
                                    in: ["COMPLETED", "VERIFIED"],
                                },
                            },
                        },
                        userBadges: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        }),
    ]);

    const cityInsights: CityInsight[] = cities
        .map((city) => {
            const totalScore = city.users.reduce(
                (total, user) => total + (user.regenerativeScore?.totalScore ?? 0),
                0
            );

            const totalEnergyKwh = city.users.reduce((cityTotal, user) => {
                return (
                    cityTotal +
                    user.energyRecords.reduce(
                        (userTotal, record) => userTotal + record.monthlyKwh,
                        0
                    )
                );
            }, 0);

            const totalWasteKg = city.users.reduce((cityTotal, user) => {
                return (
                    cityTotal +
                    user.wasteRecords.reduce(
                        (userTotal, record) => userTotal + record.weightKg,
                        0
                    )
                );
            }, 0);

            const completedActions = city.users.reduce(
                (total, user) => total + user.userActions.length,
                0
            );

            const badgeCount = city.users.reduce(
                (total, user) => total + user.userBadges.length,
                0
            );

            return {
                id: city.id,
                name: city.name,
                province: city.province,
                country: city.country,
                userCount: city.users.length,
                totalScore,
                totalEnergyKwh,
                totalWasteKg,
                completedActions,
                badgeCount,
                rank: 0,
            };
        })
        .sort((a, b) => {
            if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
            if (b.completedActions !== a.completedActions) {
                return b.completedActions - a.completedActions;
            }
            return b.badgeCount - a.badgeCount;
        })
        .map((city, index) => ({
            ...city,
            rank: index + 1,
        }));

    const currentCityInsight = cityInsights.find(
        (city) => city.id === currentUser?.cityId
    );

    const topCity = cityInsights[0];

    const totalCities = cityInsights.length;
    const totalUsers = cityInsights.reduce(
        (total, city) => total + city.userCount,
        0
    );
    const totalScore = cityInsights.reduce(
        (total, city) => total + city.totalScore,
        0
    );
    const totalCompletedActions = cityInsights.reduce(
        (total, city) => total + city.completedActions,
        0
    );
    const totalEnergyKwh = cityInsights.reduce(
        (total, city) => total + city.totalEnergyKwh,
        0
    );
    const totalWasteKg = cityInsights.reduce(
        (total, city) => total + city.totalWasteKg,
        0
    );

    return (
        <div className="w-full min-w-0 space-y-5 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-5 md:rounded-[1.75rem] md:p-6">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />

                <div className="relative grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-center">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex max-w-full items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 dark:shadow-none text-xs font-medium text-emerald-800 shadow-sm">
                            <BarChart3 className="mr-1.5 size-3.5 shrink-0" />
                            <span className="truncate">
                                Cross-City Climate Intelligence
                            </span>
                        </div>

                        <h1 className="max-w-3xl break-words text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-3xl md:text-4xl">
                            City Insights
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Pantau kontribusi kota berdasarkan score, action, badge,
                            pencatatan energi, dan pencatatan limbah dari seluruh node
                            REGEN-LINK.
                        </p>

                        <div className="mt-4 flex min-w-0 flex-wrap gap-2">
                            <Badge className="max-w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                                <span className="truncate">
                                    {currentCityInsight
                                        ? `Your City Rank #${currentCityInsight.rank}`
                                        : "No City Rank"}
                                </span>
                            </Badge>

                            <Badge variant="secondary" className="max-w-full dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                <span className="truncate">
                                    {currentUser?.city
                                        ? `${currentUser.city.name}, ${currentUser.city.province}`
                                        : "No City Node"}
                                </span>
                            </Badge>

                            <Badge variant="outline" className="max-w-full dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                <span className="truncate">
                                    {currentCityInsight?.totalScore ?? 0} city pts
                                </span>
                            </Badge>
                        </div>
                    </div>

                    <div className="min-w-0 rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Leading City
                        </p>
                        <p className="mt-2 truncate text-xl font-semibold text-emerald-950 dark:text-emerald-50 sm:text-2xl">
                            {topCity?.name ?? "No city"}
                        </p>
                        <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-400">
                            {topCity
                                ? `${topCity.totalScore} pts • ${topCity.userCount} users`
                                : "Belum ada data kota."}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardMetricCard
                    label="Cities"
                    value={totalCities.toString()}
                    caption="Kota dalam jaringan"
                    icon={<Building2 className="size-5" />}
                />

                <DashboardMetricCard
                    label="Participants"
                    value={totalUsers.toString()}
                    caption="Total user lintas kota"
                    icon={<Users className="size-5" />}
                />

                <DashboardMetricCard
                    label="Total Score"
                    value={totalScore.toLocaleString("id-ID")}
                    caption="Akumulasi regenerative score"
                    icon={<Leaf className="size-5" />}
                />

                <DashboardMetricCard
                    label="Completed Actions"
                    value={totalCompletedActions.toString()}
                    caption="Aksi selesai lintas kota"
                    icon={<CheckCircle2 className="size-5" />}
                />

                <DashboardMetricCard
                    label="Energy Recorded"
                    value={`${totalEnergyKwh.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kWh`}
                    caption="Total energi tercatat"
                    icon={<Zap className="size-5" />}
                />

                <DashboardMetricCard
                    label="Waste Recorded"
                    value={`${totalWasteKg.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kg`}
                    caption="Total limbah tercatat"
                    icon={<Recycle className="size-5" />}
                />

                <DashboardMetricCard
                    label="Top City"
                    value={topCity?.name ?? "—"}
                    caption={topCity ? `${topCity.totalScore} pts` : "Belum ada data"}
                    icon={<Crown className="size-5" />}
                />

                <DashboardMetricCard
                    label="Your City"
                    value={currentCityInsight ? `#${currentCityInsight.rank}` : "—"}
                    caption={currentUser?.city?.name ?? "No City Node"}
                    icon={<MapPin className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
                <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] px-4 py-4 sm:px-6">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                                <Trophy className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-base sm:text-lg">
                                    City Ranking
                                </CardTitle>
                                <CardDescription className="text-xs leading-5 sm:text-sm">
                                    Ranking kota berdasarkan total score, completed actions, dan
                                    badge.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {cityInsights.length === 0 ? (
                            <div className="p-8 text-center sm:p-10">
                                <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                                    Belum ada city insight.
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                                    Data akan muncul setelah user memiliki city node.
                                </p>
                            </div>
                        ) : (
                            <div className="min-w-0">
                                <div className="hidden grid-cols-[72px_minmax(0,1.3fr)_90px_100px_100px_100px_100px] border-b border-emerald-900/10 bg-emerald-50/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400 md:grid">
                                    <div>Rank</div>
                                    <div>City</div>
                                    <div className="text-right">Users</div>
                                    <div className="text-right">Score</div>
                                    <div className="text-right">Energy</div>
                                    <div className="text-right">Waste</div>
                                    <div className="text-right">Done</div>
                                </div>

                                <div className="divide-y divide-emerald-900/10 dark:divide-white/10">
                                    {cityInsights.map((city) => {
                                        const isCurrentCity = city.id === currentUser?.cityId;

                                        return (
                                            <div
                                                key={city.id}
                                                className={
                                                    isCurrentCity
                                                        ? "bg-emerald-50/70 px-4 py-4 dark:bg-emerald-400/10"
                                                        : "bg-white px-4 py-4 dark:bg-transparent dark:hover:bg-white/[0.04]"
                                                }
                                            >
                                                <div className="grid min-w-0 gap-3 md:grid-cols-[72px_minmax(0,1.3fr)_90px_100px_100px_100px_100px] md:items-center">
                                                    <div>
                                                        <div
                                                            className={
                                                                city.rank <= 3
                                                                    ? "inline-flex h-9 min-w-11 items-center justify-center rounded-xl bg-emerald-950 px-3 text-sm font-bold text-emerald-300 dark:bg-emerald-300 dark:text-emerald-950"
                                                                    : "inline-flex h-9 min-w-11 items-center justify-center rounded-xl bg-emerald-50 px-3 text-sm font-bold text-emerald-800 dark:bg-white/10 dark:text-emerald-200"
                                                            }
                                                        >
                                                            #{city.rank}
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                                                            <p className="max-w-[210px] truncate font-semibold text-emerald-950 dark:text-emerald-50 sm:max-w-[260px]">
                                                                {city.name}
                                                            </p>

                                                            {isCurrentCity ? (
                                                                <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                                                                    Your City
                                                                </Badge>
                                                            ) : null}

                                                            <Badge className={`${getRankBadgeClass(city.rank)} dark:bg-white/10 dark:text-emerald-100 dark:hover:bg-white/10`}>
                                                                {getRankLabel(city.rank)}
                                                            </Badge>
                                                        </div>

                                                        <p className="mt-1 max-w-[260px] truncate text-xs text-muted-foreground dark:text-slate-400">
                                                            {city.province}, {city.country}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 dark:bg-white/[0.04] dark:ring-white/10 ring-1 ring-emerald-900/10 md:block md:bg-transparent md:p-0 md:text-right md:ring-0">
                                                        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 md:hidden">
                                                            Users
                                                        </span>
                                                        <span className="font-semibold text-emerald-950 dark:text-emerald-50">
                                                            {city.userCount}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 dark:bg-white/[0.04] dark:ring-white/10 ring-1 ring-emerald-900/10 md:block md:bg-transparent md:p-0 md:text-right md:ring-0">
                                                        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 md:hidden">
                                                            Score
                                                        </span>
                                                        <span className="font-semibold text-emerald-950 dark:text-emerald-50">
                                                            {city.totalScore}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 dark:bg-white/[0.04] dark:ring-white/10 ring-1 ring-emerald-900/10 md:block md:bg-transparent md:p-0 md:text-right md:ring-0">
                                                        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 md:hidden">
                                                            Energy
                                                        </span>
                                                        <span className="font-semibold text-emerald-950 dark:text-emerald-50">
                                                            {city.totalEnergyKwh.toLocaleString("id-ID", {
                                                                maximumFractionDigits: 0,
                                                            })}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 dark:bg-white/[0.04] dark:ring-white/10 ring-1 ring-emerald-900/10 md:block md:bg-transparent md:p-0 md:text-right md:ring-0">
                                                        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 md:hidden">
                                                            Waste
                                                        </span>
                                                        <span className="font-semibold text-emerald-950 dark:text-emerald-50">
                                                            {city.totalWasteKg.toLocaleString("id-ID", {
                                                                maximumFractionDigits: 1,
                                                            })}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 dark:bg-white/[0.04] dark:ring-white/10 ring-1 ring-emerald-900/10 md:block md:bg-transparent md:p-0 md:text-right md:ring-0">
                                                        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 md:hidden">
                                                            Done
                                                        </span>
                                                        <span className="font-semibold text-emerald-950 dark:text-emerald-50">
                                                            {city.completedActions}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <aside className="min-w-0 space-y-4">
                    <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                            <Badge className="mb-3 w-fit max-w-full border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                <MapPin className="mr-1.5 size-3 shrink-0" />
                                <span className="truncate">Your City Node</span>
                            </Badge>

                            <CardTitle className="break-words text-emerald-950 dark:text-emerald-50">
                                {currentCityInsight
                                    ? `Rank #${currentCityInsight.rank}`
                                    : "No City Node"}
                            </CardTitle>

                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Posisi kota kamu berdasarkan kontribusi kolektif.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-5">
                            <div className="rounded-3xl border border-emerald-900/10 bg-[#f7faf6] p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                                    City Score
                                </p>

                                <p className="mt-3 break-words text-3xl font-semibold text-emerald-950 dark:text-emerald-50 sm:text-4xl">
                                    {currentCityInsight?.totalScore ?? 0}
                                </p>

                                <p className="mt-2 truncate text-sm text-slate-600 dark:text-slate-400">
                                    {currentCityInsight
                                        ? `${currentCityInsight.name}, ${currentCityInsight.province}`
                                        : "Belum ada kota terhubung."}
                                </p>

                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-[width] duration-500 ease-out dark:from-emerald-300 dark:to-lime-300"
                                        style={{
                                            width: `${Math.min(
                                                ((currentCityInsight?.totalScore ?? 0) /
                                                    Math.max(topCity?.totalScore ?? 1, 1)) *
                                                100,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base">Leading City</CardTitle>
                            <CardDescription>
                                Kota dengan total regenerative score tertinggi.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {!topCity ? (
                                <p className="text-sm text-muted-foreground dark:text-slate-400">
                                    Belum ada data kota.
                                </p>
                            ) : (
                                <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                                            <Crown className="size-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="max-w-[190px] truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                {topCity.name}
                                            </p>
                                            <p className="truncate text-xs text-slate-600 dark:text-slate-300">
                                                {topCity.province}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <div className="min-w-0 rounded-2xl bg-white p-3 dark:bg-white/[0.04]">
                                            <p className="truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                {topCity.totalScore}
                                            </p>
                                            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
                                                Score
                                            </p>
                                        </div>
                                        <div className="min-w-0 rounded-2xl bg-white p-3 dark:bg-white/[0.04]">
                                            <p className="truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                {topCity.userCount}
                                            </p>
                                            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
                                                Users
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base">Insight Rules</CardTitle>
                            <CardDescription>
                                Cara sistem menghitung ranking kota.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                            <p>1. Ranking utama dihitung dari total regenerative score.</p>
                            <p>2. Jika score sama, completed action menjadi pembeda.</p>
                            <p>3. Badge digunakan sebagai pembeda tambahan.</p>
                            <p>4. Energy dan waste menjadi indikator aktivitas kota.</p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </div>
    );
}
