import { ReactNode } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type OverviewProgressPanelProps = {
    title: string;
    description: string;
    value: string;
    caption: string;
    progress: number;
    icon: ReactNode;
};

export function OverviewProgressPanel({
    title,
    description,
    value,
    caption,
    progress,
    icon,
}: OverviewProgressPanelProps) {
    const safeProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <Card className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 transition-colors duration-200 dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08]">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-300">
                        {icon}
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-base text-emerald-950 dark:text-emerald-50">
                            {title}
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                            {description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                <p className="text-3xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
                    {value}
                </p>

                <p className="mt-1 text-sm text-muted-foreground dark:text-slate-400">
                    {caption}
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10">
                    <div
                        className="h-full rounded-full bg-emerald-950 transition-all dark:bg-emerald-300"
                        style={{
                            width: `${safeProgress}%`,
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
