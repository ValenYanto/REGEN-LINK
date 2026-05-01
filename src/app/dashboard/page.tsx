import Link from "next/link";
import { redirect } from "next/navigation";
import {
    Award,
    BadgeCheck,
    BrainCircuit,
    CheckCircle2,
    Coins,
    Flame,
    Leaf,
    Recycle,
    Trophy,
    Zap,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { OverviewImpactCard } from "@/components/dashboard/overview-impact-card";
import { OverviewProgressPanel } from "@/components/dashboard/overview-progress-panel";
import { LatestRecommendationCard } from "@/components/dashboard/latest-recommendation-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { EnergyUsageChart } from "@/components/dashboard/charts/energy-usage-chart";
import { WasteTrendChart } from "@/components/dashboard/charts/waste-trend-chart";
import { ImpactBreakdownChart } from "@/components/dashboard/charts/impact-breakdown-chart";
import { ScoreProgressChart } from "@/components/dashboard/charts/score-progress-chart";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;

    const [
        user,
        regenerativeScore,
        energyRecords,
        wasteRecords,
        userActions,
        userBadges,
        challengeParticipants,
        latestRecommendation,
    ] = await Promise.all([
        prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                city: true,
            },
        }),

        prisma.regenerativeScore.findUnique({
            where: {
                userId,
            },
        }),

        prisma.energyRecord.findMany({
            where: {
                userId,
            },
            orderBy: {
                recordDate: "desc",
            },
            take: 5,
        }),

        prisma.wasteRecord.findMany({
            where: {
                userId,
            },
            orderBy: {
                recordDate: "desc",
            },
            take: 5,
        }),

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
            take: 8,
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
            take: 3,
        }),

        prisma.challengeParticipant.findMany({
            where: {
                userId,
            },
            include: {
                challenge: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 5,
        }),

        prisma.aiRecommendation.findFirst({
            where: {
                userId,
            },
            include: {
                action: true,
            },
            orderBy: {
                generatedAt: "desc",
            },
        }),
    ]);

    const totalEnergyRecorded = energyRecords.reduce(
        (total, record) => total + record.monthlyKwh,
        0
    );

    const totalWasteRecorded = wasteRecords.reduce(
        (total, record) => total + record.weightKg,
        0
    );

    const completedActions = userActions.filter(
        (item) => item.status === "COMPLETED" || item.status === "VERIFIED"
    );

    const activeActions = userActions.filter(
        (item) => item.status === "PLANNED" || item.status === "IN_PROGRESS"
    );

    const impactTotals = userActions.reduce(
        (total, item) => {
            const impact = item.impactEstimation;

            return {
                energySaved:
                    total.energySaved + (impact?.estimatedEnergySavedKwh ?? 0),
                wasteReduced:
                    total.wasteReduced + (impact?.estimatedWasteReducedKg ?? 0),
                co2Reduced: total.co2Reduced + (impact?.estimatedCo2ReducedKg ?? 0),
                costSaved: total.costSaved + (impact?.estimatedCostSaved ?? 0),
            };
        },
        {
            energySaved: 0,
            wasteReduced: 0,
            co2Reduced: 0,
            costSaved: 0,
        }
    );

    const score = regenerativeScore?.totalScore ?? 0;
    const level = regenerativeScore?.level ?? "Perintis Aksi";
    const scoreProgress = Math.min(Math.round((score / 500) * 100), 100);

    const completedChallengeCount = challengeParticipants.filter(
        (item) => item.progressStatus === "COMPLETED"
    ).length;

    const challengeProgressAverage =
        challengeParticipants.length > 0
            ? Math.round(
                challengeParticipants.reduce((total, item) => {
                    return (
                        total +
                        Math.min(
                            Math.round(
                                (item.progressValue /
                                    item.challenge.targetValue) *
                                100
                            ),
                            100
                        )
                    );
                }, 0) / challengeParticipants.length
            )
            : 0;

    const latestEnergy = energyRecords[0];
    const latestWaste = wasteRecords[0];

    const energyChartData = [...energyRecords].reverse().map((record) => ({
        date: formatDate(record.recordDate),
        kwh: Number(record.monthlyKwh.toFixed(2)),
    }));

    const wasteChartData = [...wasteRecords].reverse().map((record) => ({
        date: formatDate(record.recordDate),
        kg: Number(record.weightKg.toFixed(2)),
        type: record.wasteType,
    }));

    const impactBreakdownData = [
        {
            name: "Energy",
            value: Number(impactTotals.energySaved.toFixed(2)),
            unit: "kWh",
        },
        {
            name: "Waste",
            value: Number(impactTotals.wasteReduced.toFixed(2)),
            unit: "kg",
        },
        {
            name: "CO₂",
            value: Number(impactTotals.co2Reduced.toFixed(2)),
            unit: "kg",
        },
    ];

    return (
        <div className="min-w-0 space-y-5">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-5 md:rounded-[1.75rem] md:p-6">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />

                <div className="relative grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-center">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm transition-colors dark:border-white/10 dark:bg-white/10 dark:text-emerald-200">
                            <Leaf className="mr-1.5 size-3.5" />
                            REGEN-LINK Climate Command Center
                        </div>

                        <h1 className="max-w-3xl break-words text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-3xl md:text-4xl">
                            Selamat datang, {user?.name ?? "Climate Actor"}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Pantau input energi, limbah, rekomendasi AI, action, badge,
                            challenge, dan estimasi dampak dalam satu dashboard ringkas.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge
                                variant="secondary"
                                className="dark:bg-white/10 dark:text-slate-200"
                            >
                                {user?.city?.name ?? "No City Node"}
                            </Badge>
                            <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-300">
                                {level}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="dark:border-white/10 dark:text-slate-200"
                            >
                                {score} pts
                            </Badge>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur transition-colors dark:border-white/10 dark:bg-white/[0.07] dark:shadow-none">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Regenerative Score
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-emerald-50">
                            {score}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {level}
                        </p>

                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                            <div
                                className="h-full rounded-full bg-emerald-950 transition-[width] duration-500 ease-out dark:bg-emerald-300"
                                style={{
                                    width: `${scoreProgress}%`,
                                }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground dark:text-slate-400">
                            {scoreProgress}% menuju Juara Regeneratif.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardMetricCard
                    label="Energy Records"
                    value={`${totalEnergyRecorded.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kWh`}
                    caption={`${energyRecords.length} record terbaru`}
                    icon={<Zap className="size-5" />}
                />

                <DashboardMetricCard
                    label="Waste Records"
                    value={`${totalWasteRecorded.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kg`}
                    caption={`${wasteRecords.length} record terbaru`}
                    icon={<Recycle className="size-5" />}
                />

                <DashboardMetricCard
                    label="Actions Done"
                    value={completedActions.length.toString()}
                    caption={`${activeActions.length} masih aktif`}
                    icon={<CheckCircle2 className="size-5" />}
                />

                <DashboardMetricCard
                    label="Badges"
                    value={userBadges.length.toString()}
                    caption="Badge berhasil dibuka"
                    icon={<Award className="size-5" />}
                />

                <OverviewImpactCard
                    label="Energy Saved"
                    value={`${impactTotals.energySaved.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kWh`}
                    caption="Estimasi dari action"
                    icon={<Zap className="size-5" />}
                />

                <OverviewImpactCard
                    label="Waste Reduced"
                    value={`${impactTotals.wasteReduced.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kg`}
                    caption="Estimasi dari action"
                    icon={<Recycle className="size-5" />}
                />

                <OverviewImpactCard
                    label="CO₂ Avoided"
                    value={`${impactTotals.co2Reduced.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kg`}
                    caption="Estimasi emisi"
                    icon={<Leaf className="size-5" />}
                />

                <OverviewImpactCard
                    label="Cost Saved"
                    value={`Rp${impactTotals.costSaved.toLocaleString("id-ID", {
                        maximumFractionDigits: 0,
                    })}`}
                    caption="Estimasi hemat"
                    icon={<Coins className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 gap-5 lg:grid-cols-2">
                <EnergyUsageChart data={energyChartData} />
                <WasteTrendChart data={wasteChartData} />
            </section>

            <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.6fr)]">
                <ImpactBreakdownChart data={impactBreakdownData} />
                <ScoreProgressChart score={score} level={level} />
            </section>

            <section className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
                <div className="w-full min-w-0 space-y-5 overflow-x-hidden">
                    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
                        <OverviewProgressPanel
                            title="Action Progress"
                            description="Ringkasan eksekusi aksi pengguna."
                            value={`${completedActions.length}/${userActions.length}`}
                            caption={`${activeActions.length} action masih perlu diselesaikan.`}
                            progress={
                                userActions.length > 0
                                    ? Math.round(
                                        (completedActions.length /
                                            userActions.length) *
                                        100
                                    )
                                    : 0
                            }
                            icon={<Flame className="size-5" />}
                        />

                        <OverviewProgressPanel
                            title="Challenge Progress"
                            description="Rata-rata progres challenge yang diikuti."
                            value={`${challengeProgressAverage}%`}
                            caption={`${completedChallengeCount} challenge selesai dari ${challengeParticipants.length} diikuti.`}
                            progress={challengeProgressAverage}
                            icon={<Trophy className="size-5" />}
                        />
                    </div>

                    <LatestRecommendationCard recommendation={latestRecommendation} />

                    <Card className="border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                            <CardTitle className="text-emerald-950 dark:text-emerald-50">
                                Latest Records
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Aktivitas input data terbaru dari Energy dan Waste Center.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="grid gap-3 pt-5 md:grid-cols-2">
                            <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/40 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <Zap className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-emerald-950 dark:text-emerald-50">
                                            Latest Energy
                                        </p>
                                        <p className="text-xs text-muted-foreground dark:text-slate-400">
                                            {latestEnergy
                                                ? formatDate(latestEnergy.recordDate)
                                                : "No data"}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-4 text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
                                    {latestEnergy
                                        ? `${latestEnergy.monthlyKwh.toLocaleString(
                                            "id-ID"
                                        )} kWh`
                                        : "—"}
                                </p>
                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground dark:text-slate-400">
                                    {latestEnergy?.dominantDevices ??
                                        "Tambahkan data energi untuk memulai analisis."}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-emerald-900/10 bg-lime-50/40 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <Recycle className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-emerald-950 dark:text-emerald-50">
                                            Latest Waste
                                        </p>
                                        <p className="text-xs text-muted-foreground dark:text-slate-400">
                                            {latestWaste
                                                ? formatDate(latestWaste.recordDate)
                                                : "No data"}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-4 text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
                                    {latestWaste
                                        ? `${latestWaste.weightKg.toLocaleString(
                                            "id-ID"
                                        )} kg`
                                        : "—"}
                                </p>
                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground dark:text-slate-400">
                                    {latestWaste
                                        ? `${latestWaste.wasteType} • ${latestWaste.managementStatus}`
                                        : "Tambahkan data limbah untuk memulai circular action."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <aside className="min-w-0 space-y-5">
                    <Card className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                            <Badge className="mb-3 w-fit border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                <BrainCircuit className="mr-1.5 size-3" />
                                MVP Intelligence
                            </Badge>
                            <CardTitle className="text-emerald-950 dark:text-emerald-50">
                                Next Best Action
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Lanjutkan alur dari input data sampai aksi selesai.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <Button
                                asChild
                                className="w-full bg-emerald-300 text-emerald-950 hover:bg-emerald-200"
                            >
                                <Link href="/dashboard/impact">
                                    Generate Recommendation
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-emerald-900/10 bg-white text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10"
                            >
                                <Link href="/dashboard/actions">Complete Actions</Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-emerald-900/10 bg-white text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10"
                            >
                                <Link href="/dashboard/challenges">Join Challenge</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                                Unlocked Badges
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Badge terbaru berdasarkan regenerative score.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {userBadges.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-emerald-50/40 p-6 text-center dark:border-white/10 dark:bg-white/[0.04]">
                                    <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                                        Belum ada badge.
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                                        Selesaikan action untuk membuka badge.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {userBadges.map((userBadge) => (
                                        <div
                                            key={userBadge.id}
                                            className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                                                    <BadgeCheck className="size-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                        {userBadge.badge.name}
                                                    </p>
                                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                                        {userBadge.badge.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                                Active Challenges
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Challenge yang sedang kamu ikuti.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {challengeParticipants.length === 0 ? (
                                <p className="text-sm text-muted-foreground dark:text-slate-400">
                                    Belum mengikuti challenge.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {challengeParticipants.map((participant) => {
                                        const progress = Math.min(
                                            Math.round(
                                                (participant.progressValue /
                                                    participant.challenge.targetValue) *
                                                100
                                            ),
                                            100
                                        );

                                        return (
                                            <div
                                                key={participant.id}
                                                className="rounded-2xl border border-emerald-900/10 bg-white p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                        {participant.challenge.name}
                                                    </p>
                                                    <Badge
                                                        variant="secondary"
                                                        className="dark:bg-white/10 dark:text-slate-200"
                                                    >
                                                        {participant.progressStatus}
                                                    </Badge>
                                                </div>

                                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                                                    <div
                                                        className="h-full rounded-full bg-emerald-950 transition-[width] duration-500 ease-out dark:bg-emerald-300"
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />
                                                </div>

                                                <p className="mt-2 text-xs text-muted-foreground dark:text-slate-400">
                                                    {progress}% completed
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </div>
    );
}
