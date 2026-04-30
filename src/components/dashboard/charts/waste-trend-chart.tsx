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
import { Recycle } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type WasteTrendChartProps = {
    data: {
        date: string;
        kg: number;
        type: string;
    }[];
};

export function WasteTrendChart({ data }: WasteTrendChartProps) {
    return (
        <Card className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-lime-50/60">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <Recycle className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Waste Trend</CardTitle>
                        <CardDescription>
                            Tren berat limbah berdasarkan record terbaru.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                {data.length === 0 ? (
                    <EmptyChartMessage message="Belum ada data limbah untuk divisualisasikan." />
                ) : (
                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                />
                                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                                <Tooltip
                                    formatter={(value) => [`${value} kg`, "Waste"]}
                                    labelFormatter={(label) => `Tanggal: ${label}`}
                                />
                                <Bar
                                    dataKey="kg"
                                    fill="#047857"
                                    radius={[10, 10, 0, 0]}
                                />
                            </BarChart>
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