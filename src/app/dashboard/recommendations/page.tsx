import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ArrowRight,
    BarChart3,
    Bot,
    CheckCircle2,
    Clock3,
    Flame,
    Leaf,
    Lightbulb,
    Recycle,
    Sparkles,
    Target,
    Zap,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function formatDate(value?: Date | null) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}

function formatDecimal(value: number) {
    return new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 1,
    }).format(value);
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

function getCategoryLabel(category: string) {
    const labels: Record<string, string> = {
        ENERGY: "Energi",
        WASTE: "Limbah",
        CIRCULAR: "Sirkular",
        COMMUNITY: "Komunitas",
        GENERAL: "Umum",
    };

    return labels[category] ?? category;
}

function getDifficultyLabel(difficulty: string) {
    const labels: Record<string, string> = {
        EASY: "Mudah",
        MEDIUM: "Sedang",
        HARD: "Sulit",
    };

    return labels[difficulty] ?? difficulty;
}

function getStatusLabel(status?: string | null) {
    const labels: Record<string, string> = {
        PLANNED: "Direncanakan",
        IN_PROGRESS: "Berjalan",
        COMPLETED: "Selesai",
        VERIFIED: "Terverifikasi",
        CANCELLED: "Dibatalkan",
    };

    if (!status) return "Belum dipilih";

    return labels[status] ?? status;
}

function getCategoryIcon(category: string) {
    if (category === "ENERGY") return Zap;
    if (category === "WASTE") return Recycle;
    if (category === "CIRCULAR") return Leaf;
    if (category === "COMMUNITY") return Target;

    return Sparkles;
}

function getConfidencePercent(value?: number | null) {
    if (!value) return 0;

    if (value <= 1) {
        return Math.round(value * 100);
    }

    return Math.round(value);
}

type RecommendationActionView = {
    id: string;
    name: string;
    category: string;
    difficultyLevel: string;
    description: string;
    baseImpactScore: number;
};

type RecommendationView = {
    id: string;
    actionId: string;
    confidenceScore: unknown;
    createdAt: Date;
    reason?: string | null;
    recommendationReason?: string | null;
    explanation?: string | null;
    action: RecommendationActionView;
};

type UserActionView = {
    id: string;
    actionId: string;
    status: string;
    impactEstimation?: {
        estimatedEnergySavedKwh?: unknown;
        estimatedWasteReducedKg?: unknown;
        estimatedCo2ReducedKg?: unknown;
        estimatedCostSaved?: unknown;
    } | null;
};

