"use client";

import {
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    PolarAngleAxis,
} from "recharts";
import { Award, CheckCircle2, Crown, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type ScoreProgressChartProps = {
    score: number;
    level: string;
};

const MAX_SCORE = 500;

function getNextMilestone(score: number) {
    if (score < 50) return { label: "Pemula Hemat Energi", target: 50 };
    if (score < 100) return { label: "Pejuang Minim Sampah", target: 100 };
    if (score < 150) return { label: "Pembuat Dampak", target: 150 };
    if (score < 250) return { label: "Penggerak Komunitas", target: 250 };
    if (score < 500) return { label: "Juara Regeneratif", target: 500 };

    return { label: "Level Maksimum", target: 500 };
}

export function ScoreProgressChart({ score, level }: ScoreProgressChartProps) {
    const progress = Math.min(Math.round((score / MAX_SCORE) * 100), 100);
    const nextMilestone = getNextMilestone(score);
    const remaining = Math.max(nextMilestone.target - score, 0);

    const radialData = [
        {
            name: "Score",
            value: progress,
            fill: "#10b981",
        },
    ];

    const milestones = [
        { label: "50", name: "Pemula", active: score >= 50 },
        { label: "100", name: "Minim Sampah", active: score >= 100 },
        { label: "150", name: "Dampak", active: score >= 150 },
        { label: "250", name: "Komunitas", active: score >= 250 },
        { label: "500", name: "Juara", active: score >= 500 },
    ];

    return (
        <Card className="w-full min-w-0 overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 pb-4 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <Award className="size-5" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                            Score Progress
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs leading-5 dark:text-slate-400 sm:text-sm">
                            Progress regenerative score dan level pengguna.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="min-w-0 space-y-5 px-4 pt-5 pb-4 sm:px-6">
                <div className="grid min-w-0 items-center gap-5 md:grid-cols-[170px_1fr]">
                    <div className="relative mx-auto size-[160px] sm:size-[190px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="76%"
                                outerRadius="100%"
                                barSize={14}
                                data={radialData}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <PolarAngleAxis
                                    type="number"
                                    domain={[0, 100]}
                                    tick={false}
                                />
                                <RadialBar
                                    dataKey="value"
                                    cornerRadius={999}
                                    background={{
                                        fill: "rgba(16,185,129,0.18)",
                                    }}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground dark:text-slate-400">
                                Score
                            </p>
                            <p className="mt-1 text-3xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50 sm:text-4xl">
                                {score}
                            </p>
                            <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                {progress}%
                            </p>
                        </div>
                    </div>

                    <div className="min-w-0 space-y-4">
                        <div className="min-w-0">
                            <Badge className="max-w-full bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-300">
                                <Sparkles className="mr-1.5 size-3 shrink-0" />
                                <span className="truncate">{level}</span>
                            </Badge>

                            <h3 className="mt-3 break-words text-xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50 sm:text-2xl">
                                {remaining === 0
                                    ? "Level tertinggi terbuka"
                                    : `${remaining} pts lagi`}
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground dark:text-slate-400">
                                {remaining === 0
                                    ? "Kamu sudah mencapai milestone tertinggi saat ini."
                                    : `Menuju ${nextMilestone.label}. Selesaikan action dan challenge untuk menaikkan score.`}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]">
                            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-emerald-950 dark:text-emerald-50">
                                <span>Progress ke Juara Regeneratif</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-white/10">
                                <div
                                    className="h-full rounded-full bg-emerald-950 transition-all dark:bg-emerald-300"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid min-w-0 gap-2 sm:grid-cols-5">
                    {milestones.map((milestone) => (
                        <div
                            key={milestone.label}
                            className={
                                milestone.active
                                    ? "rounded-2xl border border-emerald-900/10 bg-emerald-950 p-3 text-white transition-colors dark:border-emerald-300/20 dark:bg-emerald-300 dark:text-emerald-950"
                                    : "rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-3 text-emerald-950 transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                            }
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-semibold">{milestone.label}</p>
                                {milestone.active ? (
                                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-300 dark:text-emerald-950" />
                                ) : (
                                    <Crown className="size-3.5 shrink-0 text-emerald-700/60 dark:text-slate-500" />
                                )}
                            </div>
                            <p
                                className={
                                    milestone.active
                                        ? "mt-1 text-[11px] leading-4 text-emerald-50/75 dark:text-emerald-950/70"
                                        : "mt-1 text-[11px] leading-4 text-muted-foreground dark:text-slate-500"
                                }
                            >
                                {milestone.name}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}