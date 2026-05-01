import { redirect } from "next/navigation";
import {
    Award,
    BadgeCheck,
    Crown,
    Flame,
    Leaf,
    Medal,
    Trophy,
    Users,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function getRankBadge(rank: number) {
    if (rank === 1) {
        return {
            label: "Champion",
            className:
                "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-300/15 dark:text-yellow-200 dark:hover:bg-yellow-300/15",
            icon: <Crown className="size-3.5" />,
        };
    }

    if (rank === 2) {
        return {
            label: "Runner Up",
            className:
                "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10",
            icon: <Medal className="size-3.5" />,
        };
    }

    if (rank === 3) {
        return {
            label: "Top 3",
            className:
                "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-300/15 dark:text-orange-200 dark:hover:bg-orange-300/15",
            icon: <Award className="size-3.5" />,
        };
    }

    return {
        label: `Rank ${rank}`,
        className:
            "bg-emerald-50 text-emerald-800 hover:bg-emerald-50 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10",
        icon: <Leaf className="size-3.5" />,
    };
}

export default async function LeaderboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUserId = session.user.id;

    const users = await prisma.user.findMany({
        include: {
            city: true,
            regenerativeScore: true,
            userActions: {
                where: {
                    status: {
                        in: ["COMPLETED", "VERIFIED"],
                    },
                },
            },
            userBadges: true,
        },
    });

    const rankedUsers = users
        .map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            city: user.city,
            score: user.regenerativeScore?.totalScore ?? 0,
            level: user.regenerativeScore?.level ?? "Perintis Aksi",
            completedActions: user.userActions.length,
            badgeCount: user.userBadges.length,
        }))
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.completedActions !== a.completedActions) {
                return b.completedActions - a.completedActions;
            }
            return b.badgeCount - a.badgeCount;
        })
        .map((user, index) => ({
            ...user,
            rank: index + 1,
        }));

    const currentUserRank = rankedUsers.find((user) => user.id === currentUserId);
    const topUser = rankedUsers[0];

    const totalParticipants = rankedUsers.length;
    const totalScore = rankedUsers.reduce((total, user) => total + user.score, 0);
    const totalCompletedActions = rankedUsers.reduce(
        (total, user) => total + user.completedActions,
        0
    );
    const totalBadges = rankedUsers.reduce(
        (total, user) => total + user.badgeCount,
        0
    );

    return (
        <div className="w-full min-w-0 space-y-5 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-5 md:rounded-[1.75rem] md:p-6">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-500/10" />

                <div className="relative grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-center">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 dark:shadow-none text-xs font-medium text-emerald-800 shadow-sm">
                            <Trophy className="mr-1.5 size-3.5" />
                            Cross-City Leaderboard
                        </div>

                        <h1 className="max-w-3xl break-words text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-3xl md:text-4xl">
                            Leaderboard
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Lihat peringkat kontributor REGEN-LINK berdasarkan regenerative
                            score, completed actions, badge, dan kontribusi kota.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                                {currentUserRank
                                    ? `Your Rank #${currentUserRank.rank}`
                                    : "No Rank"}
                            </Badge>
                            <Badge variant="secondary" className="dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                {currentUserRank?.level ?? "Perintis Aksi"}
                            </Badge>
                            <Badge variant="outline" className="dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                                {currentUserRank?.score ?? 0} pts
                            </Badge>
                        </div>
                    </div>

                    <div className="min-w-0 rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Current Champion
                        </p>
                        <p className="mt-2 truncate text-xl font-semibold text-emerald-950 dark:text-emerald-50 sm:text-2xl">
                            {topUser?.name ?? "No user"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {topUser
                                ? `${topUser.score} pts • ${topUser.city?.name ?? "No City"}`
                                : "Belum ada data leaderboard."}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardMetricCard
                    label="Participants"
                    value={totalParticipants.toString()}
                    caption="User dalam leaderboard"
                    icon={<Users className="size-5" />}
                />

                <DashboardMetricCard
                    label="Total Score"
                    value={totalScore.toLocaleString("id-ID")}
                    caption="Akumulasi regenerative score"
                    icon={<Leaf className="size-5" />}
                />

                <DashboardMetricCard
                    label="Completed Actions"
                    value={totalCompletedActions.toString()}
                    caption="Aksi selesai seluruh user"
                    icon={<Flame className="size-5" />}
                />

                <DashboardMetricCard
                    label="Badges Unlocked"
                    value={totalBadges.toString()}
                    caption="Badge terbuka seluruh user"
                    icon={<BadgeCheck className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
                <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                                <Trophy className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <CardTitle>User Ranking</CardTitle>
                                <CardDescription className="text-xs leading-5 sm:text-sm">
                                    Ranking berdasarkan score tertinggi, lalu jumlah action
                                    selesai dan badge.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {rankedUsers.length === 0 ? (
                            <div className="p-10 text-center">
                                <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                                    Belum ada user di leaderboard.
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                                    Data akan muncul setelah user memiliki regenerative score.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="hidden grid-cols-[72px_1.4fr_1fr_1fr_90px_90px_90px] border-b border-emerald-900/10 bg-emerald-50/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400 md:grid">
                                    <div>Rank</div>
                                    <div>User</div>
                                    <div>City</div>
                                    <div>Level</div>
                                    <div className="text-right">Score</div>
                                    <div className="text-right">Done</div>
                                    <div className="text-right">Badge</div>
                                </div>
                                <div className="divide-y divide-emerald-900/10 dark:divide-white/10">
                                    {rankedUsers.map((user) => {
                                        const rankBadge = getRankBadge(user.rank);
                                        const isCurrentUser = user.id === currentUserId;

                                        return (
                                            <div
                                                key={user.id}
                                                className={
                                                    isCurrentUser
                                                        ? "bg-emerald-50/70 px-4 py-4 dark:bg-emerald-400/10"
                                                        : "bg-white px-4 py-4 dark:bg-transparent dark:hover:bg-white/[0.04]"
                                                }
                                            >
                                                <div className="grid min-w-0 gap-3 md:grid-cols-[72px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_90px_90px_90px] md:items-center">
                                                    <div>
                                                        <div
                                                            className={
                                                                user.rank <= 3
                                                                    ? "inline-flex h-9 min-w-11 items-center justify-center rounded-xl bg-emerald-950 px-3 text-sm font-bold text-emerald-300 dark:bg-emerald-300 dark:text-emerald-950"
                                                                    : "inline-flex h-9 min-w-11 items-center justify-center rounded-xl bg-emerald-50 px-3 text-sm font-bold text-emerald-800 dark:bg-white/10 dark:text-emerald-200"
                                                            }
                                                        >
                                                            #{user.rank}
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                                                            <p className="max-w-[210px] truncate font-semibold text-emerald-950 dark:text-emerald-50 sm:max-w-[260px]">
                                                                {user.name}
                                                            </p>

                                                            {isCurrentUser ? (
                                                                <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                                                                    You
                                                                </Badge>
                                                            ) : null}

                                                            {user.rank <= 3 ? (
                                                                <Badge className={rankBadge.className}>
                                                                    <span className="mr-1">{rankBadge.icon}</span>
                                                                    {rankBadge.label}
                                                                </Badge>
                                                            ) : null}
                                                        </div>

                                                        <p className="mt-1 max-w-[260px] truncate text-xs text-muted-foreground dark:text-slate-400 md:hidden">
                                                            {user.city
                                                                ? `${user.city.name}, ${user.city.province}`
                                                                : "No City Node"}
                                                        </p>
                                                    </div>

                                                    <div className="hidden min-w-0 text-sm text-muted-foreground dark:text-slate-400 md:block">
                                                        <p className="truncate">
                                                            {user.city ? `${user.city.name}, ${user.city.province}` : "No City Node"}
                                                        </p>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <Badge
                                                            variant="secondary"
                                                            className="max-w-full border-emerald-900/10 bg-emerald-50 text-emerald-800 font-medium dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                                                        >
                                                            <span className="truncate">{user.level}</span>
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 dark:bg-white/[0.04] dark:ring-white/10 ring-1 ring-emerald-900/10 md:block md:bg-transparent md:p-0 md:text-right md:ring-0">
                                                        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 md:hidden">
                                                            Score
                                                        </span>
                                                        <span className="font-semibold text-emerald-950 dark:text-emerald-50">{user.score}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 dark:bg-white/[0.04] dark:ring-white/10 ring-1 ring-emerald-900/10 md:block md:bg-transparent md:p-0 md:text-right md:ring-0">
                                                        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 md:hidden">
                                                            Done
                                                        </span>
                                                        <span className="font-semibold text-emerald-950 dark:text-emerald-50">
                                                            {user.completedActions}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 dark:bg-white/[0.04] dark:ring-white/10 ring-1 ring-emerald-900/10 md:block md:bg-transparent md:p-0 md:text-right md:ring-0">
                                                        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 md:hidden">
                                                            Badge
                                                        </span>
                                                        <span className="font-semibold text-emerald-950 dark:text-emerald-50">{user.badgeCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <aside className="min-w-0 space-y-4">
                    <aside className="min-w-0 space-y-4">
                        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                                <Badge className="mb-3 w-fit border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                    <Crown className="mr-1.5 size-3" />
                                    Your Position
                                </Badge>

                                <CardTitle className="text-emerald-950 dark:text-emerald-50">
                                    {currentUserRank
                                        ? `Rank #${currentUserRank.rank}`
                                        : "No Rank Yet"}
                                </CardTitle>

                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                    Posisi kamu dihitung berdasarkan regenerative score.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-5">
                                <div className="rounded-3xl border border-emerald-900/10 bg-[#f7faf6] p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                                        Current Score
                                    </p>

                                    <p className="mt-3 break-words text-3xl font-semibold text-emerald-950 dark:text-emerald-50 sm:text-4xl">
                                        {currentUserRank?.score ?? 0}
                                    </p>

                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        {currentUserRank?.level ?? "Perintis Aksi"}
                                    </p>

                                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-[width] duration-500 ease-out dark:from-emerald-300 dark:to-lime-300"
                                            style={{
                                                width: `${Math.min(
                                                    ((currentUserRank?.score ?? 0) / 500) * 100,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                                <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                                    Leaderboard Rules
                                </CardTitle>

                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                    Cara sistem menentukan ranking user.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3 p-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                <div className="rounded-2xl border border-emerald-900/10 bg-[#f7faf6] p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                    <p>1. Score tertinggi mendapat ranking paling atas.</p>
                                </div>

                                <div className="rounded-2xl border border-emerald-900/10 bg-[#f7faf6] p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                    <p>2. Jika score sama, completed action menjadi pembeda.</p>
                                </div>

                                <div className="rounded-2xl border border-emerald-900/10 bg-[#f7faf6] p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                    <p>3. Jika masih sama, jumlah badge menjadi pembeda.</p>
                                </div>

                                <div className="rounded-2xl border border-emerald-900/10 bg-[#f7faf6] p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                    <p>4. Complete action dan challenge untuk menaikkan posisi.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                                <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                                    Top User
                                </CardTitle>

                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                    Kontributor dengan score tertinggi saat ini.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-5">
                                {!topUser ? (
                                    <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-emerald-50/40 p-5 text-center dark:border-white/10 dark:bg-white/[0.04]">
                                        <p className="text-sm text-muted-foreground dark:text-slate-400">
                                            Belum ada data.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                                                <Crown className="size-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="max-w-[190px] truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                    {topUser.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground dark:text-slate-400">
                                                    {topUser.city?.name ?? "No City Node"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <div className="rounded-2xl border border-emerald-900/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
                                                <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                    {topUser.score}
                                                </p>
                                                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
                                                    Score
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-emerald-900/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
                                                <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                                    {topUser.completedActions}
                                                </p>
                                                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
                                                    Actions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </aside>
                </aside>
            </section>
        </div >
    );
}
