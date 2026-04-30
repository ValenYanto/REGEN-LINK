import { Card, CardContent } from "@/components/ui/card";

const stats = [
    {
        value: "12.4k",
        label: "Metric Tons Carbon Offset",
    },
    {
        value: "42",
        label: "Partner Cities",
    },
    {
        value: "85%",
        label: "Circular Efficiency",
    },
    {
        value: "3.2M",
        label: "Links Established",
    },
];

export function StatsSection() {
    return (
        <section className="border-b border-[#eef2f6] bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4 lg:px-8">
                {stats.map((item) => (
                    <Card
                        key={item.label}
                        className="border-transparent bg-transparent text-center shadow-none"
                    >
                        <CardContent className="p-0">
                            <p className="text-3xl font-black tracking-[-0.04em] text-[#101828]">
                                {item.value}
                            </p>
                            <p className="mt-1 text-xs font-black tracking-[0.12em] text-[#667085]">
                                {item.label}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}