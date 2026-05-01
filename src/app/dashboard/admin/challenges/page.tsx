import Link from "next/link";
import {
    ArrowLeft,
    Activity,
    CalendarDays,
    CheckCircle2,
    ShieldCheck,
    Target,
    Trophy,
    Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { ChallengeCreateForm } from "@/components/admin/challenge-create-form";
import { ChallengeEditDialog } from "@/components/admin/challenge-edit-dialog";
import { ChallengeDeleteDialog } from "@/components/admin/challenge-delete-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const typeLabels: Record<string, string> = {
    ENERGY: "Energi",
    WASTE: "Limbah",
    CIRCULAR: "Sirkular",
    CROSS_CITY: "Lintas Kota",
    COMMUNITY: "Komunitas",
};

const statusLabels: Record<string, string> = {
    JOINED: "Bergabung",
    IN_PROGRESS: "Berjalan",
    COMPLETED: "Selesai",
    DROPPED: "Ditinggalkan",
};

function formatNumber(value: number) {
    return new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 1,
    }).format(value);
}

function formatDate(value: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}

function getTypeClass(type: string) {
    if (type === "ENERGY") {
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-300/15 dark:text-emerald-200 dark:hover:bg-emerald-300/15";
    }

    if (type === "WASTE") {
        return "bg-lime-100 text-lime-800 hover:bg-lime-100 dark:bg-lime-300/15 dark:text-lime-200 dark:hover:bg-lime-300/15";
    }

    if (type === "CIRCULAR") {
        return "bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-300/15 dark:text-teal-200 dark:hover:bg-teal-300/15";
    }

    if (type === "CROSS_CITY") {
        return "bg-sky-100 text-sky-800 hover:bg-sky-100 dark:bg-sky-300/15 dark:text-sky-200 dark:hover:bg-sky-300/15";
    }

    return "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-300/15 dark:text-amber-200 dark:hover:bg-amber-300/15";
}

function getChallengeUnit(type: string) {
    if (type === "ENERGY") return "kWh";
    if (type === "WASTE") return "kg";
    if (type === "CIRCULAR") return "kg";
    if (type === "CROSS_CITY") return "pts";
    if (type === "COMMUNITY") return "aksi";

    return "unit";
}

