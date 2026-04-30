import Link from "next/link";
import {
    ArrowRight,
    Leaf,
    Map,
    Recycle,
    Sparkles,
    Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function HeroSection() {
    return (
        <section className="hero-bg soft-grid border-b border-[#e4e7ec]">
            <div className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
                <div>
                    <Badge className="mb-8 gap-2 rounded-full bg-[#dff8ec] px-4 py-2 text-xs font-black text-[#007a4d] hover:bg-[#dff8ec]">
                        <Sparkles size={14} />
                        Collective Climate Action
                    </Badge>

                    <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.06em] text-[#1d2939] md:text-7xl">
                        Regenerative infrastructure{" "}
                        <span className="text-gradient">
                            linked by scientific clarity.
                        </span>
                    </h1>

                    <p className="mt-8 max-w-2xl text-base leading-8 text-[#667085] md:text-lg">
                        Empowering cities, communities, students, and UMKM to transition
                        toward circular waste systems and energy efficiency through
                        AI-driven insights, impact estimation, and cross-city climate
                        collaboration.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <Button
                            asChild
                            className="green-shadow h-auto rounded-lg bg-[#00a66a] px-8 py-4 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-[#008f5d]"
                        >
                            <Link href="/register">
                                Deploy New Entry
                                <ArrowRight size={18} />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className="h-auto rounded-lg border-2 border-[#101828] bg-transparent px-8 py-4 text-base font-black text-[#101828] transition hover:-translate-y-0.5 hover:bg-white"
                        >
                            <Link href="#network">
                                View Network Map
                                <Map size={18} />
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#06d69e]/20 blur-3xl" />
                    <div className="absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-[#007a4d]/10 blur-3xl" />

                    <Card className="card-shadow relative overflow-hidden rounded-2xl border-[#e4e7ec] bg-white p-0">
                        <CardContent className="p-8">
                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
                                    Real-Time Regen Score
                                </p>
                                <Leaf size={20} className="text-[#00a66a]" />
                            </div>

                            <div className="flex flex-wrap items-end gap-3">
                                <p className="text-6xl font-black tracking-[-0.05em] text-[#00a66a]">
                                    84.2
                                </p>
                                <p className="mb-3 text-sm font-black text-[#00a66a]">
                                    +4.1% vs prev. week
                                </p>
                            </div>

                            <Progress
                                value={84}
                                className="mt-8 h-2.5 bg-[#eef2f6] [&>div]:bg-[#06d69e]"
                            />

                            <div className="mt-6 space-y-3">
                                <ScoreLine label="Waste Recovery" value="92%" />
                                <ScoreLine label="Grid Efficiency" value="78%" />
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <MiniMetric
                                    icon={<Zap size={17} />}
                                    label="Energy Saved"
                                    value="24.2 kWh"
                                />
                                <MiniMetric
                                    icon={<Recycle size={17} />}
                                    label="Waste Reduced"
                                    value="5.8 kg"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

function ScoreLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#667085]">
                {label}
            </span>
            <span className="text-xs font-black text-[#667085]">{value}</span>
        </div>
    );
}

function MiniMetric({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <Card className="rounded-xl border-[#e4e7ec] bg-[#f9fafb] shadow-none">
            <CardContent className="p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#dff8ec] text-[#00a66a]">
                    {icon}
                </div>
                <p className="text-xs font-bold text-[#667085]">{label}</p>
                <p className="mt-1 text-lg font-black text-[#101828]">{value}</p>
            </CardContent>
        </Card>
    );
}