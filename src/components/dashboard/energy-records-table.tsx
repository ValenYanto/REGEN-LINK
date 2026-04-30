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
            <CardHeader>
                <CardTitle>Energy History</CardTitle>
                <CardDescription>
                    Riwayat pencatatan konsumsi listrik bulanan kamu.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {records.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-emerald-50/40 p-8 text-center">
                        <p className="text-sm font-medium text-emerald-950">
                            Belum ada energy record.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Tambahkan data pertama untuk mulai membangun profil efisiensi.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>kWh</TableHead>
                                    <TableHead>Cost</TableHead>
                                    <TableHead>Housing</TableHead>
                                    <TableHead>Occupants</TableHead>
                                    <TableHead>Devices</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>
                                            {new Intl.DateTimeFormat("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }).format(record.recordDate)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {record.monthlyKwh.toLocaleString("id-ID")} kWh
                                        </TableCell>
                                        <TableCell>
                                            Rp
                                            {record.electricityCost.toLocaleString("id-ID", {
                                                maximumFractionDigits: 0,
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {housingLabels[record.housingType] ?? record.housingType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{record.occupants}</TableCell>
                                        <TableCell className="max-w-[240px] truncate">
                                            {record.dominantDevices}
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