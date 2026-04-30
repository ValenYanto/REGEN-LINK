import Link from "next/link";
import {
    ArrowLeft,
    BadgeCheck,
    Building2,
    CalendarDays,
    Crown,
    Mail,
    ShieldCheck,
    Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { UserRoleSelect } from "@/components/admin/user-role-select";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function formatDate(value: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("id-ID").format(value);
}

function getRoleBadgeClass(role: string) {
    if (role === "ADMIN") {
        return "bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200";
    }

    if (role === "COMMUNITY_LEADER") {
        return "bg-lime-100 text-lime-800 hover:bg-lime-100 dark:bg-lime-300/15 dark:text-lime-200 dark:hover:bg-lime-300/15";
    }

    return "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10";
}

function getRoleLabel(role: string) {
    const labels: Record<string, string> = {
        USER: "User",
        COMMUNITY_LEADER: "Community Leader",
        ADMIN: "Admin",
    };

    return labels[role] ?? role;
}

export default async function AdminUsersPage() {
    const admin = await requireAdmin();

    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            city: true,
            regenerativeScore: true,
            userActions: {
                where: {
                    status: {
                        in: ["COMPLETED", "VERIFIED"],
                    },
                },
                select: {
                    id: true,
                },
            },
            userBadges: {
                select: {
                    id: true,
                },
            },
        },
    });

    const totalUsers = users.length;
    const adminCount = users.filter((user) => user.role === "ADMIN").length;
    const communityLeaderCount = users.filter(
        (user) => user.role === "COMMUNITY_LEADER"
    ).length;
    const regularUserCount = users.filter((user) => user.role === "USER").length;

    return (
        <main className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(135deg,#06140f,#0a1f17_52%,#07130f)] p-4 text-white shadow-2xl shadow-emerald-950/20 dark:border-white/10 sm:p-5 md:rounded-[2rem] md:p-7">
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
                            <span className="truncate">Admin Users & Roles</span>
                        </div>

                        <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                            Kelola User & Role
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/75">
                            Pantau seluruh user REGEN-LINK, lihat kontribusi mereka,
                            dan ubah role akses sesuai kebutuhan platform.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border-emerald-300/20 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
                                Admin: {admin.name}
                            </Badge>
                            <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                                {totalUsers} user
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:w-[300px]">
                        <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/65">
                            Admin Access
                        </p>
                        <p className="mt-2 text-3xl font-semibold">{adminCount}</p>
                        <p className="mt-1 text-xs leading-5 text-emerald-50/70">
                            User dengan role admin aktif.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminUserStatCard
                    label="Total Users"
                    value={formatNumber(totalUsers)}
                    caption="Semua akun"
                    icon={<Users className="size-5" />}
                />

                <AdminUserStatCard
                    label="Admin"
                    value={formatNumber(adminCount)}
                    caption="Full platform access"
                    icon={<Crown className="size-5" />}
                />

                <AdminUserStatCard
                    label="Community Leader"
                    value={formatNumber(communityLeaderCount)}
                    caption="Koordinator komunitas"
                    icon={<BadgeCheck className="size-5" />}
                />

                <AdminUserStatCard
                    label="Regular User"
                    value={formatNumber(regularUserCount)}
                    caption="User biasa"
                    icon={<Users className="size-5" />}
                />
            </section>

            <Card className="w-full min-w-0 overflow-hidden border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                    <CardTitle className="text-base text-emerald-950 dark:text-emerald-50 sm:text-lg">
                        User Directory
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                        Daftar semua user, city node, score, badge, completed action,
                        dan role.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    {users.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                                Belum ada user.
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                                User akan muncul setelah register atau seed dijalankan.
                            </p>
                        </div>
                    ) : (
                        <div className="min-w-0">
                            <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px_100px_100px_190px] border-b border-emerald-900/10 bg-emerald-50/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400 lg:grid">
                                <div>User</div>
                                <div>City</div>
                                <div className="text-right">Score</div>
                                <div className="text-right">Actions</div>
                                <div className="text-right">Badges</div>
                                <div>Role</div>
                            </div>

                            <div className="divide-y divide-emerald-900/10 dark:divide-white/10">
                                {users.map((user) => {
                                    const isCurrentAdmin = user.id === admin.id;

                                    return (
                                        <div
                                            key={user.id}
                                            className={
                                                isCurrentAdmin
                                                    ? "bg-emerald-50/70 px-4 py-4 transition-colors dark:bg-emerald-400/10"
                                                    : "bg-white px-4 py-4 transition-colors dark:bg-transparent dark:hover:bg-white/[0.04]"
                                            }
                                        >
                                            <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px_100px_100px_190px] lg:items-center">
                                                <div className="min-w-0">
                                                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                                                        <p className="max-w-[240px] truncate font-semibold text-emerald-950 dark:text-emerald-50">
                                                            {user.name}
                                                        </p>

                                                        {isCurrentAdmin ? (
                                                            <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                                                                You
                                                            </Badge>
                                                        ) : null}

                                                        <Badge className={getRoleBadgeClass(user.role)}>
                                                            {getRoleLabel(user.role)}
                                                        </Badge>
                                                    </div>

                                                    <div className="mt-1 flex min-w-0 flex-col gap-1 text-xs text-muted-foreground dark:text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                                                        <span className="inline-flex min-w-0 items-center gap-1.5">
                                                            <Mail className="size-3.5 shrink-0" />
                                                            <span className="truncate">
                                                                {user.email}
                                                            </span>
                                                        </span>

                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarDays className="size-3.5 shrink-0" />
                                                            {formatDate(user.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="min-w-0 text-sm text-muted-foreground dark:text-slate-400">
                                                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 ring-1 ring-emerald-900/10 dark:bg-white/[0.04] dark:ring-white/10 lg:block lg:bg-transparent lg:p-0 lg:ring-0">
                                                        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 lg:hidden">
                                                            City
                                                        </span>

                                                        <span className="inline-flex min-w-0 items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                                            <Building2 className="size-3.5 shrink-0 lg:hidden" />
                                                            <span className="truncate">
                                                                {user.city
                                                                    ? `${user.city.name}, ${user.city.province}`
                                                                    : "No City Node"}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <CompactUserMetric
                                                    label="Score"
                                                    value={formatNumber(
                                                        user.regenerativeScore?.totalScore ?? 0
                                                    )}
                                                />

                                                <CompactUserMetric
                                                    label="Actions"
                                                    value={formatNumber(user.userActions.length)}
                                                />

                                                <CompactUserMetric
                                                    label="Badges"
                                                    value={formatNumber(user.userBadges.length)}
                                                />

                                                <div className="min-w-0">
                                                    <UserRoleSelect
                                                        userId={user.id}
                                                        currentRole={user.role}
                                                        disabled={isCurrentAdmin && adminCount <= 1}
                                                    />

                                                    {isCurrentAdmin && adminCount <= 1 ? (
                                                        <p className="mt-2 text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                                            Admin terakhir tidak bisa diturunkan.
                                                        </p>
                                                    ) : null}
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
        </main>
    );
}

function AdminUserStatCard({
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

function CompactUserMetric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 ring-1 ring-emerald-900/10 dark:bg-white/[0.04] dark:ring-white/10 lg:block lg:bg-transparent lg:p-0 lg:text-right lg:ring-0">
            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 lg:hidden">
                {label}
            </span>
            <span className="font-semibold text-emerald-950 dark:text-emerald-50">
                {value}
            </span>
        </div>
    );
}