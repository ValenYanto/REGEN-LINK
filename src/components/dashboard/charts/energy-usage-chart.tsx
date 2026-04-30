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
        <Card className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <Zap className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Energy Usage Trend</CardTitle>
                        <CardDescription>
                            Tren konsumsi listrik berdasarkan record terbaru.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                {data.length === 0 ? (
                    <EmptyChartMessage message="Belum ada data energi untuk divisualisasikan." />
                ) : (
                    <div className="h-[240px]">
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
                )}
            </CardContent>
        </Card>
    );
}

function EmptyChartMessage({ message }: { message: string }) {
    return (
        <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed bg-emerald-50/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}