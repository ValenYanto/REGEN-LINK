import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    MapPin,
    ShieldCheck,
    Users,
    UsersRound,
    Warehouse,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { CommunityCreateForm } from "@/components/admin/community-create-form";
import { CommunityEditDialog } from "@/components/admin/community-edit-dialog";
import { CommunityDeleteDialog } from "@/components/admin/community-delete-dialog";
import { CommunityMemberForm } from "@/components/admin/community-member-form";
import { CommunityMemberRemoveButton } from "@/components/admin/community-member-remove-button";

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
    CAMPUS: "Campus",
    CITY: "City",
    UMKM: "UMKM",
    YOUTH_ORGANIZATION: "Youth Org",
    ENVIRONMENTAL_COMMUNITY: "Environmental",
    OTHER: "Other",
};

function formatNumber(value: number) {
    return new Intl.NumberFormat("id-ID").format(value);
}

function formatDate(value: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}

function getTypeClass(type: string) {
    if (type === "CAMPUS") {
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-300/15 dark:text-emerald-200 dark:hover:bg-emerald-300/15";
    }

    if (type === "CITY") {
        return "bg-sky-100 text-sky-800 hover:bg-sky-100 dark:bg-sky-300/15 dark:text-sky-200 dark:hover:bg-sky-300/15";
    }

    if (type === "UMKM") {
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-300/15 dark:text-amber-200 dark:hover:bg-amber-300/15";
    }

    if (type === "YOUTH_ORGANIZATION") {
        return "bg-violet-100 text-violet-800 hover:bg-violet-100 dark:bg-violet-300/15 dark:text-violet-200 dark:hover:bg-violet-300/15";
    }

    if (type === "ENVIRONMENTAL_COMMUNITY") {
        return "bg-lime-100 text-lime-800 hover:bg-lime-100 dark:bg-lime-300/15 dark:text-lime-200 dark:hover:bg-lime-300/15";
    }

    return "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10";
}

