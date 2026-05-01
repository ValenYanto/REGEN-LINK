"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    BadgeCheck,
    BrainCircuit,
    Flame,
    Home,
    MapPinned,
    Medal,
    Menu,
    Network,
    Recycle,
    ShieldCheck,
    Sparkles,
    Trophy,
    UserCircle,
    Users,
    X,
    Zap,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MobileNavigationItem = {
    title: string;
    href: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
    adminOnly?: boolean;
};

const mainNavigationItems: MobileNavigationItem[] = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Energy Records",
        href: "/dashboard/energy",
        icon: Zap,
    },
    {
        title: "Waste Records",
        href: "/dashboard/waste",
        icon: Recycle,
    },
    {
        title: "Impact Center",
        href: "/dashboard/impact",
        icon: BrainCircuit,
    },
    {
        title: "AI Recommendations",
        href: "/dashboard/recommendations",
        icon: Sparkles,
    },
    {
        title: "Actions",
        href: "/dashboard/actions",
        icon: Flame,
    },
    {
        title: "Challenges",
        href: "/dashboard/challenges",
        icon: Trophy,
    },
    {
        title: "Leaderboard",
        href: "/dashboard/leaderboard",
        icon: Medal,
    },
    {
        title: "City Insights",
        href: "/dashboard/city-insights",
        icon: BarChart3,
    },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: UserCircle,
    },
];

const adminNavigationItems: MobileNavigationItem[] = [
    {
        title: "Admin Overview",
        href: "/dashboard/admin",
        icon: ShieldCheck,
        adminOnly: true,
    },
    {
        title: "Users & Roles",
        href: "/dashboard/admin/users",
        icon: Users,
        adminOnly: true,
    },
    {
        title: "Action Master",
        href: "/dashboard/admin/actions",
        icon: Flame,
        adminOnly: true,
    },
    {
        title: "Challenges",
        href: "/dashboard/admin/challenges",
        icon: Trophy,
        adminOnly: true,
    },
    {
        title: "Badges",
        href: "/dashboard/admin/badges",
        icon: BadgeCheck,
        adminOnly: true,
    },
    {
        title: "Cities",
        href: "/dashboard/admin/cities",
        icon: MapPinned,
        adminOnly: true,
    },
    {
        title: "Communities",
        href: "/dashboard/admin/communities",
        icon: Network,
        adminOnly: true,
    },
];

type MobileDashboardNavProps = {
    role?: string;
};

export function MobileDashboardNav({ role }: MobileDashboardNavProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const isAdmin = role === "ADMIN";

    function isItemActive(href: string) {
        return href === "/dashboard"
            ? pathname === "/dashboard"
            : href === "/dashboard/admin"
                ? pathname === "/dashboard/admin"
                : pathname === href || pathname.startsWith(`${href}/`);
    }

    return (
        <div className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden border-b border-emerald-900/10 bg-white/90 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/90 lg:hidden">
            <div className="flex h-16 w-full min-w-0 items-center justify-between px-4">
                <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="REGEN-LINK"
                        width={36}
                        height={36}
                        className="rounded-xl"
                    />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold leading-none text-emerald-950 dark:text-emerald-50">
                            REGEN-LINK
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                            Climate Node
                        </p>
                    </div>
                </Link>

                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-2xl border-emerald-900/10 bg-white/70 text-emerald-950 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/10 dark:text-emerald-50 dark:hover:bg-white/15"
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Toggle mobile navigation"
                >
                    {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {open ? (
                <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-emerald-900/10 bg-[#f7faf6] px-3 py-4 shadow-xl shadow-emerald-950/5 transition-colors dark:border-white/10 dark:bg-slate-950 dark:shadow-none">
                    <div className="space-y-5">
                        <MobileNavSection title="Main Platform">
                            {mainNavigationItems.map((item) => (
                                <MobileNavLink
                                    key={item.href}
                                    item={item}
                                    active={isItemActive(item.href)}
                                    onNavigate={() => setOpen(false)}
                                />
                            ))}
                        </MobileNavSection>

                        {isAdmin ? (
                            <MobileNavSection title="Admin Control">
                                {adminNavigationItems.map((item) => (
                                    <MobileNavLink
                                        key={item.href}
                                        item={item}
                                        active={isItemActive(item.href)}
                                        onNavigate={() => setOpen(false)}
                                    />
                                ))}
                            </MobileNavSection>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function MobileNavSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="min-w-0 space-y-2">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700/70 dark:text-emerald-300/60">
                {title}
            </p>
            <nav className="grid min-w-0 grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                {children}
            </nav>
        </section>
    );
}

function MobileNavLink({
    item,
    active,
    onNavigate,
}: {
    item: MobileNavigationItem;
    active: boolean;
    onNavigate: () => void;
}) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
                "flex min-w-0 items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-medium transition duration-200",
                active
                    ? "border-emerald-950 bg-emerald-950 text-emerald-50 dark:border-emerald-300 dark:bg-emerald-300 dark:text-emerald-950"
                    : "border-emerald-900/10 bg-white text-emerald-950/70 hover:-translate-y-0.5 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-emerald-50"
            )}
        >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{item.title}</span>
        </Link>
    );
}
