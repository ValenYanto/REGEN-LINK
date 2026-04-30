import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    MapPin,
    ShieldCheck,
    Users,
    Warehouse,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { CityCreateForm } from "@/components/admin/city-create-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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

export default async function AdminCitiesPage() {
    const admin = await requireAdmin();

    const cities = await prisma.city.findMany({
        orderBy: [
            {
                province: "asc",
            },
            {
                name: "asc",
            },
        ],
        include: {
            users: {
                select: {
                    id: true,
                    regenerativeScore: true,
                    energyRecords: {
                        select: {
                            monthlyKwh: true,
                        },
                    },
                    wasteRecords: {
                        select: {
                            weightKg: true,
                        },
                    },
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
                },
            },
            communities: {
                select: {
                    id: true,
                },
            },
        },
    });

    const totalCities = cities.length;
    const totalUsers = cities.reduce((sum, city) => sum + city.users.length, 0);
    const totalCommunities = cities.reduce(
        (sum, city) => sum + city.communities.length,
        0
    );

    const totalCityScore = cities.reduce((citySum, city) => {
        return (
            citySum +
            city.users.reduce((userSum, user) => {
                return userSum + (user.regenerativeScore?.totalScore ?? 0);
            }, 0)
        );
    }, 0);

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
                            <span className="truncate">Admin City Nodes</span>
                        </div>

                        <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                            Kelola City Node
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/75">
                            Pantau dan tambahkan kota yang menjadi node kontribusi
                            REGEN-LINK untuk leaderboard, city insights, komunitas, dan
                            distribusi user.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="border-emerald-300/20 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
                                Admin: {admin.name}
                            </Badge>
                            <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                                {totalCities} city node
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:w-[300px]">
                        <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/65">
                            Network Coverage
                        </p>
                        <p className="mt-2 text-3xl font-semibold">
                            {formatNumber(totalUsers)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-emerald-50/70">
                            User terhubung ke city node.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminCityStatCard
                    label="Total City"
                    value={formatNumber(totalCities)}
                    caption="City node aktif"
                    icon={<Building2 className="size-5" />}
                />
                <AdminCityStatCard
                    label="Total Users"
                    value={formatNumber(totalUsers)}
                    caption="User lintas kota"
                    icon={<Users className="size-5" />}
                />
                <AdminCityStatCard
                    label="Communities"
                    value={formatNumber(totalCommunities)}
                    caption="Komunitas terhubung"
                    icon={<Warehouse className="size-5" />}
                />
                <AdminCityStatCard
                    label="City Score"
                    value={formatNumber(totalCityScore)}
                    caption="Akumulasi score kota"
                    icon={<MapPin className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <Card className="w-full min-w-0 overflow-hidden border-emerald-950/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                    <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                        <CardTitle className="text-base text-emerald-950 dark:text-emerald-50 sm:text-lg">
                            City Directory
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                            Daftar kota beserta jumlah user, komunitas, score, dan aktivitas
                            kontribusinya.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        {cities.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                                    Belum ada city node.
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                                    Tambahkan city node pertama melalui form di samping.
                                </p>
                            </div>
                        ) : (
                            <div className="min-w-0">
                                <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_90px_110px_110px_110px] border-b border-emerald-900/10 bg-emerald-50/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 lg:grid">
                                    <div>City</div>
                                    <div>Province</div>
                                    <div className="text-right">Users</div>
                                    <div className="text-right">Community</div>
                                    <div className="text-right">Score</div>
                                    <div className="text-right">Created</div>
                                </div>

                                <div className="divide-y divide-emerald-900/10 dark:divide-white/10">
                                    {cities.map((city) => {
                                        const cityScore = city.users.reduce(
                                            (sum, user) =>
                                                sum +
                                                (user.regenerativeScore?.totalScore ?? 0),
                                            0
                                        );

                                        return (
                                            <div
                                                key={city.id}
                                                className="bg-white px-4 py-4 transition-colors dark:bg-transparent dark:hover:bg-white/[0.04]"
                                            >
                                                <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_90px_110px_110px_110px] lg:items-center">
                                                    <div className="min-w-0">
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors dark:bg-emerald-400/10 dark:text-emerald-300">
                                                                <Building2 className="size-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="truncate font-semibold text-emerald-950 dark:text-emerald-50">
                                                                    {city.name}
                                                                </p>
                                                                <p className="mt-0.5 truncate text-xs text-muted-foreground dark:text-slate-400">
                                                                    {city.country}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <CompactCityInfo
                                                        label="Province"
                                                        value={city.province}
                                                    />

                                                    <CompactCityMetric
                                                        label="Users"
                                                        value={formatNumber(city.users.length)}
                                                    />

                                                    <CompactCityMetric
                                                        label="Community"
                                                        value={formatNumber(
                                                            city.communities.length
                                                        )}
                                                    />

                                                    <CompactCityMetric
                                                        label="Score"
                                                        value={formatNumber(cityScore)}
                                                    />

                                                    <CompactCityMetric
                                                        label="Created"
                                                        value={formatDate(city.createdAt)}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <aside className="min-w-0 space-y-5">
                    <CityCreateForm />

                    <Card className="w-full min-w-0 border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                                City Node Rules
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Catatan struktur city dalam REGEN-LINK.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                            <p>1. Kombinasi nama kota dan provinsi harus unik.</p>
                            <p>2. User dapat terhubung ke satu city node.</p>
                            <p>
                                3. City Insights dihitung dari akumulasi user, score,
                                action, energy, dan waste.
                            </p>
                            <p>4. Community dapat dikelompokkan berdasarkan city node.</p>
                        </CardContent>
                    </Card>
                </aside>
            </section>
        </main>
    );
}

function AdminCityStatCard({
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

function CompactCityInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 ring-1 ring-emerald-900/10 transition-colors dark:bg-white/[0.04] dark:ring-white/10 lg:block lg:bg-transparent lg:p-0 lg:ring-0">
            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 lg:hidden">
                {label}
            </span>
            <span className="truncate text-sm text-muted-foreground dark:text-slate-400">
                {value}
            </span>
        </div>
    );
}

function CompactCityMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 ring-1 ring-emerald-900/10 transition-colors dark:bg-white/[0.04] dark:ring-white/10 lg:block lg:bg-transparent lg:p-0 lg:text-right lg:ring-0">
            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 lg:hidden">
                {label}
            </span>
            <span className="font-semibold text-emerald-950 dark:text-emerald-50">
                {value}
            </span>
        </div>
    );
}