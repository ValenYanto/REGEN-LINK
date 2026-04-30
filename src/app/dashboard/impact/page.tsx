import { redirect } from "next/navigation";
import {
    BadgeCheck,
    BrainCircuit,
    Coins,
    Leaf,
    Recycle,
    Sparkles,
    Zap,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { ImpactGenerateButton } from "@/components/dashboard/impact-generate-button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function ImpactPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;

    const [
        latestEnergyRecord,
        latestWasteRecord,
        regenerativeScore,
        recommendations,
        userActions,
    ] = await Promise.all([
        prisma.energyRecord.findFirst({
            where: { userId },
            orderBy: { recordDate: "desc" },
        }),
        prisma.wasteRecord.findFirst({
            where: { userId },
            orderBy: { recordDate: "desc" },
        }),
        prisma.regenerativeScore.findUnique({
            where: { userId },
        }),
        prisma.aiRecommendation.findMany({
            where: { userId },
            include: {
                action: true,
            },
            orderBy: {
                generatedAt: "desc",
            },
            take: 6,
        }),
        prisma.userAction.findMany({
            where: { userId },
            include: {
                action: true,
                impactEstimation: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 8,
        }),
    ]);

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

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-[#f7faf6] p-6 shadow-sm md:p-8">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl" />

                <div className="relative grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
                    <div>
                        <div className="mb-5 inline-flex items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                            <BrainCircuit className="mr-1.5 size-3.5" />
                            AI Impact Intelligence
                        </div>

                        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                            Impact Center
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                            Ubah data energi dan limbah menjadi rekomendasi aksi, estimasi
                            dampak lingkungan, penghematan biaya, dan regenerative score.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                            Regenerative Score
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
                    label="Energy Saved"
                    value={`${impactTotals.energySaved.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kWh`}
                    caption="Estimasi energi dihemat"
                    icon={<Zap className="size-5" />}
                />

                <DashboardMetricCard
                    label="Waste Reduced"
                    value={`${impactTotals.wasteReduced.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kg`}
                    caption="Estimasi limbah dikurangi"
                    icon={<Recycle className="size-5" />}
                />

                <DashboardMetricCard
                    label="CO₂ Avoided"
                    value={`${impactTotals.co2Reduced.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kg`}
                    caption="Estimasi emisi dihindari"
                    icon={<Leaf className="size-5" />}
                />

                <DashboardMetricCard
                    label="Cost Saved"
                    value={`Rp${impactTotals.costSaved.toLocaleString("id-ID", {
                        maximumFractionDigits: 0,
                    })}`}
                    caption="Estimasi biaya dihemat"
                    icon={<Coins className="size-5" />}
                />
            </section>

            <section className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    <Card className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                                    <Sparkles className="size-5" />
                                </div>
                                <div>
                                    <CardTitle>Generate Climate Intelligence</CardTitle>
                                    <CardDescription>
                                        Sistem akan membaca record terbaru dan menghasilkan
                                        rekomendasi aksi berbasis rule-based AI.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-5 pt-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Latest Energy
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-emerald-950">
                                        {latestEnergyRecord
                                            ? `${latestEnergyRecord.monthlyKwh.toLocaleString(
                                                "id-ID"
                                            )} kWh`
                                            : "No data"}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {latestEnergyRecord
                                            ? latestEnergyRecord.dominantDevices
                                            : "Isi energy record terlebih dahulu."}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-emerald-900/10 bg-lime-50/50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Latest Waste
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-emerald-950">
                                        {latestWasteRecord
                                            ? `${latestWasteRecord.weightKg.toLocaleString(
                                                "id-ID"
                                            )} kg`
                                            : "No data"}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {latestWasteRecord
                                            ? `${latestWasteRecord.wasteType} • ${latestWasteRecord.managementStatus}`
                                            : "Isi waste record terlebih dahulu."}
                                    </p>
                                </div>
                            </div>

                            <ImpactGenerateButton />
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle>AI Recommendation Results</CardTitle>
                            <CardDescription>
                                Rekomendasi aksi terbaru yang dihasilkan dari data pengguna.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {recommendations.length === 0 ? (
                                <div className="rounded-2xl border border-dashed bg-emerald-50/40 p-8 text-center">
                                    <p className="text-sm font-medium text-emerald-950">
                                        Belum ada rekomendasi.
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Klik generate untuk membuat rekomendasi pertama.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {recommendations.map((recommendation) => (
                                        <div
                                            key={recommendation.id}
                                            className="rounded-2xl border border-emerald-900/10 bg-white p-4"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-emerald-950">
                                                        {recommendation.action.name}
                                                    </p>
                                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                        {recommendation.recommendationReason}
                                                    </p>
                                                </div>

                                                <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950">
                                                    {Math.round(recommendation.confidenceScore * 100)}%
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <aside className="space-y-5">
                    <Card className="overflow-hidden border-emerald-900/10 bg-emerald-950 text-white shadow-sm">
                        <CardHeader>
                            <Badge className="mb-3 w-fit bg-emerald-300/15 text-emerald-100 hover:bg-emerald-300/15">
                                <BadgeCheck className="mr-1.5 size-3" />
                                Impact Status
                            </Badge>
                            <CardTitle className="text-white">Regenerative Progress</CardTitle>
                            <CardDescription className="text-emerald-50/70">
                                Score naik setiap sistem menghasilkan action dan estimasi dampak.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/70">
                                    Current Level
                                </p>
                                <p className="mt-3 text-3xl font-semibold">
                                    {regenerativeScore?.level ?? "Seed"}
                                </p>
                                <p className="mt-2 text-sm text-emerald-50/70">
                                    Total score: {regenerativeScore?.totalScore ?? 0}
                                </p>

                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.65)]"
                                        style={{
                                            width: `${Math.min(
                                                ((regenerativeScore?.totalScore ?? 0) / 500) * 100,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Generated Actions</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {userActions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada action yang dibuat.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {userActions.map((userAction) => (
                                        <div
                                            key={userAction.id}
                                            className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-emerald-950">
                                                    {userAction.action.name}
                                                </p>
                                                <Badge variant="secondary">{userAction.status}</Badge>
                                            </div>

                                            {userAction.impactEstimation ? (
                                                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                                    {userAction.impactEstimation.estimatedCo2ReducedKg.toLocaleString(
                                                        "id-ID"
                                                    )}{" "}
                                                    kg CO₂ avoided estimated.
                                                </p>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </div>
    );
}