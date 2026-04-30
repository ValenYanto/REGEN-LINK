import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type EnergyRecordRow = {
    id: string;
    monthlyKwh: number;
    electricityCost: number;
    housingType: string;
    occupants: number;
    dominantDevices: string;
    recordDate: Date;
};

type EnergyRecordsTableProps = {
    records: EnergyRecordRow[];
};

const housingLabels: Record<string, string> = {
    KOS: "Kos",
    HOUSE: "Rumah",
    APARTMENT: "Apartemen",
    DORMITORY: "Asrama",
    UMKM: "UMKM",
    OTHER: "Lainnya",
};

export function EnergyRecordsTable({ records }: EnergyRecordsTableProps) {
    return (
        <Card className="border-emerald-900/10 bg-white/90 shadow-sm">
            <CardHeader className="space-y-1 px-4 py-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">
                    Riwayat Energi
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Riwayat pencatatan konsumsi listrik bulanan kamu.
                </CardDescription>
            </CardHeader>

            <CardContent className="px-4 pb-4 sm:px-6">
                {records.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-emerald-50/40 p-6 text-center sm:p-8">
                        <p className="text-sm font-medium text-emerald-950">
                            Belum ada catatan energi.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Tambahkan data pertama untuk mulai membangun profil efisiensi.
                        </p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto rounded-2xl border border-emerald-900/10">
                        <Table className="min-w-[760px]">
                            <TableHeader>
                                <TableRow className="bg-emerald-50/50">
                                    <TableHead className="whitespace-nowrap">Tanggal</TableHead>
                                    <TableHead className="whitespace-nowrap">kWh</TableHead>
                                    <TableHead className="whitespace-nowrap">Biaya</TableHead>
                                    <TableHead className="whitespace-nowrap">Hunian</TableHead>
                                    <TableHead className="whitespace-nowrap">Penghuni</TableHead>
                                    <TableHead className="whitespace-nowrap">Perangkat Dominan</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Intl.DateTimeFormat("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }).format(record.recordDate)}
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap font-medium text-emerald-950">
                                            {record.monthlyKwh.toLocaleString("id-ID")} kWh
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap">
                                            Rp{" "}
                                            {record.electricityCost.toLocaleString("id-ID", {
                                                maximumFractionDigits: 0,
                                            })}
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap">
                                            <Badge variant="secondary">
                                                {housingLabels[record.housingType] ?? record.housingType}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap">
                                            {record.occupants}
                                        </TableCell>

                                        <TableCell>
                                            <p className="max-w-[260px] truncate">
                                                {record.dominantDevices}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}