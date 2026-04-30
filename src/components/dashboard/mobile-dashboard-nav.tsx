"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    BrainCircuit,
    Flame,
    Home,
    Medal,
    Menu,
    Recycle,
    ShieldCheck,
    Sparkles,
    Trophy,
    UserCircle,
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

const mobileNavigationItems: MobileNavigationItem[] = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Energy",
        href: "/dashboard/energy",
        icon: Zap,
    },
    {
        title: "Waste",
        href: "/dashboard/waste",
        icon: Recycle,
    },
    {
        title: "Impact",
        href: "/dashboard/impact",
        icon: BrainCircuit,
    },
    {
        title: "AI Recs",
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
    {
        title: "Admin",
        href: "/dashboard/admin",
        icon: ShieldCheck,
        adminOnly: true,
    },
];

type MobileDashboardNavProps = {
    role?: string;
};

export function MobileDashboardNav({ role }: MobileDashboardNavProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const visibleNavigationItems = mobileNavigationItems.filter((item) => {
        if (item.adminOnly) {
            return role === "ADMIN";
        }

        return true;
    });

    function isItemActive(href: string) {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
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
                    className="h-10 w-10 rounded-2xl border-emerald-900/10 bg-white/70 text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/10 dark:text-emerald-50 dark:hover:bg-white/15"
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Toggle mobile navigation"
                >
                    {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {open ? (
                <div className="border-t border-emerald-900/10 bg-white px-4 py-4 shadow-xl shadow-emerald-950/5 transition-colors dark:border-white/10 dark:bg-slate-950 dark:shadow-none">
                    <nav className="grid grid-cols-2 gap-2">
                        {visibleNavigationItems.map((item) => {
                            const Icon = item.icon;
                            const active = isItemActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium transition",
                                        active
                                            ? "border-emerald-950 bg-emerald-950 text-emerald-50 dark:border-emerald-300 dark:bg-emerald-300 dark:text-emerald-950"
                                            : "border-emerald-900/10 bg-emerald-50/50 text-emerald-950/75 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-emerald-50"
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            ) : null}
        </div>
    );
}