export default async function AdminCommunitiesPage() {
    const admin = await requireAdmin();

    const [communities, cities, users] = await Promise.all([
        prisma.community.findMany({
            orderBy: [
                {
                    city: {
                        name: "asc",
                    },
                },
                {
                    name: "asc",
                },
            ],
            include: {
                city: true,
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                regenerativeScore: true,
                            },
                        },
                    },
                },
            },
        }),

        prisma.city.findMany({
            orderBy: [
                {
                    province: "asc",
                },
                {
                    name: "asc",
                },
            ],
            select: {
                id: true,
                name: true,
                province: true,
            },
        }),

        prisma.user.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                city: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
    ]);

    const totalCommunities = communities.length;
    const totalMembers = communities.reduce(
        (sum, community) => sum + community.members.length,
        0
    );

    const totalCitiesWithCommunity = new Set(
        communities.map((community) => community.cityId)
    ).size;

    const topCommunity = [...communities].sort(
        (a, b) => b.members.length - a.members.length
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
                            <span className="truncate">Admin Community Nodes</span>
                        </div>

                        <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                            Kelola Community
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/75">
                            Buat dan pantau komunitas REGEN-LINK sebagai penghubung aksi
                            kolaboratif antar user, city node, kampus, UMKM, dan komunitas
                            lingkungan.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border-emerald-300/20 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
                                Admin: {admin.name}
                            </Badge>
                            <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                                {totalCommunities} community
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:w-[300px]">
                        <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/65">
                            Community Members
                        </p>
                        <p className="mt-2 text-3xl font-semibold">
                            {formatNumber(totalMembers)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-emerald-50/70">
                            Total membership di seluruh community.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminCommunityStatCard
                    label="Communities"
                    value={formatNumber(totalCommunities)}
                    caption="Community node"
                    icon={<UsersRound className="size-5" />}
                />
                <AdminCommunityStatCard
                    label="Members"
                    value={formatNumber(totalMembers)}
                    caption="Total membership"
                    icon={<Users className="size-5" />}
                />
                <AdminCommunityStatCard
                    label="Cities Covered"
                    value={formatNumber(totalCitiesWithCommunity)}
                    caption="City dengan community"
                    icon={<MapPin className="size-5" />}
                />
                <AdminCommunityStatCard
                    label="Top Community"
                    value={topCommunity?.name ?? "—"}
                    caption={
                        topCommunity
                            ? `${topCommunity.members.length} member`
                            : "Belum ada data"
                    }
                    icon={<Warehouse className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
                <Card className="w-full min-w-0 overflow-hidden border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                        <CardTitle className="text-base text-emerald-950 dark:text-emerald-50 sm:text-lg">
                            Community Directory
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                            Daftar community beserta city node, tipe, jumlah member, dan
                            aktivitasnya.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        {communities.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                                    Belum ada community.
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                                    Tambahkan community pertama melalui form di samping.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-emerald-900/10 dark:divide-white/10">
                                {communities.map((community) => {
                                    const memberCount = community.members.length;

                                    const totalScore = community.members.reduce(
                                        (sum, member) =>
                                            sum +
                                            (member.user.regenerativeScore?.totalScore ?? 0),
                                        0
                                    );

                                    const latestMembers = community.members.slice(0, 3);

                                    return (
                                        <article
                                            key={community.id}
                                            className="bg-white px-4 py-5 transition hover:bg-emerald-50/30 dark:bg-transparent dark:hover:bg-white/[0.04] sm:px-5"
                                        >
                                            <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_230px] 2xl:items-start">
                                                <div className="min-w-0">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors dark:bg-emerald-400/10 dark:text-emerald-300">
                                                            <UsersRound className="size-4" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                <div className="min-w-0">
                                                                    <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-emerald-950 dark:text-emerald-50 sm:text-base">
                                                                        {community.name}
                                                                    </h3>
                                                                    <p className="mt-1 flex items-center gap-1.5 text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                                                        <Building2 className="size-3.5 shrink-0" />
                                                                        <span className="truncate">
                                                                            {community.city.name},{" "}
                                                                            {community.city.province}
                                                                        </span>
                                                                    </p>
                                                                </div>

                                                                <Badge
                                                                    className={getTypeClass(
                                                                        community.type
                                                                    )}
                                                                >
                                                                    {typeLabels[
                                                                        community.type
                                                                    ] ?? community.type}
                                                                </Badge>
                                                            </div>

                                                            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                                                <CommunityInfoBox
                                                                    label="Members"
                                                                    value={formatNumber(
                                                                        memberCount
                                                                    )}
                                                                />
                                                                <CommunityInfoBox
                                                                    label="Total Score"
                                                                    value={formatNumber(
                                                                        totalScore
                                                                    )}
                                                                />
                                                                <CommunityInfoBox
                                                                    label="City"
                                                                    value={community.city.name}
                                                                    helper={
                                                                        community.city.province
                                                                    }
                                                                />
                                                                <CommunityInfoBox
                                                                    label="Created"
                                                                    value={formatDate(
                                                                        community.createdAt
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-slate-50/70 p-3 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
                                                        <Users className="size-3.5" />
                                                        Member Monitor
                                                    </div>

                                                    <p className="mt-3 text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
                                                        {formatNumber(memberCount)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground dark:text-slate-400">
                                                        Member terhubung ke community ini.
                                                    </p>

                                                    <div className="mt-4 space-y-2">
                                                        {latestMembers.length > 0 ? (
                                                            latestMembers.map((member) => (
                                                                <div
                                                                    key={member.id}
                                                                    className="flex items-start justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-emerald-900/10 dark:bg-white/[0.06] dark:ring-white/10"
                                                                >
                                                                    <div className="min-w-0">
                                                                        <p className="truncate text-xs font-medium text-emerald-950 dark:text-emerald-50">
                                                                            {member.user.name}
                                                                        </p>
                                                                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground dark:text-slate-400">
                                                                            {member.memberRole} •{" "}
                                                                            {formatNumber(
                                                                                member.user
                                                                                    .regenerativeScore
                                                                                    ?.totalScore ??
                                                                                0
                                                                            )}{" "}
                                                                            pts
                                                                        </p>
                                                                    </div>

                                                                    <CommunityMemberRemoveButton
                                                                        memberId={member.id}
                                                                        memberName={
                                                                            member.user.name
                                                                        }
                                                                    />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="rounded-xl bg-white p-3 ring-1 ring-emerald-900/10 dark:bg-white/[0.06] dark:ring-white/10">
                                                                <p className="text-xs text-muted-foreground dark:text-slate-400">
                                                                    Belum ada member di community
                                                                    ini.
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="mt-4 flex flex-col gap-2 border-t border-emerald-900/10 pt-3 dark:border-white/10 sm:flex-row 2xl:flex-col">
                                                            <CommunityEditDialog
                                                                community={{
                                                                    id: community.id,
                                                                    name: community.name,
                                                                    type: community.type,
                                                                    cityId: community.cityId,
                                                                }}
                                                                cities={cities}
                                                            />

                                                            <CommunityDeleteDialog
                                                                community={{
                                                                    id: community.id,
                                                                    name: community.name,
                                                                    memberCount,
                                                                }}
                                                            />
                                                        </div>
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
                    <CommunityCreateForm cities={cities} />

                    <CommunityMemberForm
                        communities={communities.map((community) => ({
                            id: community.id,
                            name: community.name,
                            cityName: community.city.name,
                        }))}
                        users={users.map((user) => ({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            cityName: user.city?.name ?? null,
                        }))}
                    />

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                                Community Rules
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Catatan penggunaan community dalam REGEN-LINK.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                            <p>
                                1. Nama community harus unik dalam city node yang sama.
                            </p>
                            <p>
                                2. Community dapat merepresentasikan kampus, kota, UMKM,
                                organisasi pemuda, atau komunitas lingkungan.
                            </p>
                            <p>
                                3. Membership user akan digunakan untuk insight kolaborasi
                                dan community leaderboard berikutnya.
                            </p>
                            <p>
                                4. Edit, delete, dan member management tersedia dengan safety
                                check agar histori komunitas tetap aman.
                            </p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </main>
    );
}

function AdminCommunityStatCard({
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

function CommunityInfoBox({
    label,
    value,
    helper,
}: {
    label: string;
    value: string;
    helper?: string;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-emerald-900/10 bg-white px-3 py-3 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400">
                {label}
            </p>
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