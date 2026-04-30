import { Bell, LogOut, Menu, Settings } from "lucide-react";

import { signOut } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

type DashboardHeaderProps = {
    user: {
        name: string;
        email: string;
        city: string;
        level: string;
    };
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-[#e4e7ec] bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85">
            <div className="flex h-16 items-center justify-between px-5 md:px-8 lg:px-10">
                <div className="flex min-w-0 items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 lg:hidden"
                    >
                        <Menu size={20} />
                    </Button>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-black uppercase tracking-[0.14em] text-[#00a66a] dark:text-emerald-300">
                            Environmental Telemetry
                        </p>
                        <h1 className="truncate text-lg font-black tracking-[-0.03em] text-[#101828] dark:text-slate-50 md:text-xl">
                            Welcome back, {user.name}
                        </h1>
                    </div>
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    <div className="text-right">
                        <p className="max-w-[180px] truncate text-sm font-black text-[#101828] dark:text-slate-50">
                            {user.city}
                        </p>
                        <p className="max-w-[220px] truncate text-xs font-semibold text-[#667085] dark:text-slate-400">
                            {user.email}
                        </p>
                    </div>

                    <Badge className="rounded-full bg-[#dff8ec] px-3 py-1 text-xs font-black text-[#00734f] hover:bg-[#dff8ec] dark:bg-emerald-400/15 dark:text-emerald-200 dark:hover:bg-emerald-400/15">
                        {user.level}
                    </Badge>

                    <Separator
                        orientation="vertical"
                        className="h-8 bg-[#e4e7ec] dark:bg-white/10"
                    />

                    <ThemeToggle />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-slate-700 hover:bg-[#f2f4f7] dark:text-slate-200 dark:hover:bg-white/10"
                    >
                        <Bell size={18} />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-slate-700 hover:bg-[#f2f4f7] dark:text-slate-200 dark:hover:bg-white/10"
                    >
                        <Settings size={18} />
                    </Button>

                    <form
                        action={async () => {
                            "use server";

                            await signOut({
                                redirectTo: "/login",
                            });
                        }}
                    >
                        <Button
                            type="submit"
                            variant="outline"
                            className="gap-2 rounded-xl border-[#d0d5dd] bg-white font-black text-slate-900 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-50 dark:hover:bg-white/15"
                        >
                            <LogOut size={16} />
                            Logout
                        </Button>
                    </form>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}