export default async function AdminChallengesPage() {
    const admin = await requireAdmin();

    const challenges = await prisma.challenge.findMany({
        orderBy: [
            {
                startDate: "desc",
            },
            {
                name: "asc",
            },
        ],
        include: {
            participants: {
                select: {
                    id: true,
                    progressStatus: true,
                    progressValue: true,
                },
            },
        },
    });

    const totalChallenges = challenges.length;
    const totalParticipants = challenges.reduce(
        (sum, challenge) => sum + challenge.participants.length,
        0
    );

    const completedParticipants = challenges.reduce((sum, challenge) => {
        return (
            sum +
            challenge.participants.filter(
                (item) => item.progressStatus === "COMPLETED"
            ).length
        );
    }, 0);

    const activeChallenges = challenges.filter((challenge) => {
        const now = new Date();
        return challenge.startDate <= now && challenge.endDate >= now;
    }).length;

    return (
        <main className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-5 md:rounded-[2rem] md:p-7">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />

                <div className="relative flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="mb-4 border-emerald-900/10 bg-white text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                        >
                            <Link href="/dashboard/admin">
                                <ArrowLeft className="mr-2 size-4" />
                                Kembali ke Admin
                            </Link>
                        </Button>

                        <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm transition-colors dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 dark:shadow-none">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Admin Challenge Control</span>
                        </div>

                        <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-3xl md:text-4xl">
                            Kelola Challenge
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Buat dan pantau challenge untuk mendorong aksi energi,
                            limbah, sirkular, komunitas, dan kompetisi lintas kota.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                Admin: {admin.name}
                            </Badge>
                            <Badge className="border-emerald-900/10 bg-white text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10">
                                {totalChallenges} challenge
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur transition-colors dark:border-white/10 dark:bg-white/[0.07] dark:shadow-none lg:w-[320px]">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Challenge Participants
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-emerald-50">
                            {formatNumber(totalParticipants)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Total partisipasi pada semua challenge.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminChallengeStatCard
                    label="Total Challenge"
                    value={formatNumber(totalChallenges)}
                    caption="Challenge tersedia"
                    icon={<Trophy className="size-5" />}
                />
                <AdminChallengeStatCard
                    label="Active Challenge"
                    value={formatNumber(activeChallenges)}
                    caption="Sedang berjalan"
                    icon={<Activity className="size-5" />}
                />
                <AdminChallengeStatCard
                    label="Participants"
                    value={formatNumber(totalParticipants)}
                    caption="Total partisipasi"
                    icon={<Users className="size-5" />}
                />
                <AdminChallengeStatCard
                    label="Completed"
                    value={formatNumber(completedParticipants)}
                    caption="Partisipasi selesai"
                    icon={<CheckCircle2 className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
                <Card className="w-full min-w-0 overflow-hidden border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                        <CardTitle className="text-base text-emerald-950 dark:text-emerald-50 sm:text-lg">
                            Challenge Directory
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                            Daftar challenge beserta target, timeline, participant, dan
                            completion status.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        {challenges.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                                    Belum ada challenge.
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                                    Tambahkan challenge pertama melalui form di samping.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-emerald-900/10 dark:divide-white/10">
                                {challenges.map((challenge) => {
                                    const participantCount =
                                        challenge.participants.length;
                                    const completedCount =
                                        challenge.participants.filter(
                                            (item) => item.progressStatus === "COMPLETED"
                                        ).length;

                                    const progressAverage =
                                        participantCount > 0
                                            ? Math.round(
                                                challenge.participants.reduce(
                                                    (sum, participant) =>
                                                        sum +
                                                        Math.min(
                                                            Math.round(
                                                                (participant.progressValue /
                                                                    Math.max(
                                                                        challenge.targetValue,
                                                                        1
                                                                    )) *
                                                                100
                                                            ),
                                                            100
                                                        ),
                                                    0
                                                ) / participantCount
                                            )
                                            : 0;

                                    return (
                                        <article
                                            key={challenge.id}
                                            className="bg-white px-4 py-5 transition hover:bg-emerald-50/30 dark:bg-transparent dark:hover:bg-white/[0.04] sm:px-5"
                                        >
                                            <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_220px] 2xl:items-start">
                                                <div className="min-w-0">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors dark:bg-emerald-400/10 dark:text-emerald-300">
                                                            <Trophy className="size-4" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                <div className="min-w-0">
                                                                    <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-emerald-950 dark:text-emerald-50 sm:text-base">
                                                                        {challenge.name}
                                                                    </h3>
                                                                    <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                                                        {challenge.description}
                                                                    </p>
                                                                </div>

                                                                <Badge
                                                                    className={getTypeClass(
                                                                        challenge.type
                                                                    )}
                                                                >
                                                                    {typeLabels[
                                                                        challenge.type
                                                                    ] ?? challenge.type}
                                                                </Badge>
                                                            </div>

                                                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                                                <ChallengeInfoBox
                                                                    label="Target"
                                                                    value={`${formatNumber(
                                                                        challenge.targetValue
                                                                    )} ${getChallengeUnit(
                                                                        challenge.type
                                                                    )}`}
                                                                    icon="target"
                                                                />
                                                                <ChallengeInfoBox
                                                                    label="Participants"
                                                                    value={formatNumber(
                                                                        participantCount
                                                                    )}
                                                                    helper={`${formatNumber(
                                                                        completedCount
                                                                    )} selesai`}
                                                                />
                                                                <ChallengeInfoBox
                                                                    label="Avg Progress"
                                                                    value={`${formatNumber(
                                                                        progressAverage
                                                                    )}%`}
                                                                />
                                                                <ChallengeInfoBox
                                                                    label="Timeline"
                                                                    value={formatDate(
                                                                        challenge.startDate
                                                                    )}
                                                                    helper={`s/d ${formatDate(
                                                                        challenge.endDate
                                                                    )}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-slate-50/70 p-3 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
                                                        <CalendarDays className="size-3.5" />
                                                        Status
                                                    </div>

                                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                                                        <div
                                                            className="h-full rounded-full bg-emerald-950 transition-[width] duration-500 ease-out dark:bg-emerald-300"
                                                            style={{
                                                                width: `${progressAverage}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <p className="mt-2 text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                                        {completedCount} dari {participantCount} partisipasi selesai.
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {Object.entries(statusLabels).map(
                                                            ([status, label]) => {
                                                                const count =
                                                                    challenge.participants.filter(
                                                                        (item) =>
                                                                            item.progressStatus ===
                                                                            status
                                                                    ).length;

                                                                return (
                                                                    <Badge
                                                                        key={status}
                                                                        variant="outline"
                                                                        className="border-emerald-900/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300"
                                                                    >
                                                                        {label}: {count}
                                                                    </Badge>
                                                                );
                                                            }
                                                        )}
                                                    </div>

                                                    <div className="mt-4 flex flex-col gap-2 border-t border-emerald-900/10 pt-3 dark:border-white/10 sm:flex-row 2xl:flex-col">
                                                        <ChallengeEditDialog
                                                            challenge={{
                                                                id: challenge.id,
                                                                name: challenge.name,
                                                                description:
                                                                    challenge.description,
                                                                type: challenge.type,
                                                                targetValue: Number(
                                                                    challenge.targetValue
                                                                ),
                                                                startDate:
                                                                    challenge.startDate,
                                                                endDate: challenge.endDate,
                                                            }}
                                                        />

                                                        <ChallengeDeleteDialog
                                                            challenge={{
                                                                id: challenge.id,
                                                                name: challenge.name,
                                                                participantCount,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <aside className="min-w-0 space-y-5">
                    <ChallengeCreateForm />

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                            <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                                Challenge Rules
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Catatan penggunaan challenge dalam REGEN-LINK.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-5 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                            <p>
                                1. Nama challenge harus unik agar participant tidak
                                membingungkan.
                            </p>
                            <p>
                                2. Type challenge menentukan progress dihitung dari impact
                                energi, limbah, sirkular, komunitas, atau lintas kota.
                            </p>
                            <p>
                                3. Target value menentukan batas progress sampai 100%.
                            </p>
                            <p>
                                4. Challenge yang sudah punya participant tidak bisa dihapus
                                agar histori progress user tetap aman.
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </main>
    );
}

function AdminChallengeStatCard({
    label,
    value,
    caption,
    icon,
}: {
    label: string;
    value: string;
    caption: string;
    icon: React.ReactNode;
}) {
    return (
        <Card className="w-full min-w-0 border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardContent className="flex min-w-0 items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                        {label}
                    </p>
                    <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50">
                        {value}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground dark:text-slate-400">
                        {caption}
                    </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors dark:bg-emerald-400/10 dark:text-emerald-300">
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}

function ChallengeInfoBox({
    label,
    value,
    helper,
}: {
    label: string;
    value: string;
    helper?: string;
    icon?: string;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-white px-3 py-3 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center gap-1.5">
                {label === "Target" ? (
                    <Target className="size-3.5 text-emerald-700 dark:text-emerald-300" />
                ) : null}
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
                    {label}
                </p>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                {value}
            </p>
            {helper ? (
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground dark:text-slate-400">
                    {helper}
                </p>
            ) : null}
        </div>
    );
}
