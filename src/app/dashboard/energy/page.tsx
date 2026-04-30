import { redirect } from "next/navigation";
import { Activity, Bolt, CircleDollarSign, Zap } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EnergyRecordForm } from "@/components/dashboard/energy-record-form";
import { EnergyRecordsTable } from "@/components/dashboard/energy-records-table";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { InputCenterPanel } from "@/components/dashboard/input-center-panel";

export default async function EnergyPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const records = await prisma.energyRecord.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            recordDate: "desc",
        },
        take: 20,
    });

    const totalKwh = records.reduce((total, record) => total + record.monthlyKwh, 0);

    const totalCost = records.reduce(
        (total, record) => total + record.electricityCost,
        0
    );

    const averageKwh = records.length > 0 ? totalKwh / records.length : 0;

    const latestRecord = records[0];

    return (
        <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm sm:p-5 md:rounded-[2rem] md:p-8">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl" />

                <div className="relative grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                            <Zap className="mr-1.5 size-3.5" />
                            Energy Efficiency Module
                        </div>

                        <h1 className="max-w-3xl break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl md:text-5xl">
                            Energy Input Center
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                            Ubah data konsumsi listrik bulanan menjadi telemetry yang siap
                            dianalisis untuk rekomendasi hemat energi, impact estimation, dan
                            regenerative score.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                            Latest Signal
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-emerald-950">
                            {latestRecord
                                ? `${latestRecord.monthlyKwh.toLocaleString("id-ID")} kWh`
                                : "No data"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            {latestRecord
                                ? "Record terakhir berhasil tersimpan di sistem."
                                : "Tambahkan record pertama untuk memulai analisis."}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 md:grid-cols-3">
                <DashboardMetricCard
                    label="Total Energy Recorded"
                    value={`${totalKwh.toLocaleString("id-ID")} kWh`}
                    caption="Akumulasi data energi"
                    icon={<Bolt className="size-5" />}
                />

                <DashboardMetricCard
                    label="Average Monthly Usage"
                    value={`${averageKwh.toLocaleString("id-ID", {
                        maximumFractionDigits: 1,
                    })} kWh`}
                    caption="Rata-rata konsumsi"
                    icon={<Activity className="size-5" />}
                />

                <DashboardMetricCard
                    label="Total Electricity Cost"
                    value={`Rp${totalCost.toLocaleString("id-ID", {
                        maximumFractionDigits: 0,
                    })}`}
                    caption="Estimasi biaya tercatat"
                    icon={<CircleDollarSign className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <div className="min-w-0 space-y-6">
                    <EnergyRecordForm />
                    <EnergyRecordsTable records={records} />
                </div>

                <InputCenterPanel
                    title="Energy Intelligence"
                    subtitle="Sistem membaca konsumsi listrik, biaya, tipe hunian, dan perangkat dominan untuk menyiapkan rekomendasi aksi."
                    scoreLabel="Input Readiness"
                    scoreValue={records.length > 0 ? "Active" : "Empty"}
                    scoreCaption={
                        records.length > 0
                            ? "Dataset energi sudah siap dipakai untuk phase AI recommendation."
                            : "Belum ada data energi yang bisa dianalisis."
                    }
                    highlights={[
                        {
                            label: "Records",
                            value: records.length.toString(),
                            description:
                                "Jumlah catatan energi yang sudah tersimpan untuk user ini.",
                        },
                        {
                            label: "AI Signal",
                            value: records.length >= 3 ? "Strong" : "Warming Up",
                            description:
                                "Semakin banyak record, semakin baik sistem membaca pola konsumsi.",
                        },
                        {
                            label: "Next Phase",
                            value: "Impact",
                            description:
                                "Data ini akan dipakai untuk estimasi kWh saved, CO₂ avoided, dan cost saving.",
                        },
                    ]}
                />
            </section>
        </div>
    );
}