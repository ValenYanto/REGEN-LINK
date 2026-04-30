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
        <div className="rounded-3xl border border-emerald-900/10 bg-white/90 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-emerald-950">
                        {value}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {caption}
                    </p>
                </div>

                <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                    {icon}
                </div>
            </div>
        </div>
    );
}