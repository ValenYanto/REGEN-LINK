"use client";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { Leaf } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type ImpactBreakdownChartProps = {
    data: {
        name: string;
        value: number;
        unit: string;
    }[];
};

export function ImpactBreakdownChart({ data }: ImpactBreakdownChartProps) {
    return (
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <Leaf className="size-5" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                            Impact Breakdown
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs leading-5 dark:text-slate-400 sm:text-sm">
                            Ringkasan estimasi dampak dari action yang dibuat.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="min-w-0 px-4 pt-5 pb-4 sm:px-6">
                <div className="w-full min-w-0 overflow-x-auto">
                    <div className="h-[240px] min-w-[480px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical">
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    stroke="currentColor"
                                    className="text-slate-200 dark:text-white/10"
                                />
                                <XAxis
                                    type="number"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    tick={{ fill: "currentColor" }}
                                    className="text-slate-500 dark:text-slate-400"
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    width={70}
                                    tick={{ fill: "currentColor" }}
                                    className="text-slate-500 dark:text-slate-400"
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "14px",
                                        border: "1px solid rgba(16,185,129,0.18)",
                                        background: "rgba(255,255,255,0.96)",
                                        color: "#064e3b",
                                    }}
                                    formatter={(value, _name, item) => {
                                        const payload = item.payload as { unit: string };
                                        return [`${value} ${payload.unit}`, "Impact"];
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#10b981"
                                    radius={[0, 10, 10, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}