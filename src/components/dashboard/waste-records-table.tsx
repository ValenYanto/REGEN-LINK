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

type WasteRecordRow = {
    id: string;
    wasteType: string;
    weightKg: number;
    wasteSource: string;
    managementStatus: string;
    recordDate: Date;
};

type WasteRecordsTableProps = {
    records: WasteRecordRow[];
};

const wasteLabels: Record<string, string> = {
    FOOD: "Food",
    PLASTIC: "Plastic",
    PAPER: "Paper",
    ORGANIC: "Organic",
    METAL: "Metal",
    GLASS: "Glass",
    MIXED: "Mixed",
    OTHER: "Other",
};
const statusLabels: Record<string, string> = {
    NOT_SORTED: "Belum Dipilah",
    SORTED: "Dipilah",
    RECYCLED: "Daur Ulang",
    COMPOSTED: "Kompos",
    DONATED: "Donasi",
    SENT_TO_WASTE_BANK: "Bank Sampah",
    OTHER: "Lainnya",
};

export function WasteRecordsTable({ records }: WasteRecordsTableProps) {
    return (
        <Card className="border-emerald-900/10 bg-white/90 shadow-sm">
            <CardHeader>
                <CardTitle>Waste History</CardTitle>
                <CardDescription>
                    Riwayat pencatatan limbah dan status pengelolaannya.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {records.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-emerald-50/40 p-8 text-center">
                        <p className="text-sm font-medium text-emerald-950">
                            Belum ada waste record.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Tambahkan data pertama untuk mulai membaca pola circular action.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Status</TableHead>
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
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {wasteLabels[record.wasteType] ?? record.wasteType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {record.weightKg.toLocaleString("id-ID")} kg
                                        </TableCell>
                                        <TableCell className="max-w-[220px] truncate">
                                            {record.wasteSource}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950">
                                                {statusLabels[record.managementStatus] ??
                                                    record.managementStatus}
                                            </Badge>
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