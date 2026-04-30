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
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <Zap className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base">Energy Usage Trend</CardTitle>
                        <CardDescription className="mt-1 text-xs leading-5 sm:text-sm">
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
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        fontSize={12}
                                    />
                                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                                    <Tooltip
                                        formatter={(value) => [`${value} kWh`, "Energy"]}
                                        labelFormatter={(label) => `Tanggal: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="kwh"
                                        stroke="#064e3b"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                            fill: "#064e3b",
                                        }}
                                        activeDot={{
                                            r: 6,
                                            fill: "#10b981",
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
        <div className="flex h-[220px] min-w-0 items-center justify-center rounded-2xl border border-dashed bg-emerald-50/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}