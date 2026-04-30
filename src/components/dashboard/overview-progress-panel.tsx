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
    return (
        <Card className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        {icon}
                    </div>
                    <div>
                        <CardTitle className="text-base">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                <p className="text-3xl font-semibold tracking-tight text-emerald-950">
                    {value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{caption}</p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div
                        className="h-full rounded-full bg-emerald-950 transition-all"
                        style={{
                            width: `${Math.min(Math.max(progress, 0), 100)}%`,
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}