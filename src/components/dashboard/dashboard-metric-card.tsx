import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function DashboardMetricCard({
    icon,
    label,
    value,
    caption,
    trend,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    caption: string;
    trend?: string;
}) {
    return (
        <Card className="rounded-2xl border-[#e4e7ec] bg-white shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <CardContent className="p-5">
                <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dff8ec] text-[#00a66a]">
                        {icon}
                    </div>

                    {trend && (
                        <div className="flex items-center gap-1 rounded-full bg-[#ecfdf6] px-2 py-1 text-[11px] font-black text-[#00734f]">
                            <ArrowUpRight size={12} />
                            {trend}
                        </div>
                    )}
                </div>

                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#667085]">
                    {label}
                </p>

                <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#101828]">
                    {value}
                </p>

                <p className="mt-1 text-sm font-semibold text-[#667085]">{caption}</p>
            </CardContent>
        </Card>
    );
}