export default async function RecommendationsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        include: {
            aiRecommendations: {
                include: {
                    action: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            userActions: {
                include: {
                    action: true,
                    impactEstimation: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            regenerativeScore: true,
        },
    });

    if (!user) {
        redirect("/login");
    }

    const recommendations =
        user.aiRecommendations as unknown as RecommendationView[];
    const userActions = user.userActions as unknown as UserActionView[];

    const actionByActionId = new Map(
        userActions.map((item) => [item.actionId, item])
    );

    const completedCount = userActions.filter((item) =>
        ["COMPLETED", "VERIFIED"].includes(item.status)
    ).length;

    const plannedCount = userActions.filter((item) =>
        ["PLANNED", "IN_PROGRESS"].includes(item.status)
    ).length;

    const averageConfidence =
        recommendations.length > 0
            ? Math.round(
                recommendations.reduce((sum, item) => {
                    return sum + getConfidencePercent(Number(item.confidenceScore ?? 0));
                }, 0) / recommendations.length
            )
            : 0;

    return (
        <main className="min-h-screen space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.20),transparent_34%),linear-gradient(135deg,#06140f,#0a1f17_55%,#07130f)] p-5 text-white shadow-2xl shadow-emerald-950/20 md:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/8 px-3 py-1.5 text-xs font-medium text-emerald-100">
                            <Bot className="h-3.5 w-3.5" />
                            AI Recommendation System
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight md:text-4xl">
                            Rekomendasi AI
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/72">
                            Daftar aksi prioritas yang dihasilkan dari data energi, data
                            limbah, histori aksi, dan profil kontribusi pengguna.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                            asChild
                            variant="secondary"
                            className="bg-white text-emerald-950 hover:bg-emerald-50"
                        >
                            <Link href="/dashboard/impact">
                                Generate Rekomendasi
                                <Sparkles className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            className="border border-white/15 bg-emerald-500/20 text-white hover:bg-emerald-500/30"
                        >
                            <Link href="/dashboard/actions">
                                Lihat Aksi
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Total Rekomendasi
                            </p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                                {recommendations.length}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Hasil analisis AI
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Lightbulb className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Confidence Avg
                            </p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                                {averageConfidence}%
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Rata-rata keyakinan
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Target className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Aksi Aktif
                            </p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                                {plannedCount}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Direncanakan/berjalan
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Clock3 className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Aksi Selesai
                            </p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                                {completedCount}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Sudah berdampak
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section>
                {recommendations.length > 0 ? (
                    <div className="grid gap-4">
                        {recommendations.map((recommendation) => {
                            const action = recommendation.action;
                            const userAction = actionByActionId.get(recommendation.actionId);
                            const Icon = getCategoryIcon(action.category);
                            const confidence = getConfidencePercent(
                                Number(recommendation.confidenceScore ?? 0)
                            );

                            const impact = userAction?.impactEstimation;

                            return (
                                <Card
                                    key={recommendation.id}
                                    className="overflow-hidden border-emerald-950/10 bg-white/95 shadow-sm"
                                >
                                    <CardContent className="p-0">
                                        <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
                                            <div className="p-5 md:p-6">
                                                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                                        <Icon className="h-6 w-6" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                                {getCategoryLabel(action.category)}
                                                            </Badge>

                                                            <Badge
                                                                variant="outline"
                                                                className="border-slate-200 bg-white text-slate-700"
                                                            >
                                                                {getDifficultyLabel(action.difficultyLevel)}
                                                            </Badge>

                                                            <Badge
                                                                variant="outline"
                                                                className="border-emerald-200 bg-emerald-50 text-emerald-800"
                                                            >
                                                                {getStatusLabel(userAction?.status)}
                                                            </Badge>
                                                        </div>

                                                        <h2 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
                                                            {action.name}
                                                        </h2>

                                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                            {action.description}
                                                        </p>

                                                        <div className="mt-4 rounded-2xl border border-emerald-950/10 bg-emerald-50/70 p-4">
                                                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-900">
                                                                <Bot className="h-4 w-4" />
                                                                Alasan Rekomendasi
                                                            </div>

                                                            <p className="text-sm leading-6 text-emerald-950/75">
                                                                {recommendation.reason ??
                                                                    recommendation.recommendationReason ??
                                                                    recommendation.explanation ??
                                                                    "Sistem merekomendasikan aksi ini karena relevan dengan profil energi, limbah, dan histori kontribusi kamu."}
                                                            </p>
                                                        </div>

                                                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                            <span>
                                                                Dibuat: {formatDate(recommendation.createdAt)}
                                                            </span>
                                                            <span>•</span>
                                                            <span>Base score: {action.baseImpactScore} pts</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <aside className="border-t border-emerald-950/10 bg-slate-50/80 p-5 lg:border-l lg:border-t-0">
                                                <div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-medium text-slate-800">
                                                            Confidence
                                                        </span>
                                                        <span className="font-semibold text-emerald-700">
                                                            {confidence}%
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 h-2 rounded-full bg-slate-200">
                                                        <div
                                                            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
                                                            style={{
                                                                width: `${confidence}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-5 space-y-3">
                                                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                            <Zap className="h-3.5 w-3.5 text-emerald-700" />
                                                            Energi Dihemat
                                                        </div>
                                                        <p className="mt-1 font-semibold text-slate-950">
                                                            {formatDecimal(Number(impact?.estimatedEnergySavedKwh ?? 0))} kWh
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                            <Recycle className="h-3.5 w-3.5 text-emerald-700" />
                                                            Limbah Dikurangi
                                                        </div>
                                                        <p className="mt-1 font-semibold text-slate-950">
                                                            {formatDecimal(Number(impact?.estimatedWasteReducedKg ?? 0))} kg
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                            <Leaf className="h-3.5 w-3.5 text-emerald-700" />
                                                            CO₂ Dihindari
                                                        </div>
                                                        <p className="mt-1 font-semibold text-slate-950">
                                                            {formatDecimal(Number(impact?.estimatedCo2ReducedKg ?? 0))} kg
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                            <BarChart3 className="h-3.5 w-3.5 text-emerald-700" />
                                                            Biaya Dihemat
                                                        </div>
                                                        <p className="mt-1 font-semibold text-slate-950">
                                                            {formatCurrency(Number(impact?.estimatedCostSaved ?? 0))}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Button
                                                    asChild
                                                    className="mt-5 w-full bg-emerald-700 hover:bg-emerald-800"
                                                >
                                                    <Link href="/dashboard/actions">
                                                        Kelola Aksi
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </aside>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border-dashed border-emerald-300/70 bg-emerald-50/50 shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center px-6 py-14 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-emerald-700 shadow-sm">
                                <Bot className="h-8 w-8" />
                            </div>

                            <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
                                Belum ada rekomendasi AI
                            </h2>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                                Tambahkan catatan energi dan limbah, lalu generate rekomendasi
                                dari Pusat Dampak untuk mendapatkan aksi prioritas yang sesuai
                                dengan profil kamu.
                            </p>

                            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                                <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                                    <Link href="/dashboard/impact">
                                        Generate Rekomendasi
                                        <Sparkles className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>

                                <Button asChild variant="outline">
                                    <Link href="/dashboard/energy">Tambah Data Energi</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </section>
        </main>
    );
}