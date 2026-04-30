import { redirect } from "next/navigation";
import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Flame,
    Leaf,
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
    JOINED: "Joined",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    DROPPED: "Dropped",
};

const statusClassNames: Record<string, string> = {
    JOINED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    IN_PROGRESS: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    COMPLETED: "bg-emerald-950 text-emerald-50 hover:bg-emerald-950",
    DROPPED: "bg-red-100 text-red-700 hover:bg-red-100",
};

const typeLabels: Record<string, string> = {
    ENERGY: "Energy",
    WASTE: "Waste",
    CIRCULAR: "Circular",
    CROSS_CITY: "Cross-City",
    COMMUNITY: "Community",
};

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
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

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-[#f7faf6] p-6 shadow-sm md:p-8">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl" />

                <div className="relative grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
                    <div>
                        <div className="mb-5 inline-flex items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                            <Trophy className="mr-1.5 size-3.5" />
                            Cross-City Climate Challenge
                        </div>

                        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                            Challenges Center
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                            Ikuti tantangan energi, limbah, dan circular action untuk
                            mengubah aksi individu menjadi kontribusi kolektif lintas kota.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                            Joined Challenges
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-emerald-950">
                            {participants.length}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            {completedCount} challenge selesai.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                <DashboardMetricCard
                    label="Available"
                    value={challenges.length.toString()}
                    caption="Challenge tersedia"
                    icon={<Trophy className="size-5" />}
                />

                <DashboardMetricCard
                    label="Joined"
                    value={participants.length.toString()}
                    caption="Challenge diikuti"
                    icon={<Users className="size-5" />}
                />

                <DashboardMetricCard
                    label="In Progress"
                    value={inProgressCount.toString()}
                    caption="Challenge berjalan"
                    icon={<Activity className="size-5" />}
                />

                <DashboardMetricCard
                    label="Completed"
                    value={completedCount.toString()}
                    caption="Challenge selesai"
                    icon={<CheckCircle2 className="size-5" />}
                />
            </section>

            <section className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                    {challenges.map((challenge) => {
                        const participant = participants.find(
                            (item) => item.challengeId === challenge.id
                        );

                        const isJoined = joinedChallengeIds.has(challenge.id);

                        const progressValue = participant?.progressValue ?? 0;
                        const progressPercentage = Math.min(
                            Math.round((progressValue / challenge.targetValue) * 100),
                            100
                        );

                        return (
                            <Card
                                key={challenge.id}
                                className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm"
                            >
                                <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                                                <Trophy className="size-5" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <CardTitle className="text-lg">
                                                        {challenge.name}
                                                    </CardTitle>
                                                    <Badge variant="secondary">
                                                        {typeLabels[challenge.type] ?? challenge.type}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="mt-1 max-w-2xl leading-6">
                                                    {challenge.description}
                                                </CardDescription>
                                            </div>
                                        </div>

                                        {participant ? (
                                            <Badge
                                                className={
                                                    statusClassNames[participant.progressStatus] ??
                                                    "bg-slate-100 text-slate-700"
                                                }
                                            >
                                                {statusLabels[participant.progressStatus] ??
                                                    participant.progressStatus}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">Not Joined</Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-5 pt-5">
                                    <div className="grid gap-3 md:grid-cols-3">
                                        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4">
                                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                Timeline
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-950">
                                                {formatDate(challenge.startDate)} —{" "}
                                                {formatDate(challenge.endDate)}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-emerald-900/10 bg-lime-50/50 p-4">
                                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                Target
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-950">
                                                {challenge.targetValue.toLocaleString("id-ID")}{" "}
                                                {getChallengeProgressLabel(challenge.type)}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                Your Progress
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-950">
                                                {progressValue.toLocaleString("id-ID", {
                                                    maximumFractionDigits: 1,
                                                })}{" "}
                                                {getChallengeProgressLabel(challenge.type)}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Progress</span>
                                            <span>{progressPercentage}%</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                                            <div
                                                className="h-full rounded-full bg-emerald-950 transition-all"
                                                style={{
                                                    width: `${progressPercentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <ChallengeJoinButton
                                        challengeId={challenge.id}
                                        isJoined={isJoined}
                                    />
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <aside className="space-y-5">
                    <Card className="overflow-hidden border-emerald-900/10 bg-emerald-950 text-white shadow-sm">
                        <CardHeader>
                            <Badge className="mb-3 w-fit bg-emerald-300/15 text-emerald-100 hover:bg-emerald-300/15">
                                <Flame className="mr-1.5 size-3" />
                                Challenge Progress
                            </Badge>
                            <CardTitle className="text-white">Collective Action</CardTitle>
                            <CardDescription className="text-emerald-50/70">
                                Progress challenge dihitung dari action yang sudah kamu
                                selesaikan.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/70">
                                    Total Progress
                                </p>
                                <p className="mt-3 text-4xl font-semibold">
                                    {totalProgress.toLocaleString("id-ID", {
                                        maximumFractionDigits: 1,
                                    })}
                                </p>
                                <p className="mt-2 text-sm text-emerald-50/70">
                                    Akumulasi progress dari semua challenge yang diikuti.
                                </p>

                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div className="h-full w-[68%] rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.65)]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Auto Progress Sync</CardTitle>
                            <CardDescription>
                                Progress challenge otomatis diperbarui setiap kamu membuka halaman ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                            <p>
                                Sistem membaca action yang sudah selesai, mengambil estimasi dampaknya,
                                lalu menghitung progress challenge secara otomatis.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">How it works</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                            <p>1. Join challenge yang ingin kamu ikuti.</p>
                            <p>2. Generate recommendation di Impact Center.</p>
                            <p>3. Selesaikan action di Actions Center.</p>
                            <p>4. Saat halaman ini dibuka, progress otomatis dihitung ulang.</p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </div>
    );
}