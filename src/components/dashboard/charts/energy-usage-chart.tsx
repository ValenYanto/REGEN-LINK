"use client";

import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { Zap } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type EnergyUsageChartProps = {
    data: {
        date: string;
        kwh: number;
    }[];
};

export function EnergyUsageChart({ data }: EnergyUsageChartProps) {
    return (
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <Zap className="size-5" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                            Energy Usage Trend
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs leading-5 dark:text-slate-400 sm:text-sm">
                            Tren konsumsi listrik berdasarkan record terbaru.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="min-w-0 px-4 pt-5 pb-4 sm:px-6">
                {data.length === 0 ? (
                    <EmptyChartMessage message="Belum ada data energi untuk divisualisasikan." />
                ) : (
                    <div className="w-full min-w-0 overflow-x-auto">
                        <div className="h-[240px] min-w-[480px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="currentColor"
                                        className="text-slate-200 dark:text-white/10"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        fontSize={12}
                                        tick={{ fill: "currentColor" }}
                                        className="text-slate-500 dark:text-slate-400"
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        fontSize={12}
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
                                        formatter={(value) => [`${value} kWh`, "Energy"]}
                                        labelFormatter={(label) => `Tanggal: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="kwh"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                            fill: "#10b981",
                                        }}
                                        activeDot={{
                                            r: 6,
                                            fill: "#34d399",
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function EmptyChartMessage({ message }: { message: string }) {
    return (
        <div className="flex h-[220px] min-w-0 items-center justify-center rounded-2xl border border-dashed border-emerald-900/15 bg-emerald-50/40 p-6 text-center transition-colors dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-muted-foreground dark:text-slate-400">
                {message}
            </p>
        </div>
    );
}