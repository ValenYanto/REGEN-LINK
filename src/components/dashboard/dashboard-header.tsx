import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";

type DashboardHeaderProps = {
    user: {
        name: string;
        email: string;
        city: string;
        level: string;
    };
    role?: string;
};

export function DashboardHeader({ user, role }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-40 hidden border-b border-[#e4e7ec] bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85 lg:block">
            <div className="flex h-16 items-center justify-between px-5 md:px-8 lg:px-10">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-black uppercase tracking-[0.14em] text-[#00a66a] dark:text-emerald-300">
                            Environmental Telemetry
                        </p>
                        <h1 className="truncate text-lg font-black tracking-[-0.03em] text-[#101828] dark:text-slate-50 md:text-xl">
                            Welcome back, {user.name}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
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

                    <DashboardHeaderActions role={role} />
                </div>
            </div>
        </header>
    );
}