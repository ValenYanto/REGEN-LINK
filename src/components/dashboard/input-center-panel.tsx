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
    return (
        <aside className="space-y-5">
            <Card className="overflow-hidden border-emerald-900/10 bg-emerald-950 text-white shadow-sm">
                <CardHeader className="relative pb-4">
                    <div className="absolute right-[-60px] top-[-70px] size-44 rounded-full bg-emerald-400/20 blur-3xl" />
                    <div className="absolute bottom-[-80px] left-[-70px] size-44 rounded-full bg-lime-300/10 blur-3xl" />

                    <div className="relative flex items-start justify-between gap-4">
                        <div>
                            <Badge className="mb-4 bg-emerald-300/15 text-emerald-100 hover:bg-emerald-300/15">
                                <Sparkles className="mr-1.5 size-3" />
                                Live Climate Signal
                            </Badge>
                            <CardTitle className="text-xl text-white">{title}</CardTitle>
                            <p className="mt-2 text-sm leading-6 text-emerald-50/70">
                                {subtitle}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-2">
                            <ArrowUpRight className="size-4 text-emerald-200" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="relative">
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/70">
                            {scoreLabel}
                        </p>
                        <div className="mt-3 flex items-end gap-2">
                            <p className="text-4xl font-semibold tracking-tight">
                                {scoreValue}
                            </p>
                        </div>
                        <p className="mt-2 text-sm text-emerald-50/70">{scoreCaption}</p>

                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[72%] rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.65)]" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-emerald-900/10 bg-white/90 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Submission Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {highlights.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-emerald-950">
                                    {item.label}
                                </p>
                                <Badge
                                    variant="secondary"
                                    className="bg-white text-emerald-800"
                                >
                                    {item.value}
                                </Badge>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-emerald-900/10 bg-white/90 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Activity Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex gap-3">
                        <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="size-4" />
                        </div>
                        <div>
                            <p className="font-medium text-emerald-950">
                                Data validation active
                            </p>
                            <p className="text-xs leading-5 text-muted-foreground">
                                Input akan divalidasi sebelum masuk ke PostgreSQL.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-lime-100 text-lime-800">
                            <CircleDot className="size-4" />
                        </div>
                        <div>
                            <p className="font-medium text-emerald-950">
                                AI module prepared
                            </p>
                            <p className="text-xs leading-5 text-muted-foreground">
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