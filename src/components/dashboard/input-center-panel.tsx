import { ReactNode } from "react";
import { ArrowUpRight, CheckCircle2, CircleDot, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type InputCenterPanelProps = {
    title: string;
    subtitle: string;
    scoreLabel: string;
    scoreValue: string;
    scoreCaption: string;
    highlights: {
        label: string;
        value: string;
        description: string;
    }[];
    children?: ReactNode;
};

export function InputCenterPanel({
    title,
    subtitle,
    scoreLabel,
    scoreValue,
    scoreCaption,
    highlights,
    children,
}: InputCenterPanelProps) {
    const isActive =
        scoreValue.toLowerCase() === "active" ||
        scoreValue.toLowerCase() === "strong";

    return (
        <aside className="min-w-0 space-y-5">
            <Card className="overflow-hidden border-emerald-900/10 bg-[#f7faf6] shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                <CardHeader className="relative border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/70 pb-4 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                    <div className="absolute right-[-60px] top-[-70px] size-44 rounded-full bg-emerald-200/60 blur-3xl dark:bg-emerald-400/10" />
                    <div className="absolute bottom-[-80px] left-[-70px] size-44 rounded-full bg-lime-200/50 blur-3xl dark:bg-lime-300/10" />

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <Badge className="mb-4 border-emerald-200 bg-white text-emerald-800 shadow-sm hover:bg-white dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                                <Sparkles className="mr-1.5 size-3" />
                                Live Climate Signal
                            </Badge>

                            <CardTitle className="text-xl text-emerald-950 dark:text-emerald-50">
                                {title}
                            </CardTitle>

                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                {subtitle}
                            </p>
                        </div>

                        <div className="shrink-0 rounded-2xl border border-emerald-900/10 bg-white/80 p-2 text-emerald-700 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-300 dark:shadow-none">
                            <ArrowUpRight className="size-4" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="relative p-5">
                    <div className="rounded-3xl border border-emerald-900/10 bg-white/80 p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            {scoreLabel}
                        </p>

                        <div className="mt-3 flex items-end gap-2">
                            <p className="text-4xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
                                {scoreValue}
                            </p>
                        </div>

                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {scoreCaption}
                        </p>

                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 shadow-[0_0_24px_rgba(16,185,129,0.30)] dark:from-emerald-300 dark:to-lime-300 dark:shadow-[0_0_24px_rgba(110,231,183,0.45)]"
                                style={{
                                    width: isActive ? "100%" : "42%",
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-emerald-900/10 bg-white/90 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                    <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                        Submission Intelligence
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pt-5">
                    {highlights.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                    {item.label}
                                </p>

                                <Badge
                                    variant="secondary"
                                    className="bg-white text-emerald-800 dark:bg-white/10 dark:text-emerald-200"
                                >
                                    {item.value}
                                </Badge>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-emerald-900/10 bg-white/90 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                    <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                        Activity Log
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 pt-5 text-sm">
                    <div className="flex gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
                            <CheckCircle2 className="size-4" />
                        </div>

                        <div className="min-w-0">
                            <p className="font-medium text-emerald-950 dark:text-emerald-50">
                                Data validation active
                            </p>
                            <p className="text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                Input akan divalidasi sebelum masuk ke PostgreSQL.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-lime-100 text-lime-800 dark:bg-lime-400/10 dark:text-lime-300">
                            <CircleDot className="size-4" />
                        </div>

                        <div className="min-w-0">
                            <p className="font-medium text-emerald-950 dark:text-emerald-50">
                                AI module prepared
                            </p>
                            <p className="text-xs leading-5 text-muted-foreground dark:text-slate-400">
                                Data ini akan dipakai untuk impact calculator dan rekomendasi.
                            </p>
                        </div>
                    </div>

                    {children}
                </CardContent>
            </Card>
        </aside>
    );
}