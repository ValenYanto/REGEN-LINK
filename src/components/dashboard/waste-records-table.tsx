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
    FOOD: "Makanan",
    PLASTIC: "Plastik",
    PAPER: "Kertas",
    ORGANIC: "Organik",
    METAL: "Logam",
    GLASS: "Kaca",
    MIXED: "Campuran",
    OTHER: "Lainnya",
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
        <Card className="border-emerald-900/10 bg-white/90 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <CardHeader className="space-y-1 border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60 px-4 py-4 transition-colors dark:border-white/10 dark:from-white/[0.08] dark:to-emerald-400/[0.08] sm:px-6">
                <CardTitle className="text-base text-emerald-950 dark:text-emerald-50 sm:text-lg">
                    Riwayat Limbah
                </CardTitle>
                <CardDescription className="text-xs dark:text-slate-400 sm:text-sm">
                    Riwayat pencatatan limbah dan status pengelolaannya.
                </CardDescription>
            </CardHeader>

            <CardContent className="px-4 pb-4 pt-4 sm:px-6">
                {records.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-emerald-50/40 p-6 text-center transition-colors dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
                        <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50">
                            Belum ada catatan limbah.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                            Tambahkan data pertama untuk mulai membaca pola circular action.
                        </p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto rounded-2xl border border-emerald-900/10 dark:border-white/10">
                        <Table className="min-w-[700px]">
                            <TableHeader>
                                <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50 dark:bg-white/[0.05] dark:hover:bg-white/[0.05]">
                                    <TableHead className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                                        Tanggal
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                                        Jenis
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                                        Berat
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                                        Sumber
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {records.map((record) => (
                                    <TableRow
                                        key={record.id}
                                        className="dark:border-white/10 dark:hover:bg-white/[0.04]"
                                    >
                                        <TableCell className="whitespace-nowrap text-slate-700 dark:text-slate-300">
                                            {new Intl.DateTimeFormat("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }).format(record.recordDate)}
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap">
                                            <Badge
                                                variant="secondary"
                                                className="dark:bg-white/10 dark:text-slate-200"
                                            >
                                                {wasteLabels[record.wasteType] ?? record.wasteType}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap font-medium text-emerald-950 dark:text-emerald-50">
                                            {record.weightKg.toLocaleString("id-ID")} kg
                                        </TableCell>

                                        <TableCell className="text-slate-700 dark:text-slate-300">
                                            <p className="max-w-[260px] truncate">
                                                {record.wasteSource}
                                            </p>
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap">
                                            <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-300">
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