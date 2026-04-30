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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChallengeEditDialog } from "@/components/admin/challenge-edit-dialog";
import { ChallengeDeleteDialog } from "@/components/admin/challenge-delete-dialog";

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
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    }

    if (type === "WASTE") {
        return "bg-lime-100 text-lime-800 hover:bg-lime-100";
    }

    if (type === "CIRCULAR") {
        return "bg-teal-100 text-teal-800 hover:bg-teal-100";
    }

    if (type === "CROSS_CITY") {
        return "bg-sky-100 text-sky-800 hover:bg-sky-100";
    }

    return "bg-amber-100 text-amber-800 hover:bg-amber-100";
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
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(135deg,#06140f,#0a1f17_52%,#07130f)] p-4 text-white shadow-2xl shadow-emerald-950/20 sm:p-5 md:rounded-[2rem] md:p-7">
                <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="mb-4 border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                        >
                            <Link href="/dashboard/admin">
                                <ArrowLeft className="mr-2 size-4" />
                                Kembali ke Admin
                            </Link>
                        </Button>

                        <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Admin Challenge Control</span>
                        </div>

                        <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                            Kelola Challenge
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/75">
                            Buat dan pantau challenge untuk mendorong aksi energi,
                            limbah, sirkular, komunitas, dan kompetisi lintas kota.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border-emerald-300/20 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
                                Admin: {admin.name}
                            </Badge>
                            <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                                {totalChallenges} challenge
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:w-[300px]">
                        <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/65">
                            Challenge Participants
                        </p>
                        <p className="mt-2 text-3xl font-semibold">
                            {formatNumber(totalParticipants)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-emerald-50/70">
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
                <Card className="w-full min-w-0 overflow-hidden border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 sm:px-6">
                        <CardTitle className="text-base sm:text-lg">
                            Challenge Directory
                        </CardTitle>
                        <CardDescription>
                            Daftar challenge beserta target, timeline, participant, dan
                            completion status.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        {challenges.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm font-medium text-emerald-950">
                                    Belum ada challenge.
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Tambahkan challenge pertama melalui form di samping.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-emerald-900/10">
                                {challenges.map((challenge) => {
                                    const participantCount =
                                        challenge.participants.length;
                                    const completedCount =
                                        challenge.participants.filter(
                                            (item) =>
                                                item.progressStatus === "COMPLETED"
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
                                            className="bg-white px-4 py-5 transition hover:bg-emerald-50/30 sm:px-5"
                                        >
                                            <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_220px] 2xl:items-start">
                                                <div className="min-w-0">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                                            <Trophy className="size-4" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                <div className="min-w-0">
                                                                    <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-emerald-950 sm:text-base">
                                                                        {challenge.name}
                                                                    </h3>
                                                                    <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-5 text-muted-foreground">
                                                                        {
                                                                            challenge.description
                                                                        }
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
                                                                    value={`${formatDate(
                                                                        challenge.startDate
                                                                    )}`}
                                                                    helper={`s/d ${formatDate(
                                                                        challenge.endDate
                                                                    )}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-slate-50/70 p-3">
                                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                                        <CalendarDays className="size-3.5" />
                                                        Status
                                                    </div>

                                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
                                                        <div
                                                            className="h-full rounded-full bg-emerald-950"
                                                            style={{
                                                                width: `${progressAverage}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                                        {completedCount} dari {participantCount} partisipasi selesai.
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {Object.entries(statusLabels).map(([status, label]) => {
                                                            const count = challenge.participants.filter(
                                                                (item) => item.progressStatus === status
                                                            ).length;

                                                            return (
                                                                <Badge key={status} variant="outline" className="bg-white">
                                                                    {label}: {count}
                                                                </Badge>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="mt-4 flex flex-col gap-2 border-t border-emerald-900/10 pt-3 sm:flex-row 2xl:flex-col">
                                                        <ChallengeEditDialog
                                                            challenge={{
                                                                id: challenge.id,
                                                                name: challenge.name,
                                                                description: challenge.description,
                                                                type: challenge.type,
                                                                targetValue: Number(challenge.targetValue),
                                                                startDate: challenge.startDate,
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

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Challenge Rules
                            </CardTitle>
                            <CardDescription>
                                Catatan penggunaan challenge dalam REGEN-LINK.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
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
                                4. Edit dan delete challenge akan ditambahkan pada phase
                                berikutnya dengan safety check.
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
        <Card className="w-full min-w-0 border-emerald-950/10 bg-white/95 shadow-sm">
            <CardContent className="flex min-w-0 items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950">
                        {value}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {caption}
                    </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
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
        <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-white px-3 py-3">
            <div className="flex items-center gap-1.5">
                {label === "Target" ? (
                    <Target className="size-3.5 text-emerald-700" />
                ) : null}
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                </p>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-emerald-950">
                {value}
            </p>
            {helper ? (
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {helper}
                </p>
            ) : null}
        </div>
    );
}