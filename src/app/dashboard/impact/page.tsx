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

function formatNumber(value: number, maximumFractionDigits = 1) {
    return value.toLocaleString("id-ID", {
        maximumFractionDigits,
    });
}

function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        PLANNED: "Direncanakan",
        IN_PROGRESS: "Berjalan",
        COMPLETED: "Selesai",
        VERIFIED: "Terverifikasi",
        CANCELLED: "Dibatalkan",
    };

    return labels[status] ?? status;
}

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

    const score = regenerativeScore?.totalScore ?? 0;
    const level = regenerativeScore?.level ?? "Perintis Aksi";
    const progress = Math.min((score / 500) * 100, 100);

    return (
        <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm sm:p-5 md:rounded-[2rem] md:p-8">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl" />

                <div className="relative grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-end">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex max-w-full items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                            <BrainCircuit className="mr-1.5 size-3.5 shrink-0" />
                            <span className="truncate">AI Impact Intelligence</span>
                        </div>

                        <h1 className="max-w-3xl break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl md:text-5xl">
                            Pusat Dampak
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                            Ubah data energi dan limbah menjadi rekomendasi aksi, estimasi
                            dampak lingkungan, penghematan biaya, dan regenerative score.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="max-w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-950">
                                <span className="truncate">{level}</span>
                            </Badge>
                            <Badge variant="secondary">
                                {score.toLocaleString("id-ID")} pts
                            </Badge>
                            <Badge variant="outline">
                                Rule-Based AI MVP
                            </Badge>
                        </div>
                    </div>

                    <div className="min-w-0 rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                            Regenerative Score
                        </p>
                        <p className="mt-2 break-words text-3xl font-semibold text-emerald-950">
                            {score.toLocaleString("id-ID")}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-slate-500">
                            Level: {level}
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100">
                            <div
                                className="h-full rounded-full bg-emerald-950"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                            {Math.round(progress)}% menuju Juara Regeneratif.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardMetricCard
                    label="Energi Dihemat"
                    value={`${formatNumber(impactTotals.energySaved)} kWh`}
                    caption="Estimasi dari aksi"
                    icon={<Zap className="size-5" />}
                />

                <DashboardMetricCard
                    label="Limbah Dikurangi"
                    value={`${formatNumber(impactTotals.wasteReduced)} kg`}
                    caption="Estimasi dari aksi"
                    icon={<Recycle className="size-5" />}
                />

                <DashboardMetricCard
                    label="CO₂ Dihindari"
                    value={`${formatNumber(impactTotals.co2Reduced)} kg`}
                    caption="Estimasi emisi"
                    icon={<Leaf className="size-5" />}
                />

                <DashboardMetricCard
                    label="Biaya Dihemat"
                    value={`Rp${formatNumber(impactTotals.costSaved, 0)}`}
                    caption="Estimasi penghematan"
                    icon={<Coins className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <div className="min-w-0 space-y-6">
                    <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 sm:px-6">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                                    <Sparkles className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="text-base sm:text-lg">
                                        Generate Rekomendasi & Estimasi Dampak
                                    </CardTitle>
                                    <CardDescription className="text-xs leading-5 sm:text-sm">
                                        Sistem membaca record terbaru dan membuat aksi prioritas
                                        menggunakan rule-based AI recommendation.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="min-w-0 space-y-5 px-4 pt-5 pb-4 sm:px-6">
                            <div className="grid min-w-0 gap-4 md:grid-cols-2">
                                <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Data Energi Terbaru
                                    </p>
                                    <p className="mt-2 break-words text-2xl font-semibold text-emerald-950">
                                        {latestEnergyRecord
                                            ? `${latestEnergyRecord.monthlyKwh.toLocaleString(
                                                "id-ID"
                                            )} kWh`
                                            : "Belum ada data"}
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                        {latestEnergyRecord
                                            ? latestEnergyRecord.dominantDevices
                                            : "Isi catatan energi terlebih dahulu agar rekomendasi lebih akurat."}
                                    </p>
                                </div>

                                <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-lime-50/50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Data Limbah Terbaru
                                    </p>
                                    <p className="mt-2 break-words text-2xl font-semibold text-emerald-950">
                                        {latestWasteRecord
                                            ? `${latestWasteRecord.weightKg.toLocaleString(
                                                "id-ID"
                                            )} kg`
                                            : "Belum ada data"}
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                        {latestWasteRecord
                                            ? `${latestWasteRecord.wasteType} • ${latestWasteRecord.managementStatus}`
                                            : "Isi catatan limbah terlebih dahulu agar rekomendasi lebih relevan."}
                                    </p>
                                </div>
                            </div>

                            <ImpactGenerateButton />
                        </CardContent>
                    </Card>

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader className="px-4 py-4 sm:px-6">
                            <CardTitle className="text-base sm:text-lg">
                                Hasil Rekomendasi AI
                            </CardTitle>
                            <CardDescription className="text-xs leading-5 sm:text-sm">
                                Rekomendasi aksi terbaru yang dihasilkan dari data energi,
                                limbah, dan histori kontribusi pengguna.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-4 pb-4 sm:px-6">
                            {recommendations.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-emerald-50/40 p-6 text-center sm:p-8">
                                    <BrainCircuit className="mx-auto size-9 text-emerald-800" />
                                    <p className="mt-3 text-sm font-medium text-emerald-950">
                                        Belum ada rekomendasi.
                                    </p>
                                    <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                                        Klik tombol generate untuk membuat rekomendasi pertama.
                                        Pastikan data energi atau limbah sudah diisi agar hasilnya
                                        lebih relevan.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid min-w-0 gap-3">
                                    {recommendations.map((recommendation) => (
                                        <div
                                            key={recommendation.id}
                                            className="min-w-0 rounded-2xl border border-emerald-900/10 bg-white p-4"
                                        >
                                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-emerald-950">
                                                        {recommendation.action.name}
                                                    </p>
                                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                        {recommendation.recommendationReason}
                                                    </p>
                                                </div>

                                                <Badge className="w-fit shrink-0 bg-emerald-950 text-emerald-50 hover:bg-emerald-950">
                                                    {Math.round(
                                                        Number(recommendation.confidenceScore) * 100
                                                    )}
                                                    %
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <aside className="min-w-0 space-y-5">
                    <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-emerald-950 text-white shadow-sm">
                        <CardHeader>
                            <Badge className="mb-3 w-fit max-w-full bg-emerald-300/15 text-emerald-100 hover:bg-emerald-300/15">
                                <BadgeCheck className="mr-1.5 size-3 shrink-0" />
                                <span className="truncate">Status Dampak</span>
                            </Badge>
                            <CardTitle className="break-words text-white">
                                Progres Regeneratif
                            </CardTitle>
                            <CardDescription className="text-emerald-50/70">
                                Score utama bertambah saat aksi diselesaikan, bukan saat
                                rekomendasi dibuat.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/70">
                                    Level Saat Ini
                                </p>
                                <p className="mt-3 break-words text-3xl font-semibold">
                                    {level}
                                </p>
                                <p className="mt-2 text-sm text-emerald-50/70">
                                    Total score: {score.toLocaleString("id-ID")}
                                </p>

                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.65)]"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Aksi yang Dibuat</CardTitle>
                            <CardDescription>
                                Aksi yang berasal dari proses rekomendasi dan siap dijalankan.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {userActions.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-emerald-50/40 p-5 text-center">
                                    <p className="text-sm font-medium text-emerald-950">
                                        Belum ada aksi.
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        Generate rekomendasi untuk membuat daftar aksi pertama.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {userActions.map((userAction) => (
                                        <div
                                            key={userAction.id}
                                            className="min-w-0 rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4"
                                        >
                                            <div className="flex min-w-0 items-start justify-between gap-3">
                                                <p className="line-clamp-2 text-sm font-semibold text-emerald-950">
                                                    {userAction.action.name}
                                                </p>
                                                <Badge variant="secondary" className="shrink-0">
                                                    {getStatusLabel(userAction.status)}
                                                </Badge>
                                            </div>

                                            {userAction.impactEstimation ? (
                                                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                                    Estimasi{" "}
                                                    {formatNumber(
                                                        userAction.impactEstimation
                                                            .estimatedCo2ReducedKg
                                                    )}{" "}
                                                    kg CO₂ dapat dihindari.
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