import { ReactNode } from "react";

type OverviewImpactCardProps = {
    label: string;
    value: string;
    caption: string;
    icon: ReactNode;
};

export function OverviewImpactCard({
    label,
    value,
    caption,
    icon,
}: OverviewImpactCardProps) {
    return (
        <div className="rounded-3xl border border-emerald-900/10 bg-white/90 p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground dark:text-slate-400">
                        {label}
                    </p>

                    <p className="mt-2 break-words text-xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
                        {value}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground dark:text-slate-400">
                        {caption}
                    </p>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 transition-colors duration-200 dark:bg-emerald-400/10 dark:text-emerald-300">
                    {icon}
                </div>
            </div>
        </div>
    );
}
