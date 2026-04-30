import Link from "next/link";
import Image from "next/image";
import {
    BarChart3,
    BrainCircuit,
    Flame,
    Home,
    Leaf,
    Medal,
    Recycle,
    Settings,
    Trophy,
    UserCircle,
    Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
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
        icon: Leaf,
        status: "soon",
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
        status: "soon",
    },
];

type AppSidebarProps = {
    activePath?: string;
};

export function AppSidebar({ activePath = "/dashboard" }: AppSidebarProps) {
    return (
        <aside className="hidden min-h-screen w-72 border-r border-emerald-900/10 bg-white/85 px-4 py-5 backdrop-blur-xl lg:block">
            <div className="flex items-center gap-3 rounded-3xl border border-emerald-900/10 bg-emerald-50/70 p-3">
                <Image
                    src="/logo.png"
                    alt="REGEN-LINK"
                    width={42}
                    height={42}
                    className="rounded-2xl"
                />
                <div>
                    <p className="text-sm font-bold tracking-tight text-emerald-950">
                        REGEN-LINK
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-700">
                        Climate Node
                    </p>
                </div>
            </div>

            <nav className="mt-6 space-y-1">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === "/dashboard"
                            ? activePath === "/dashboard"
                            : activePath.startsWith(item.href);

                    const isSoon = item.status === "soon";

                    if (isSoon) {
                        return (
                            <div
                                key={item.title}
                                className="flex cursor-not-allowed items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-muted-foreground opacity-70"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="size-4" />
                                    <span>{item.title}</span>
                                </div>
                                <Badge variant="secondary" className="text-[10px]">
                                    Soon
                                </Badge>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                                isActive
                                    ? "bg-emerald-950 text-emerald-50 shadow-sm"
                                    : "text-emerald-950/70 hover:bg-emerald-50 hover:text-emerald-950"
                            )}
                        >
                            <Icon className="size-4" />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-emerald-950 to-lime-900 p-4 text-white">
                <div className="flex items-center gap-2">
                    <Leaf className="size-4 text-lime-300" />
                    <p className="text-sm font-semibold">Phase 6B Active</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-emerald-50/75">
                    Impact calculator and rule-based AI recommendation are now connected.
                </p>
            </div>

            <div className="mt-4 flex items-center gap-2 px-2 text-xs text-muted-foreground">
                <Settings className="size-3.5" />
                <span>System protocol: MVP Build</span>
            </div>
        </aside>
    );
}