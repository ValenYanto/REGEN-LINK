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
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-lime-50/60 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <Recycle className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base">Waste Trend</CardTitle>
                        <CardDescription className="mt-1 text-xs leading-5 sm:text-sm">
                            Tren berat limbah berdasarkan record terbaru.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="min-w-0 px-4 pt-5 pb-4 sm:px-6">
                {data.length === 0 ? (
                    <EmptyChartMessage message="Belum ada data limbah untuk divisualisasikan." />
                ) : (
                    <div className="w-full min-w-0 overflow-x-auto">
                        <div className="h-[240px] min-w-[480px]">
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