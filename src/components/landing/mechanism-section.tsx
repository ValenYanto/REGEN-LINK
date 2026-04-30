import {
    CircleGauge,
    Database,
    Plus,
    ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const phaseOne = {
    icon: Database,
    phase: "Phase 01",
    title: "Multi-Stream Input",
    description:
        "Collect electricity usage, waste records, community surveys, and proof of action into one clean data stream.",
    code: [
        "> energy_record: monthly_kwh",
        "> waste_stream: food/plastic",
        "> proof_status: verified",
        "> data_quality: high_fidelity",
    ],
};

const phaseThree = {
    icon: ShieldCheck,
    phase: "Phase 03",
    title: "Verified Impact",
    description:
        "Track regenerative progress through impact estimation, proof validation, and transparent climate metrics.",
};

const recommendations = [
    "Optimize Energy Usage",
    "Divert Organic Waste",
    "Peak Demand Shift",
];

const impactCards = [
    {
        city: "BOGOR_NODE",
        title: "Energy Efficiency",
        value: "24.2 kWh",
    },
    {
        city: "BANDUNG_NODE",
        title: "Circular Waste",
        value: "5.8 kg",
    },
];

export function MechanismSection() {
    return (
        <section id="network" className="bg-[#f3f7fa]">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-black tracking-[-0.05em] text-[#1d2939]">
                        Mechanism of Agency
                    </h2>
                    <p className="mt-5 text-base leading-7 text-[#667085]">
                        Our tri-phase process turns raw climate data into structured
                        regenerative action for communities, campuses, city networks, and
                        private partners.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.95fr]">
                    <PhaseCard card={phaseOne} />

                    <Card className="dark-glow noise overflow-hidden rounded-xl border-0 p-0 text-white">
                        <CardContent className="relative z-10 p-8">
                            <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-full bg-[#00a66a]/25 text-[#06d69e]">
                                <CircleGauge size={22} />
                            </div>

                            <h3 className="text-3xl font-black tracking-[-0.04em] text-[#06d69e]">
                                Phase 02: AI Recommendations
                            </h3>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-[#b9c2d0]">
                                Our recommendation engine analyzes user behavior, energy usage,
                                waste profile, city benchmarks, and previous actions to
                                prescribe high-efficiency interventions.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {recommendations.map((item) => (
                                    <Badge
                                        key={item}
                                        variant="outline"
                                        className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/10"
                                    >
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6 rounded-xl border-[#d0d5dd] bg-white shadow-none">
                    <CardContent className="grid gap-6 p-8 lg:grid-cols-[0.65fr_1.35fr]">
                        <PhaseCard card={phaseThree} simple />

                        <div className="grid gap-4 md:grid-cols-3">
                            {impactCards.map((item) => (
                                <Card
                                    key={item.city}
                                    className="relative min-h-[190px] overflow-hidden rounded-lg border-[#d0d5dd] bg-[#101828] p-0"
                                >
                                    <CardContent className="p-0">
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-black/60" />

                                        <div className="absolute inset-x-0 bottom-0 p-4">
                                            <Badge className="rounded bg-[#101828]/80 px-2 py-1 text-[10px] font-black text-white hover:bg-[#101828]/80">
                                                {item.city}
                                            </Badge>

                                            <p className="mt-3 text-sm font-bold text-white">
                                                {item.title}
                                            </p>
                                            <p className="text-2xl font-black text-white">
                                                {item.value}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card className="flex min-h-[190px] items-center justify-center rounded-lg border-2 border-dashed border-[#06d69e] bg-[#dff8ec] shadow-none">
                                <CardContent className="flex items-center justify-center p-0">
                                    <Plus size={42} className="text-[#06d69e]" />
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

function PhaseCard({
    card,
    simple = false,
}: {
    card: {
        icon: React.ElementType;
        phase: string;
        title: string;
        description: string;
        code?: string[];
    };
    simple?: boolean;
}) {
    const Icon = card.icon;

    if (simple) {
        return (
            <div>
                <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf3] text-[#00a66a]">
                    <Icon size={22} />
                </div>

                <h3 className="text-xl font-black tracking-[-0.03em] text-[#1d2939]">
                    {card.phase}: {card.title}
                </h3>

                <p className="mt-5 text-base leading-7 text-[#667085]">
                    {card.description}
                </p>
            </div>
        );
    }

    return (
        <Card className="rounded-xl border-[#d0d5dd] bg-white shadow-none">
            <CardContent className="p-8">
                <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf3] text-[#00a66a]">
                    <Icon size={22} />
                </div>

                <h3 className="text-xl font-black tracking-[-0.03em] text-[#1d2939]">
                    {card.phase}: {card.title}
                </h3>

                <p className="mt-5 text-base leading-7 text-[#667085]">
                    {card.description}
                </p>

                {card.code && (
                    <Card className="mt-6 rounded-lg border-0 bg-[#f2f4f7] shadow-none">
                        <CardContent className="p-4 font-mono text-xs leading-6 text-[#475467]">
                            {card.code.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}