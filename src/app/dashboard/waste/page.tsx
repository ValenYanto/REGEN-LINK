import { redirect } from "next/navigation";
import { Leaf, Recycle, Scale, Trash2 } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardMetricCard } from "@/components/dashboard/dashboard-metric-card";
import { WasteRecordForm } from "@/components/dashboard/waste-record-form";
import { WasteRecordsTable } from "@/components/dashboard/waste-records-table";
import { InputCenterPanel } from "@/components/dashboard/input-center-panel";

export default async function WastePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const records = await prisma.wasteRecord.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            recordDate: "desc",
        },
        take: 20,
    });

    const totalWasteKg = records.reduce(
        (total, record) => total + record.weightKg,
        0
    );

    const managedRecords = records.filter((record) =>
        ["SORTED", "RECYCLED", "COMPOSTED", "DONATED", "SENT_TO_WASTE_BANK"].includes(
            record.managementStatus
        )
    ).length;

    const managedRate =
        records.length > 0 ? Math.round((managedRecords / records.length) * 100) : 0;

    const latestRecord = records[0];

    return (
        <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
            <section className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-[#f7faf6] p-4 shadow-sm sm:p-5 md:rounded-[2rem] md:p-8">
                <div className="absolute right-[-120px] top-[-120px] size-80 rounded-full bg-emerald-200/50 blur-3xl" />
                <div className="absolute bottom-[-160px] left-[20%] size-80 rounded-full bg-lime-200/40 blur-3xl" />

                <div className="relative grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex items-center rounded-full border border-emerald-900/10 bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                            <Recycle className="mr-1.5 size-3.5" />
                            Circular Waste Action Module
                        </div>

                        <h1 className="max-w-3xl break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl md:text-5xl">
                            Waste Input Center
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                            Catat jenis limbah, berat, sumber, dan status pengelolaan untuk
                            membangun pola circular action yang bisa dihitung dampaknya.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                            Latest Signal
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-emerald-950">
                            {latestRecord
                                ? `${latestRecord.weightKg.toLocaleString("id-ID")} kg`
                                : "No data"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            {latestRecord
                                ? "Record limbah terakhir berhasil tersimpan."
                                : "Tambahkan record pertama untuk memulai analisis."}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid min-w-0 gap-4 md:grid-cols-3">
                <DashboardMetricCard
                    label="Total Waste Recorded"
                    value={`${totalWasteKg.toLocaleString("id-ID")} kg`}
                    caption="Akumulasi limbah tercatat"
                    icon={<Scale className="size-5" />}
                />

                <DashboardMetricCard
                    label="Circular Action Rate"
                    value={`${managedRate}%`}
                    caption="Record dengan status terkelola"
                    icon={<Recycle className="size-5" />}
                />

                <DashboardMetricCard
                    label="Waste Entries"
                    value={records.length.toString()}
                    caption="Jumlah record yang masuk"
                    icon={<Leaf className="size-5" />}
                />
            </section>

            <section className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <div className="min-w-0 space-y-6">
                    <WasteRecordForm />
                    <WasteRecordsTable records={records} />
                </div>

                <InputCenterPanel
                    title="Circular Intelligence"
                    subtitle="Sistem membaca tipe limbah, berat, sumber, dan status pengelolaan untuk menyiapkan rekomendasi aksi sirkular."
                    scoreLabel="Circular Readiness"
                    scoreValue={`${managedRate}%`}
                    scoreCaption="Rasio record yang sudah masuk kategori terkelola."
                    highlights={[
                        {
                            label: "Records",
                            value: records.length.toString(),
                            description:
                                "Jumlah catatan limbah yang sudah tersimpan untuk user ini.",
                        },
                        {
                            label: "Managed",
                            value: managedRecords.toString(),
                            description:
                                "Record yang masuk status sorted, recycled, composted, donated, atau bank sampah.",
                        },
                        {
                            label: "Next Phase",
                            value: "Impact",
                            description:
                                "Data ini akan dipakai untuk estimasi waste reduced dan CO₂ avoided.",
                        },
                    ]}
                >
                    <div className="flex gap-3">
                        <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-orange-100 text-orange-800">
                            <Trash2 className="size-4" />
                        </div>
                        <div>
                            <p className="font-medium text-emerald-950">
                                Waste profile detection
                            </p>
                            <p className="text-xs leading-5 text-muted-foreground">
                                Sistem akan membaca jenis limbah dominan untuk rekomendasi
                                circular action berikutnya.
                            </p>
                        </div>
                    </div>
                </InputCenterPanel>
            </section>
        </div>
    );
}