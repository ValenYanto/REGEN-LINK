import { redirect } from "next/navigation";
import {
    Activity,
    CheckCircle2,
    Flame,
    Trophy,
    Users,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { ChallengeJoinButton } from "@/components/dashboard/challenge-join-button";
import { syncChallengeProgress } from "@/lib/impact/sync-challenge-progress";
import { getChallengeProgressLabel } from "@/lib/impact/challenge-progress";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const statusLabels: Record<string, string> = {
    JOINED: "Bergabung",
    IN_PROGRESS: "Berjalan",
    COMPLETED: "Selesai",
    DROPPED: "Ditinggalkan",
};

const statusClassNames: Record<string, string> = {
    JOINED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    IN_PROGRESS: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    COMPLETED: "bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200",
    DROPPED: "bg-red-100 text-red-700 hover:bg-red-100",
};

const typeLabels: Record<string, string> = {
    ENERGY: "Energi",
    WASTE: "Limbah",
    CIRCULAR: "Sirkular",
    CROSS_CITY: "Lintas Kota",
    COMMUNITY: "Komunitas",
};

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatNumber(value: number, maximumFractionDigits = 1) {
    return value.toLocaleString("id-ID", {
        maximumFractionDigits,
    });
}

export default async function ChallengesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;

    await syncChallengeProgress(userId);

    const [challenges, participants] = await Promise.all([
        prisma.challenge.findMany({
            orderBy: {
                startDate: "asc",
            },
        }),
        prisma.challengeParticipant.findMany({
            where: {
                userId,
            },
            include: {
                challenge: true,
            },
        }),
    ]);

    const joinedChallengeIds = new Set(
        participants.map((participant) => participant.challengeId)
    );

    const completedCount = participants.filter(
        (participant) => participant.progressStatus === "COMPLETED"
    ).length;

    const inProgressCount = participants.filter(
        (participant) => participant.progressStatus === "IN_PROGRESS"
    ).length;

    const totalProgress = participants.reduce(
        (total, participant) => total + participant.progressValue,
        0
    );

    const averageProgress =
        participants.length > 0
            ? Math.round(
                participants.reduce((total, participant) => {
                    const target = participant.challenge.targetValue || 1;
                    return (
                        total +
                        Math.min(
                            Math.round((participant.progressValue / target) * 100),
                            100
                        )
                    );
                }, 0) / participants.length
            )
            : 0;

    return (
        <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-5 md:rounded-[2rem] md:p-8">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />

                <div className="relative grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-end">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex max-w-full items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 dark:shadow-none text-xs font-medium text-emerald-800 shadow-sm">
                            <Trophy className="mr-1.5 size-3.5 shrink-0" />
                            <span className="truncate">Cross-City Climate Challenge</span>
                        </div>

                        <h1 className="max-w-3xl break-words text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-3xl md:text-5xl">
                            Pusat Tantangan
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 md:text-base">
                            Ikuti tantangan energi, limbah, dan aksi sirkular untuk
                            mengubah kontribusi individu menjadi gerakan kolektif lintas kota.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                                {participants.length} tantangan diikuti
                            </Badge>
                            <Badge variant="secondary" className="dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                {completedCount} selesai
                            </Badge>
                            <Badge variant="outline" className="dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                Auto progress sync
                            </Badge>
                        </div>
                    </div>

                    <div className="min-w-0 rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Tantangan Diikuti
                        </p>
                        <p className="mt-2 break-words text-3xl font-semibold text-emerald-950 dark:text-emerald-50">
                            {participants.length}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {completedCount} tantangan selesai.
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                            <div
                                className="h-full rounded-full bg-emerald-950 dark:bg-emerald-300"
                                style={{
                                    width: `${averageProgress}%`,
                                }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground dark:text-slate-400">
                            Rata-rata progress: {averageProgress}%.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardMetricCard
                    label="Tersedia"
                    value={challenges.length.toString()}
                    caption="Tantangan aktif"
                    icon={<Trophy className="size-5" />}
                />

                <DashboardMetricCard
                    label="Diikuti"
                    value={participants.length.toString()}
                    caption="Tantangan yang kamu ikuti"
                    icon={<Users className="size-5" />}
                />

                <DashboardMetricCard
                    label="Berjalan"
                    value={inProgressCount.toString()}
                    caption="Progress sedang aktif"
                    icon={<Activity className="size-5" />}
                />

                <DashboardMetricCard
                    label="Selesai"
                    value={completedCount.toString()}
                    caption="Tantangan selesai"
                    icon={<CheckCircle2 className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <div className="min-w-0 space-y-4">
                    {challenges.length === 0 ? (
                        <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                            <CardContent className="p-8 text-center sm:p-10">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-800">
                                    <Trophy className="size-6" />
                                </div>
                                <h2 className="mt-5 text-xl font-semibold text-emerald-950 dark:text-emerald-50">
                                    Belum ada tantangan.
                                </h2>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground dark:text-slate-400">
                                    Tantangan akan muncul setelah data seed atau admin
                                    menambahkan challenge baru.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        challenges.map((challenge) => {
                            const participant = participants.find(
                                (item) => item.challengeId === challenge.id
                            );

                            const isJoined = joinedChallengeIds.has(challenge.id);

                            const progressValue = participant?.progressValue ?? 0;
                            const progressPercentage = Math.min(
                                Math.round(
                                    (progressValue / Math.max(challenge.targetValue, 1)) * 100
                                ),
                                100
                            );

                            return (
                                <Card
                                    key={challenge.id}
                                    className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none"
                                >
                                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] px-4 py-4 sm:px-6">
                                        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex min-w-0 gap-3">
                                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                                                    <Trophy className="size-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                                                        <CardTitle className="line-clamp-2 text-base sm:text-lg">
                                                            {challenge.name}
                                                        </CardTitle>
                                                        <Badge variant="secondary" className="w-fit shrink-0 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                                            {typeLabels[challenge.type] ?? challenge.type}
                                                        </Badge>
                                                    </div>

                                                    <CardDescription className="mt-1 line-clamp-3 text-xs leading-5 sm:text-sm sm:leading-6">
                                                        {challenge.description}
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            {participant ? (
                                                <Badge
                                                    className={
                                                        (statusClassNames[
                                                            participant.progressStatus
                                                        ] ?? "bg-slate-100 text-slate-700") +
                                                        " w-fit shrink-0"
                                                    }
                                                >
                                                    {statusLabels[participant.progressStatus] ??
                                                        participant.progressStatus}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="w-fit shrink-0 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                                    Belum Bergabung
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="min-w-0 space-y-5 px-4 pt-5 pb-4 sm:px-6">
                                        <div className="grid min-w-0 gap-3 md:grid-cols-3">
                                            <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                                                    Timeline
                                                </p>
                                                <p className="mt-2 text-sm font-semibold leading-5 text-emerald-950 dark:text-emerald-50">
                                                    {formatDate(challenge.startDate)} —{" "}
                                                    {formatDate(challenge.endDate)}
                                                </p>
                                            </div>

                                            <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-lime-50/50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                                                    Target
                                                </p>
                                                <p className="mt-2 text-sm font-semibold leading-5 text-emerald-950 dark:text-emerald-50">
                                                    {challenge.targetValue.toLocaleString("id-ID")}{" "}
                                                    {getChallengeProgressLabel(challenge.type)}
                                                </p>
                                            </div>

                                            <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                                                    Progress Kamu
                                                </p>
                                                <p className="mt-2 text-sm font-semibold leading-5 text-emerald-950 dark:text-emerald-50">
                                                    {formatNumber(progressValue)}{" "}
                                                    {getChallengeProgressLabel(challenge.type)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="mb-2 flex items-center justify-between gap-3 text-xs text-muted-foreground dark:text-slate-400">
                                                <span>Progress</span>
                                                <span>{progressPercentage}%</span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-emerald-950 dark:bg-emerald-300 transition-all dark:bg-emerald-300"
                                                    style={{
                                                        width: `${progressPercentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="mt-2 text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                                Progress dihitung otomatis dari aksi selesai
                                                yang relevan dengan tipe challenge.
                                            </p>
                                        </div>

                                        <ChallengeJoinButton
                                            challengeId={challenge.id}
                                            isJoined={isJoined}
                                        />
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                <aside className="min-w-0 space-y-5">
                    <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-emerald-950 text-white shadow-sm">
                        <CardHeader>
                            <Badge className="mb-3 w-fit max-w-full bg-emerald-300/15 text-emerald-100 hover:bg-emerald-300/15">
                                <Flame className="mr-1.5 size-3 shrink-0" />
                                <span className="truncate">Progress Tantangan</span>
                            </Badge>
                            <CardTitle className="break-words text-white">
                                Aksi Kolektif
                            </CardTitle>
                            <CardDescription className="text-emerald-50/70">
                                Progress challenge dihitung dari aksi yang sudah kamu
                                selesaikan.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/70">
                                    Total Progress
                                </p>
                                <p className="mt-3 break-words text-4xl font-semibold">
                                    {formatNumber(totalProgress)}
                                </p>
                                <p className="mt-2 text-sm text-emerald-50/70">
                                    Akumulasi progress dari semua challenge yang diikuti.
                                </p>

                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.65)]"
                                        style={{
                                            width: `${averageProgress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base">Auto Progress Sync</CardTitle>
                            <CardDescription>
                                Progress diperbarui otomatis saat halaman dibuka.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                            <p>
                                Sistem membaca aksi yang sudah selesai, mengambil estimasi
                                dampaknya, lalu menghitung progress challenge tanpa tombol
                                refresh manual.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base">Cara Kerja</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                            <p>1. Gabung ke challenge yang ingin kamu ikuti.</p>
                            <p>2. Generate rekomendasi di Pusat Dampak.</p>
                            <p>3. Selesaikan aksi di Pusat Aksi.</p>
                            <p>4. Progress challenge dihitung ulang otomatis.</p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </div>
    );
}
