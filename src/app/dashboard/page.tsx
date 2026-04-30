import {
    Brain,
    CalendarClock,
    CheckCircle2,
    Flame,
    Leaf,
    LineChart,
    Medal,
    Recycle,
    Trophy,
    Zap,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function formatIdr(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}

function getScoreProgress(score: number) {
    if (score >= 1000) return 100;
    return Math.min((score / 1000) * 100, 100);
}

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        include: {
            city: true,
            regenerativeScore: true,
            energyRecords: {
                orderBy: {
                    recordDate: "desc",
                },
                take: 5,
            },
            wasteRecords: {
                orderBy: {
                    recordDate: "desc",
                },
                take: 5,
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    const totalEnergyKwh = user.energyRecords.reduce(
        (total, record) => total + record.monthlyKwh,
        0
    );

    const totalElectricityCost = user.energyRecords.reduce(
        (total, record) => total + record.electricityCost,
        0
    );

    const totalWasteKg = user.wasteRecords.reduce(
        (total, record) => total + record.weightKg,
        0
    );

    const score = user.regenerativeScore?.totalScore ?? 0;
    const level = user.regenerativeScore?.level ?? "Seed";
    const cityRank = user.regenerativeScore?.cityRank ?? null;

    const latestEnergy = user.energyRecords[0];
    const latestWaste = user.wasteRecords[0];

    return (
        <div className="space-y-6">
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <DashboardMetricCard
                    icon={<Trophy size={20} />}
                    label="Regenerative Score"
                    value={`${score}`}
                    caption={level}
                    trend="+4.1%"
                />

                <DashboardMetricCard
                    icon={<Zap size={20} />}
                    label="Energy Recorded"
                    value={`${totalEnergyKwh.toFixed(1)} kWh`}
                    caption={`${user.energyRecords.length} latest records`}
                />

                <DashboardMetricCard
                    icon={<Recycle size={20} />}
                    label="Waste Recorded"
                    value={`${totalWasteKg.toFixed(1)} kg`}
                    caption={`${user.wasteRecords.length} latest records`}
                />

                <DashboardMetricCard
                    icon={<Medal size={20} />}
                    label="City Rank"
                    value={cityRank ? `#${cityRank}` : "-"}
                    caption={user.city ? `${user.city.name} node` : "No city node"}
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="overflow-hidden rounded-2xl border-[#e4e7ec] bg-white shadow-none">
                    <CardContent className="p-0">
                        <div className="border-b border-[#e4e7ec] p-6">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                <div>
                                    <Badge className="mb-3 rounded-full bg-[#dff8ec] px-3 py-1 text-xs font-black text-[#00734f] hover:bg-[#dff8ec]">
                                        Real-Time Regen Telemetry
                                    </Badge>
                                    <h2 className="text-3xl font-black tracking-[-0.05em] text-[#101828]">
                                        Environmental Dashboard
                                    </h2>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
                                        Overview awal dari data energi, limbah, dan kontribusi
                                        regeneratif kamu. Modul input dan AI recommendation akan
                                        aktif di phase berikutnya.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] px-5 py-4">
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#667085]">
                                        Estimated Cost Input
                                    </p>
                                    <p className="mt-1 text-2xl font-black text-[#101828]">
                                        {formatIdr(totalElectricityCost)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-0 md:grid-cols-[0.85fr_1.15fr]">
                            <div className="border-b border-[#e4e7ec] p-6 md:border-b-0 md:border-r">
                                <div className="mb-6 flex items-center justify-between">
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#667085]">
                                        Score Progress
                                    </p>
                                    <Leaf size={20} className="text-[#00a66a]" />
                                </div>

                                <div className="flex items-end gap-2">
                                    <p className="text-6xl font-black tracking-[-0.06em] text-[#00a66a]">
                                        {score}
                                    </p>
                                    <p className="mb-3 text-sm font-black text-[#667085]">
                                        /1000
                                    </p>
                                </div>

                                <Progress
                                    value={getScoreProgress(score)}
                                    className="mt-6 h-2.5 bg-[#eef2f6] [&>div]:bg-[#06d69e]"
                                />

                                <div className="mt-5 flex items-center justify-between">
                                    <p className="text-sm font-black text-[#101828]">{level}</p>
                                    <p className="text-sm font-semibold text-[#667085]">
                                        Next: Green Mover
                                    </p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-black text-[#101828]">
                                            Latest Activity Snapshot
                                        </h3>
                                        <p className="mt-1 text-sm text-[#667085]">
                                            Data terakhir dari energy dan waste record.
                                        </p>
                                    </div>

                                    <LineChart size={22} className="text-[#00a66a]" />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <ActivitySnapshot
                                        icon={<Zap size={18} />}
                                        title="Latest Energy"
                                        value={
                                            latestEnergy
                                                ? `${latestEnergy.monthlyKwh} kWh`
                                                : "No data"
                                        }
                                        description={
                                            latestEnergy
                                                ? `${latestEnergy.housingType} • ${formatDate(
                                                    latestEnergy.recordDate
                                                )}`
                                                : "Energy module coming in Phase 5"
                                        }
                                    />

                                    <ActivitySnapshot
                                        icon={<Recycle size={18} />}
                                        title="Latest Waste"
                                        value={
                                            latestWaste
                                                ? `${latestWaste.weightKg} kg`
                                                : "No data"
                                        }
                                        description={
                                            latestWaste
                                                ? `${latestWaste.wasteType} • ${formatDate(
                                                    latestWaste.recordDate
                                                )}`
                                                : "Waste module coming in Phase 5"
                                        }
                                    />
                                </div>

                                <div className="mt-4 rounded-2xl border border-[#e4e7ec] bg-[#071a13] p-5 text-white">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00a66a]/20 text-[#06d69e]">
                                            <Brain size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black">AI Readiness</p>
                                            <p className="text-xs font-semibold text-slate-300">
                                                Recommendation engine will use your latest records.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                                            Rule-based AI
                                        </Badge>
                                        <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                                            Impact Estimation
                                        </Badge>
                                        <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                                            Phase 6
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card className="rounded-2xl border-[#e4e7ec] bg-white shadow-none">
                        <CardContent className="p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-[#101828]">
                                        Active Challenge
                                    </h2>
                                    <p className="mt-1 text-sm text-[#667085]">
                                        Preview challenge module.
                                    </p>
                                </div>
                                <Flame size={22} className="text-[#00a66a]" />
                            </div>

                            <div className="rounded-2xl border border-[#d9e1e5] bg-[#f8fbfa] p-5">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dff8ec] text-[#00734f]">
                                        <CalendarClock size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-[#101828]">
                                            7 Days Energy Saving
                                        </p>
                                        <p className="text-sm text-[#667085]">
                                            Challenge module unlocks in Phase 8.
                                        </p>
                                    </div>
                                </div>

                                <Progress
                                    value={35}
                                    className="h-2.5 bg-[#eef2f6] [&>div]:bg-[#06d69e]"
                                />

                                <p className="mt-3 text-sm font-semibold text-[#667085]">
                                    Demo progress: 35%
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-[#e4e7ec] bg-white shadow-none">
                        <CardContent className="p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-[#101828]">
                                        City Node Status
                                    </h2>
                                    <p className="mt-1 text-sm text-[#667085]">
                                        Cross-city collaboration preview.
                                    </p>
                                </div>
                                <Medal size={22} className="text-[#00a66a]" />
                            </div>

                            <div className="space-y-3">
                                <CityRank rank="#1" city="Bogor" score="18.450 pts" active />
                                <CityRank rank="#2" city="Bandung" score="16.920 pts" />
                                <CityRank rank="#3" city="Yogyakarta" score="15.380 pts" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <Card className="rounded-2xl border-[#e4e7ec] bg-white shadow-none">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-black text-[#101828]">
                            Latest Energy Records
                        </h2>

                        <div className="mt-5 space-y-3">
                            {user.energyRecords.length === 0 ? (
                                <EmptyState
                                    title="Belum ada data energi"
                                    description="Di Phase 5, kamu akan bisa menambahkan konsumsi listrik bulanan."
                                />
                            ) : (
                                user.energyRecords.map((record) => (
                                    <RecordRow
                                        key={record.id}
                                        icon={<Zap size={17} />}
                                        title={`${record.monthlyKwh} kWh`}
                                        description={`${formatIdr(record.electricityCost)} • ${record.housingType
                                            } • ${formatDate(record.recordDate)}`}
                                    />
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-[#e4e7ec] bg-white shadow-none">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-black text-[#101828]">
                            Latest Waste Records
                        </h2>

                        <div className="mt-5 space-y-3">
                            {user.wasteRecords.length === 0 ? (
                                <EmptyState
                                    title="Belum ada data limbah"
                                    description="Di Phase 5, kamu akan bisa mencatat food waste, plastik, dan sampah lain."
                                />
                            ) : (
                                user.wasteRecords.map((record) => (
                                    <RecordRow
                                        key={record.id}
                                        icon={<Recycle size={17} />}
                                        title={`${record.weightKg} kg • ${record.wasteType}`}
                                        description={`${record.wasteSource} • ${record.managementStatus
                                            } • ${formatDate(record.recordDate)}`}
                                    />
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}

function ActivitySnapshot({
    icon,
    title,
    value,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dff8ec] text-[#00734f]">
                {icon}
            </div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#667085]">
                {title}
            </p>
            <p className="mt-2 text-2xl font-black text-[#101828]">{value}</p>
            <p className="mt-1 text-sm leading-6 text-[#667085]">{description}</p>
        </div>
    );
}

function CityRank({
    rank,
    city,
    score,
    active = false,
}: {
    rank: string;
    city: string;
    score: string;
    active?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between rounded-xl border p-4 ${active
                ? "border-[#99e6c8] bg-[#ecfdf6]"
                : "border-[#e4e7ec] bg-[#f9fafb]"
                }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-black ${active
                        ? "bg-[#00734f] text-white"
                        : "bg-white text-[#667085]"
                        }`}
                >
                    {rank}
                </div>
                <div>
                    <p className="font-black text-[#101828]">{city}</p>
                    <p className="text-sm text-[#667085]">{score}</p>
                </div>
            </div>

            {active && (
                <Badge className="rounded-full bg-[#dff8ec] text-[#00734f] hover:bg-[#dff8ec]">
                    Active
                </Badge>
            )}
        </div>
    );
}

function RecordRow({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-[#e4e7ec] bg-[#f9fafb] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dff8ec] text-[#00734f]">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="font-black text-[#101828]">{title}</p>
                <p className="truncate text-sm text-[#667085]">{description}</p>
            </div>
        </div>
    );
}