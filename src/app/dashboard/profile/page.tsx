import Link from "next/link";
import { redirect } from "next/navigation";
import {
    Activity,
    Award,
    BadgeCheck,
    BarChart3,
    Bolt,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleUserRound,
    Flame,
    Leaf,
    MapPin,
    Recycle,
    ShieldCheck,
    Sparkles,
    Trophy,
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

function formatNumber(value: number) {
    return new Intl.NumberFormat("id-ID").format(value);
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

function formatDate(value?: Date | null) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}

function getNextMilestone(score: number) {
    if (score < 50) {
        return {
            label: "Pemula Hemat Energi",
            target: 50,
            remaining: 50 - score,
        };
    }

    if (score < 100) {
        return {
            label: "Pejuang Minim Sampah",
            target: 100,
            remaining: 100 - score,
        };
    }

    if (score < 150) {
        return {
            label: "Pembuat Dampak",
            target: 150,
            remaining: 150 - score,
        };
    }

    if (score < 250) {
        return {
            label: "Penggerak Komunitas",
            target: 250,
            remaining: 250 - score,
        };
    }

    if (score < 500) {
        return {
            label: "Juara Regeneratif",
            target: 500,
            remaining: 500 - score,
        };
    }

    return {
        label: "Level Maksimum MVP",
        target: 500,
        remaining: 0,
    };
}

function getScoreProgress(score: number) {
    const cappedScore = Math.min(score, 500);
    return Math.round((cappedScore / 500) * 100);
}

type UserBadgeView = {
    id: string;
    awardedAt: Date | null;
    badge: {
        name: string;
        description: string | null;
    };
};

type UserCommunityView = {
    id: string;
    community: {
        name: string;
    };
};

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
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
            },
            wasteRecords: {
                orderBy: {
                    recordDate: "desc",
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
            userBadges: {
                include: {
                    badge: true,
                },
                orderBy: {
                    earnedAt: "desc",
                },
            },
            communityMemberships: {
                include: {
                    community: true,
                },
            },
            challengeParticipants: {
                include: {
                    challenge: true,
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    const userBadges = user.userBadges as unknown as UserBadgeView[];
    const userCommunities =
        user.communityMemberships as unknown as UserCommunityView[];

    const totalScore = user.regenerativeScore?.totalScore ?? 0;
    const currentLevel = user.regenerativeScore?.level ?? "Perintis Aksi";
    const nextMilestone = getNextMilestone(totalScore);
    const scoreProgress = getScoreProgress(totalScore);

    const completedActions = user.userActions.filter((item) =>
        ["COMPLETED", "VERIFIED"].includes(item.status)
    );

    const activeActions = user.userActions.filter((item) =>
        ["PLANNED", "IN_PROGRESS"].includes(item.status)
    );

    const activeChallenges = user.challengeParticipants.filter((item) =>
        ["JOINED", "IN_PROGRESS"].includes(item.progressStatus)
    );

    const completedChallenges = user.challengeParticipants.filter(
        (item) => item.progressStatus === "COMPLETED"
    );

    const totalEnergyKwh = user.energyRecords.reduce(
        (sum, record) => sum + Number(record.monthlyKwh ?? 0),
        0
    );

    const totalWasteKg = user.wasteRecords.reduce(
        (sum, record) => sum + Number(record.weightKg ?? 0),
        0
    );

    const totalEnergySavedKwh = completedActions.reduce(
        (sum, item) =>
            sum + Number(item.impactEstimation?.estimatedEnergySavedKwh ?? 0),
        0
    );

    const totalWasteReducedKg = completedActions.reduce(
        (sum, item) =>
            sum + Number(item.impactEstimation?.estimatedWasteReducedKg ?? 0),
        0
    );

    const totalCo2ReducedKg = completedActions.reduce(
        (sum, item) =>
            sum + Number(item.impactEstimation?.estimatedCo2ReducedKg ?? 0),
        0
    );

    const totalCostSaved = completedActions.reduce(
        (sum, item) => sum + Number(item.impactEstimation?.estimatedCostSaved ?? 0),
        0
    );

    const latestEnergyRecord = user.energyRecords[0];
    const latestWasteRecord = user.wasteRecords[0];

    const profileStats = [
        {
            label: "Total Score",
            value: formatNumber(totalScore),
            icon: Trophy,
            helper: currentLevel,
        },
        {
            label: "Aksi Selesai",
            value: formatNumber(completedActions.length),
            icon: CheckCircle2,
            helper: `${activeActions.length} aksi aktif`,
        },
        {
            label: "Badge Terbuka",
            value: formatNumber(userBadges.length),
            icon: Award,
            helper: "Lencana kontribusi",
        },
        {
            label: "Tantangan Aktif",
            value: formatNumber(activeChallenges.length),
            icon: Flame,
            helper: `${completedChallenges.length} selesai`,
        },
    ];

    const impactStats = [
        {
            label: "Energi Dihemat",
            value: `${formatDecimal(totalEnergySavedKwh)} kWh`,
            icon: Bolt,
        },
        {
            label: "Limbah Dikurangi",
            value: `${formatDecimal(totalWasteReducedKg)} kg`,
            icon: Recycle,
        },
        {
            label: "CO₂ Dihindari",
            value: `${formatDecimal(totalCo2ReducedKg)} kg`,
            icon: Leaf,
        },
        {
            label: "Biaya Dihemat",
            value: formatCurrency(totalCostSaved),
            icon: BarChart3,
        },
    ];

    return (
        <main className="min-h-screen space-y-6">
            <section className="w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(135deg,#06140f,#0a1f17_52%,#07130f)] p-4 text-white shadow-2xl shadow-emerald-950/20 sm:p-5 md:rounded-[2rem] md:p-7">
                <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-center">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-emerald-300/25 bg-white/10 shadow-inner shadow-emerald-950/40 sm:h-24 sm:w-24">
                            <CircleUserRound className="h-10 w-10 text-emerald-100 sm:h-12 sm:w-12" />
                        </div>

                        <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <Badge className="border-emerald-300/20 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
                                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                                    Verified Climate Operator
                                </Badge>
                                <Badge className="border-lime-300/20 bg-lime-400/15 text-lime-100 hover:bg-lime-400/15">
                                    {user.role}
                                </Badge>
                            </div>

                            <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                                {user.name}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/72">
                                Profil kontribusi regeneratif untuk memantau aksi hemat energi,
                                pengurangan limbah, badge, tantangan, dan dampak lintas kota.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-3 text-xs text-emerald-50/70">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/7 px-3 py-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-emerald-200" />
                                    {user.city?.name ?? "City Node belum diatur"}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/7 px-3 py-1.5">
                                    <CalendarDays className="h-3.5 w-3.5 text-emerald-200" />
                                    Bergabung {formatDate(user.createdAt)}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/7 px-3 py-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                                    {currentLevel}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur lg:w-auto lg:min-w-[280px]">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/60">
                                    Regenerative Score
                                </p>
                                <p className="mt-2 text-4xl font-semibold">
                                    {formatNumber(totalScore)}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 px-3 py-2 text-right">
                                <p className="text-xs text-emerald-100/60">Progress</p>
                                <p className="text-lg font-semibold">{scoreProgress}%</p>
                            </div>
                        </div>

                        <div className="mt-4 h-2 rounded-full bg-white/10">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-emerald-300 via-lime-300 to-green-400"
                                style={{
                                    width: `${scoreProgress}%`,
                                }}
                            />
                        </div>

                        <p className="mt-3 text-xs leading-5 text-emerald-50/68">
                            {nextMilestone.remaining > 0
                                ? `${nextMilestone.remaining} poin lagi menuju ${nextMilestone.label}.`
                                : "Kamu sudah mencapai milestone tertinggi untuk MVP ini."}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {profileStats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={item.label}
                            className="border-emerald-950/10 bg-white/90 shadow-sm"
                        >
                            <CardContent className="flex min-w-0 items-center justify-between gap-3 p-5">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                                        {item.value}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {item.helper}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <Card className="border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Ringkasan Dampak Pengguna
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Akumulasi estimasi dampak dari aksi yang sudah diselesaikan.
                                </p>
                            </div>

                            <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                                <Link href="/dashboard/impact">
                                    Buka Pusat Dampak
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {impactStats.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-emerald-950/10 bg-gradient-to-br from-emerald-50 to-white p-4"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                {item.label}
                                            </p>
                                            <Icon className="h-4 w-4 text-emerald-700" />
                                        </div>
                                        <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                                            {item.value}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                    Catatan Energi
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-950">
                                    {formatNumber(user.energyRecords.length)} record
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Total tercatat {formatDecimal(totalEnergyKwh)} kWh.
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Terakhir: {formatDate(latestEnergyRecord?.recordDate)}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                    Catatan Limbah
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-950">
                                    {formatNumber(user.wasteRecords.length)} record
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Total tercatat {formatDecimal(totalWasteKg)} kg.
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Terakhir: {formatDate(latestWasteRecord?.recordDate)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">
                            Identitas Akun
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Informasi node pengguna dalam jaringan REGEN-LINK.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs text-muted-foreground">Nama Operator</p>
                            <p className="mt-1 break-words font-medium text-slate-950">{user.name}</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="mt-1 break-all font-medium text-slate-950">
                                {user.email}
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-xs text-muted-foreground">City Node</p>
                                <p className="mt-1 truncate font-medium text-slate-950">
                                    {user.city?.name ?? "-"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-xs text-muted-foreground">Role</p>
                                <p className="mt-1 truncate font-medium text-slate-950">{user.role}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-emerald-950/10 bg-emerald-50/70 p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-800">
                                Community Link
                            </p>

                            {userCommunities.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {userCommunities.map((item) => (
                                        <Badge
                                            key={item.id}
                                            variant="outline"
                                            className="max-w-full border-emerald-200 bg-white text-emerald-800"
                                        >
                                            <span className="truncate">{item.community.name}</span>
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-emerald-900/70">
                                    Belum terhubung ke komunitas. Fitur community join dapat
                                    dikembangkan setelah MVP demo.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <Card className="border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">
                            Badge Regeneratif
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Lencana yang terbuka berdasarkan kontribusi dan total score.
                        </p>
                    </CardHeader>

                    <CardContent>
                        {userBadges.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {userBadges.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-2xl border border-emerald-950/10 bg-gradient-to-br from-white to-emerald-50 p-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                                <BadgeCheck className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-slate-950">
                                                    {item.badge.name}
                                                </p>
                                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                                    {item.badge.description}
                                                </p>
                                                <p className="mt-2 text-[11px] text-emerald-700">
                                                    Dibuka {formatDate(item.awardedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center">
                                <Award className="mx-auto h-9 w-9 text-emerald-700" />
                                <p className="mt-3 font-medium text-slate-950">
                                    Belum ada badge terbuka
                                </p>
                                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                                    Selesaikan aksi pertama untuk mulai membuka badge kontribusi.
                                </p>
                                <Button
                                    asChild
                                    size="sm"
                                    className="mt-4 bg-emerald-700 hover:bg-emerald-800"
                                >
                                    <Link href="/dashboard/actions">Lihat Aksi</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">
                            Langkah Berikutnya
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Jalur cepat untuk melanjutkan kontribusi di REGEN-LINK.
                        </p>
                    </CardHeader>

                    <CardContent className="grid gap-3 md:grid-cols-2">
                        <Link
                            href="/dashboard/energy"
                            className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                                    <Bolt className="h-5 w-5" />
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                            </div>
                            <p className="mt-4 font-medium text-slate-950">
                                Tambah Catatan Energi
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Update konsumsi listrik bulanan dan perangkat dominan.
                            </p>
                        </Link>

                        <Link
                            href="/dashboard/waste"
                            className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                                    <Recycle className="h-5 w-5" />
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                            </div>
                            <p className="mt-4 font-medium text-slate-950">
                                Tambah Catatan Limbah
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Catat jenis limbah, berat, sumber, dan status pengelolaan.
                            </p>
                        </Link>

                        <Link
                            href="/dashboard/impact"
                            className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                            </div>
                            <p className="mt-4 font-medium text-slate-950">
                                Generate Dampak
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Dapatkan rekomendasi aksi dan estimasi dampak terbaru.
                            </p>
                        </Link>

                        <Link
                            href="/dashboard/actions"
                            className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                            </div>
                            <p className="mt-4 font-medium text-slate-950">
                                Lanjutkan Aksi
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Mulai atau selesaikan aksi untuk menaikkan score.
                            </p>
                        </Link>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}