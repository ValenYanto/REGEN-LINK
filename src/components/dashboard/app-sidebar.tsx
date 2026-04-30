"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Brain,
    CircleGauge,
    Flag,
    Globe2,
    Home,
    Leaf,
    Medal,
    Recycle,
    UserRound,
    Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const navigation = [
    {
        label: "Overview",
        href: "/dashboard",
        icon: Home,
        available: true,
    },
    {
        label: "Energy Records",
        href: "/dashboard/energy",
        icon: Zap,
        available: false,
    },
    {
        label: "Waste Records",
        href: "/dashboard/waste",
        icon: Recycle,
        available: false,
    },
    {
        label: "AI Recommendations",
        href: "/dashboard/recommendations",
        icon: Brain,
        available: false,
    },
    {
        label: "Actions",
        href: "/dashboard/actions",
        icon: CircleGauge,
        available: false,
    },
    {
        label: "Challenges",
        href: "/dashboard/challenges",
        icon: Flag,
        available: false,
    },
    {
        label: "Leaderboard",
        href: "/dashboard/leaderboard",
        icon: Medal,
        available: false,
    },
    {
        label: "City Insights",
        href: "/dashboard/city-insights",
        icon: Globe2,
        available: false,
    },
    {
        label: "Profile",
        href: "/dashboard/profile",
        icon: UserRound,
        available: false,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-[280px] shrink-0 border-r border-[#e4e7ec] bg-white lg:block">
            <div className="flex h-full flex-col">
                <div className="px-6 py-5">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative h-11 w-11 overflow-hidden rounded-full">
                            <Image
                                src="/logo.png"
                                alt="REGEN-LINK Logo"
                                fill
                                sizes="44px"
                                className="object-contain"
                                priority
                            />
                        </div>

                        <div>
                            <p className="text-lg font-black tracking-[-0.04em] text-[#005c43]">
                                REGEN-LINK
                            </p>
                            <p className="-mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a9a95]">
                                Climate Node
                            </p>
                        </div>
                    </Link>
                </div>

                <Separator className="bg-[#e4e7ec]" />

                <nav className="flex-1 space-y-1 px-4 py-5">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-black transition ${isActive
                                        ? "bg-[#dff8ec] text-[#00734f]"
                                        : "text-[#52615c] hover:bg-[#f3f7f5] hover:text-[#005c43]"
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <Icon
                                        size={18}
                                        className={
                                            isActive
                                                ? "text-[#00a66a]"
                                                : "text-[#8a9a95] group-hover:text-[#00a66a]"
                                        }
                                    />
                                    {item.label}
                                </span>

                                {!item.available && (
                                    <Badge
                                        variant="outline"
                                        className="border-[#d9e1e5] px-2 py-0 text-[9px] font-black uppercase tracking-[0.08em] text-[#8a9a95]"
                                    >
                                        Soon
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4">
                    <div className="rounded-2xl border border-[#d9e1e5] bg-[#f8fbfa] p-4">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dff8ec] text-[#00734f]">
                            <Leaf size={20} />
                        </div>
                        <p className="text-sm font-black text-[#101828]">
                            Phase 4 Active
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#667085]">
                            Dashboard shell ready. Energy, waste, AI, and challenge modules
                            will unlock in the next phases.
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}