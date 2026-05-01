"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    BadgeCheck,
    BrainCircuit,
    Flame,
    Home,
    MapPinned,
    Medal,
    Network,
    Recycle,
    ShieldCheck,
    Sparkles,
    Trophy,
    UserCircle,
    Users,
    Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type NavigationItem = {
    title: string;
    href: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
    status?: "active" | "soon";
};

const mainNavigationItems: NavigationItem[] = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: Home,
        status: "active",
    },
    {
        title: "Energy Records",
        href: "/dashboard/energy",
        icon: Zap,
        status: "active",
    },
    {
        title: "Waste Records",
        href: "/dashboard/waste",
        icon: Recycle,
        status: "active",
    },
    {
        title: "Impact Center",
        href: "/dashboard/impact",
        icon: BrainCircuit,
        status: "active",
    },
    {
        title: "AI Recommendations",
        href: "/dashboard/recommendations",
        icon: Sparkles,
        status: "active",
    },
    {
        title: "Actions",
        href: "/dashboard/actions",
        icon: Flame,
        status: "active",
    },
    {
        title: "Challenges",
        href: "/dashboard/challenges",
        icon: Trophy,
        status: "active",
    },
    {
        title: "Leaderboard",
        href: "/dashboard/leaderboard",
        icon: Medal,
        status: "active",
    },
    {
        title: "City Insights",
        href: "/dashboard/city-insights",
        icon: BarChart3,
        status: "active",
    },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: UserCircle,
        status: "active",
    },
];

const adminNavigationItems: NavigationItem[] = [
    {
        title: "Admin Overview",
        href: "/dashboard/admin",
        icon: ShieldCheck,
        status: "active",
    },
    {
        title: "Users & Roles",
        href: "/dashboard/admin/users",
        icon: Users,
        status: "active",
    },
    {
        title: "Action Master",
        href: "/dashboard/admin/actions",
        icon: Flame,
        status: "active",
    },
    {
        title: "Challenges",
        href: "/dashboard/admin/challenges",
        icon: Trophy,
        status: "active",
    },
    {
        title: "Badges",
        href: "/dashboard/admin/badges",
        icon: BadgeCheck,
        status: "active",
    },
    {
        title: "Cities",
        href: "/dashboard/admin/cities",
        icon: MapPinned,
        status: "active",
    },
    {
        title: "Communities",
        href: "/dashboard/admin/communities",
        icon: Network,
        status: "active",
    },
];

type AppSidebarProps = {
    role?: string;
};

export function AppSidebar({ role }: AppSidebarProps) {
    const pathname = usePathname();
    const isAdmin = role === "ADMIN";

    return (
        <aside className="hidden min-h-screen w-72 shrink-0 border-r border-emerald-900/10 bg-white/85 px-4 py-5 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/90 lg:block">
            <div className="flex items-center gap-3 rounded-3xl border border-emerald-900/10 bg-emerald-50/70 p-3 transition-colors dark:border-white/10 dark:bg-white/[0.08]">
                <Image
                    src="/logo.png"
                    alt="REGEN-LINK"
                    width={42}
                    height={42}
                    className="rounded-2xl"
                    priority
                />
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
                        REGEN-LINK
                    </p>
                    <p className="truncate text-[11px] uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                        Climate Node
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-6">
                <SidebarSection title="Main Platform">
                    {mainNavigationItems.map((item) => (
                        <SidebarLink key={item.href} item={item} pathname={pathname} />
                    ))}
                </SidebarSection>

                {isAdmin ? (
                    <SidebarSection
                        title="Admin Control"
                        badge={
                            <Badge className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                ADMIN
                            </Badge>
                        }
                    >
                        <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50/60 p-2 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                            {adminNavigationItems.map((item) => (
                                <SidebarLink
                                    key={item.href}
                                    item={item}
                                    pathname={pathname}
                                    compact
                                />
                            ))}
                        </div>
                    </SidebarSection>
                ) : null}
            </div>
        </aside>
    );
}

function SidebarSection({
    title,
    badge,
    children,
}: {
    title: string;
    badge?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-2">
            <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700/70 dark:text-emerald-300/60">
                    {title}
                </p>
                {badge}
            </div>

            <nav className="space-y-1">{children}</nav>
        </section>
    );
}

function SidebarLink({
    item,
    pathname,
    compact = false,
}: {
    item: NavigationItem;
    pathname: string;
    compact?: boolean;
}) {
    const Icon = item.icon;
    const isSoon = item.status === "soon";

    const isActive =
        item.href === "/dashboard"
            ? pathname === "/dashboard"
            : item.href === "/dashboard/admin"
                ? pathname === "/dashboard/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

    if (isSoon) {
        return (
            <div
                className={cn(
                    "flex cursor-not-allowed items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-muted-foreground opacity-70 dark:text-slate-500",
                    compact && "py-2 text-xs"
                )}
            >
                <div className="flex min-w-0 items-center gap-3">
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                    Soon
                </Badge>
            </div>
        );
    }

    return (
        <Link
            href={item.href}
            className={cn(
                "group flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition duration-200",
                compact && "py-2 text-xs",
                isActive
                    ? "bg-emerald-950 text-emerald-50 shadow-sm dark:bg-emerald-300 dark:text-emerald-950 dark:shadow-none"
                    : "text-emerald-950/70 hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-emerald-50"
            )}
        >
            <Icon
                className={cn(
                    "size-4 shrink-0 transition",
                    isActive
                        ? "text-current"
                        : "text-emerald-700/70 group-hover:text-emerald-700 dark:text-slate-400 dark:group-hover:text-emerald-300"
                )}
            />
            <span className="truncate">{item.title}</span>
        </Link>
    );
}
