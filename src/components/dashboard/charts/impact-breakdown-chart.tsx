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
        <Card className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <Leaf className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Impact Breakdown</CardTitle>
                        <CardDescription>
                            Ringkasan estimasi dampak dari action yang dibuat.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                width={70}
                            />
                            <Tooltip
                                formatter={(value, _name, item) => {
                                    const payload = item.payload as { unit: string };
                                    return [`${value} ${payload.unit}`, "Impact"];
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#065f46"
                                radius={[0, 10, 10, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}