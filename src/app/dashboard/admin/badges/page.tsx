import Link from "next/link";
import {
    ArrowLeft,
    Award,
    BadgeCheck,
    BarChart3,
    Medal,
    ShieldCheck,
    Sparkles,
    Trophy,
    Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { BadgeCreateForm } from "@/components/admin/badge-create-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BadgeEditDialog } from "@/components/admin/badge-edit-dialog";
import { BadgeDeleteDialog } from "@/components/admin/badge-delete-dialog";

const categoryLabels: Record<string, string> = {
    ENERGY: "Energi",
    WASTE: "Limbah",
    CIRCULAR: "Sirkular",
    IMPACT: "Dampak",
    COMMUNITY: "Komunitas",
    STREAK: "Streak",
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

function getCategoryClass(category: string) {
    if (category === "ENERGY") {
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    }

    if (category === "WASTE") {
        return "bg-lime-100 text-lime-800 hover:bg-lime-100";
    }

    if (category === "CIRCULAR") {
        return "bg-teal-100 text-teal-800 hover:bg-teal-100";
    }

    if (category === "IMPACT") {
        return "bg-sky-100 text-sky-800 hover:bg-sky-100";
    }

    if (category === "COMMUNITY") {
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    }

    return "bg-violet-100 text-violet-800 hover:bg-violet-100";
}

export default async function AdminBadgesPage() {
    const admin = await requireAdmin();

    const badges = await prisma.badge.findMany({
        orderBy: [
            {
                requiredScore: "asc",
            },
            {
                name: "asc",
            },
        ],
        include: {
            userBadges: {
                select: {
                    id: true,
                    earnedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            city: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const totalBadges = badges.length;
    const totalUnlocked = badges.reduce(
        (sum, badge) => sum + badge.userBadges.length,
        0
    );
    const averageRequiredScore =
        badges.length > 0
            ? Math.round(
                badges.reduce(
                    (sum, badge) => sum + Number(badge.requiredScore),
                    0
                ) / badges.length
            )
            : 0;

    const mostUnlockedBadge = [...badges].sort(
        (a, b) => b.userBadges.length - a.userBadges.length
    )[0];

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
                            <span className="truncate">Admin Badge Master</span>
                        </div>

                        <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                            Kelola Badge
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/75">
                            Buat dan pantau badge regeneratif yang terbuka otomatis ketika
                            pengguna mencapai required score tertentu.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border-emerald-300/20 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
                                Admin: {admin.name}
                            </Badge>
                            <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                                {totalBadges} badge master
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:w-[300px]">
                        <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/65">
                            Badges Unlocked
                        </p>
                        <p className="mt-2 text-3xl font-semibold">
                            {formatNumber(totalUnlocked)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-emerald-50/70">
                            Total badge yang sudah didapatkan user.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminBadgeStatCard
                    label="Badge Master"
                    value={formatNumber(totalBadges)}
                    caption="Template badge"
                    icon={<Award className="size-5" />}
                />
                <AdminBadgeStatCard
                    label="Unlocked"
                    value={formatNumber(totalUnlocked)}
                    caption="Total user badge"
                    icon={<BadgeCheck className="size-5" />}
                />
                <AdminBadgeStatCard
                    label="Avg Required"
                    value={formatNumber(averageRequiredScore)}
                    caption="Rata-rata required score"
                    icon={<BarChart3 className="size-5" />}
                />
                <AdminBadgeStatCard
                    label="Most Unlocked"
                    value={mostUnlockedBadge?.name ?? "—"}
                    caption={
                        mostUnlockedBadge
                            ? `${mostUnlockedBadge.userBadges.length} user`
                            : "Belum ada data"
                    }
                    icon={<Trophy className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
                <Card className="w-full min-w-0 overflow-hidden border-emerald-950/10 bg-white/95 shadow-sm">
                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 sm:px-6">
                        <CardTitle className="text-base sm:text-lg">
                            Badge Directory
                        </CardTitle>
                        <CardDescription>
                            Daftar badge master, required score, kategori, dan jumlah user
                            yang sudah membuka badge tersebut.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        {badges.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm font-medium text-emerald-950">
                                    Belum ada badge master.
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Tambahkan badge pertama melalui form di samping.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-emerald-900/10">
                                {badges.map((badge) => {
                                    const unlockCount = badge.userBadges.length;
                                    const latestUnlock = badge.userBadges
                                        .slice()
                                        .sort(
                                            (a, b) =>
                                                b.earnedAt.getTime() -
                                                a.earnedAt.getTime()
                                        )[0];

                                    return (
                                        <article
                                            key={badge.id}
                                            className="bg-white px-4 py-5 transition hover:bg-emerald-50/30 sm:px-5"
                                        >
                                            <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_230px] 2xl:items-start">
                                                <div className="min-w-0">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                                            <Medal className="size-4" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                <div className="min-w-0">
                                                                    <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-emerald-950 sm:text-base">
                                                                        {badge.name}
                                                                    </h3>
                                                                    <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-5 text-muted-foreground">
                                                                        {badge.description}
                                                                    </p>
                                                                </div>

                                                                <Badge
                                                                    className={getCategoryClass(
                                                                        badge.category
                                                                    )}
                                                                >
                                                                    {categoryLabels[
                                                                        badge.category
                                                                    ] ?? badge.category}
                                                                </Badge>
                                                            </div>

                                                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                                                <BadgeInfoBox
                                                                    label="Required Score"
                                                                    value={formatNumber(
                                                                        Number(
                                                                            badge.requiredScore
                                                                        )
                                                                    )}
                                                                />
                                                                <BadgeInfoBox
                                                                    label="Unlocked"
                                                                    value={formatNumber(
                                                                        unlockCount
                                                                    )}
                                                                    helper="user"
                                                                />
                                                                <BadgeInfoBox
                                                                    label="Created"
                                                                    value={formatDate(
                                                                        badge.createdAt
                                                                    )}
                                                                />
                                                                <BadgeInfoBox
                                                                    label="Latest Unlock"
                                                                    value={
                                                                        latestUnlock
                                                                            ? formatDate(
                                                                                latestUnlock.earnedAt
                                                                            )
                                                                            : "—"
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-slate-50/70 p-3">
                                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                                        <Users className="size-3.5" />
                                                        Unlock Monitor
                                                    </div>

                                                    <p className="mt-3 text-2xl font-semibold text-emerald-950">
                                                        {formatNumber(unlockCount)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        User sudah membuka badge ini.
                                                    </p>

                                                    {latestUnlock ? (
                                                        <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-emerald-900/10">
                                                            <p className="truncate text-xs font-medium text-emerald-950">
                                                                {latestUnlock.user.name}
                                                            </p>
                                                            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                                                {latestUnlock.user.city?.name ??
                                                                    "No City"}{" "}
                                                                •{" "}
                                                                {formatDate(
                                                                    latestUnlock.earnedAt
                                                                )}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-emerald-900/10">
                                                            <p className="text-xs text-muted-foreground">
                                                                Belum ada user yang membuka
                                                                badge ini.
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="mt-4 flex flex-col gap-2 border-t border-emerald-900/10 pt-3 sm:flex-row 2xl:flex-col">
                                                        <BadgeEditDialog
                                                            badge={{
                                                                id: badge.id,
                                                                name: badge.name,
                                                                description: badge.description,
                                                                category: badge.category,
                                                                requiredScore: Number(badge.requiredScore),
                                                            }}
                                                        />

                                                        <BadgeDeleteDialog
                                                            badge={{
                                                                id: badge.id,
                                                                name: badge.name,
                                                                unlockedCount: unlockCount,
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
                    <BadgeCreateForm />

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Badge Rules
                            </CardTitle>
                            <CardDescription>
                                Catatan penggunaan badge dalam REGEN-LINK.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                            <p>
                                1. Nama badge harus unik agar sistem award tidak ambigu.
                            </p>
                            <p>
                                2. Required score dipakai oleh badge engine saat user
                                menyelesaikan action.
                            </p>
                            <p>
                                3. Badge yang sudah pernah dibuka user tidak akan diberikan
                                dua kali.
                            </p>
                            <p>
                                4. Edit dan delete badge akan ditambahkan pada phase
                                berikutnya dengan safety check.
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </main>
    );
}

function AdminBadgeStatCard({
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

function BadgeInfoBox({
    label,
    value,
    helper,
}: {
    label: string;
    value: string;
    helper?: string;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-white px-3 py-3">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
            </p>
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