"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
    Bell,
    Bot,
    CheckCircle2,
    ChevronRight,
    LogOut,
    Settings,
    ShieldCheck,
    Trophy,
    UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

type DashboardHeaderActionsProps = {
    role?: string;
};

export function DashboardHeaderActions({ role }: DashboardHeaderActionsProps) {
    const isAdmin = role === "ADMIN";

    return (
        <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Open notifications"
                        className="relative rounded-full text-slate-700 hover:bg-[#f2f4f7] dark:text-slate-200 dark:hover:bg-white/10"
                    >
                        <Bell size={18} />
                        <span className="absolute right-2 top-2 size-2 rounded-full bg-emerald-500 ring-2 ring-white dark:bg-emerald-300 dark:ring-slate-950" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-72 border-emerald-900/10 bg-white p-2 text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-slate-50"
                >
                    <DropdownMenuLabel className="px-2 text-xs uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                        Notifications
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-emerald-900/10 dark:bg-white/10" />

                    <DropdownMenuItem className="items-start gap-3 rounded-xl px-2 py-2 dark:focus:bg-white/10">
                        <Bot className="mt-0.5 size-4 text-emerald-700 dark:text-emerald-300" />
                        <div>
                            <p className="text-sm font-medium text-slate-950 dark:text-emerald-50">
                                AI engine ready
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Generate rekomendasi dari Pusat Dampak.
                            </p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="items-start gap-3 rounded-xl px-2 py-2 dark:focus:bg-white/10">
                        <CheckCircle2 className="mt-0.5 size-4 text-emerald-700 dark:text-emerald-300" />
                        <div>
                            <p className="text-sm font-medium text-slate-950 dark:text-emerald-50">
                                Action progress can be updated
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Selesaikan aksi untuk menaikkan score.
                            </p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="items-start gap-3 rounded-xl px-2 py-2 dark:focus:bg-white/10">
                        <Trophy className="mt-0.5 size-4 text-emerald-700 dark:text-emerald-300" />
                        <div>
                            <p className="text-sm font-medium text-slate-950 dark:text-emerald-50">
                                Leaderboard synced
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Progress challenge dan ranking siap dipantau.
                            </p>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-emerald-900/10 dark:bg-white/10" />

                    <p className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
                        MVP notification center
                    </p>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Open settings"
                        className="rounded-full text-slate-700 hover:bg-[#f2f4f7] dark:text-slate-200 dark:hover:bg-white/10"
                    >
                        <Settings size={18} />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-72 border-emerald-900/10 bg-white p-2 text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-slate-50"
                >
                    <DropdownMenuLabel className="px-2 text-xs uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                        Settings
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-emerald-900/10 dark:bg-white/10" />

                    <DropdownMenuItem asChild className="rounded-xl px-2 py-2 dark:focus:bg-white/10">
                        <Link href="/dashboard/profile" className="flex items-center gap-3">
                            <UserCircle className="size-4 text-emerald-700 dark:text-emerald-300" />
                            <span className="flex-1">Profile Settings</span>
                            <ChevronRight className="size-4 text-slate-400" />
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-xl px-2 py-2 dark:focus:bg-white/10">
                        <Link href="/dashboard/city-insights" className="flex items-center gap-3">
                            <Trophy className="size-4 text-emerald-700 dark:text-emerald-300" />
                            <span className="flex-1">City Insights</span>
                            <ChevronRight className="size-4 text-slate-400" />
                        </Link>
                    </DropdownMenuItem>

                    {isAdmin ? (
                        <DropdownMenuItem asChild className="rounded-xl px-2 py-2 dark:focus:bg-white/10">
                            <Link href="/dashboard/admin" className="flex items-center gap-3">
                                <ShieldCheck className="size-4 text-emerald-700 dark:text-emerald-300" />
                                <span className="flex-1">Admin Control</span>
                                <ChevronRight className="size-4 text-slate-400" />
                            </Link>
                        </DropdownMenuItem>
                    ) : null}

                    <DropdownMenuSeparator className="bg-emerald-900/10 dark:bg-white/10" />

                    <DropdownMenuItem disabled className="rounded-xl px-2 py-2 text-xs">
                        Theme preferences are controlled by the toggle.
                    </DropdownMenuItem>

                    <DropdownMenuItem disabled className="rounded-xl px-2 py-2 text-xs">
                        System: MVP Build
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                type="button"
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="gap-2 rounded-xl border-emerald-900/10 bg-white font-black text-slate-900 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-white/[0.1]"
            >
                <LogOut size={16} />
                Logout
            </Button>
        </div>
    );
}