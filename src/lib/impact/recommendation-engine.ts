import type { EnergyRecord, WasteRecord } from "@prisma/client";
import { WasteManagementStatus, WasteType } from "@prisma/client";

export type RecommendationCandidate = {
    actionName: string;
    reason: string;
    confidenceScore: number;
    source: "ENERGY" | "WASTE";
};

export function generateRecommendationCandidates({
    energyRecord,
    wasteRecord,
}: {
    energyRecord: EnergyRecord | null;
    wasteRecord: WasteRecord | null;
}): RecommendationCandidate[] {
    const recommendations: RecommendationCandidate[] = [];

    if (energyRecord) {
        if (energyRecord.monthlyKwh >= 250) {
            recommendations.push({
                actionName: "Reduce Standby Power",
                reason:
                    "Konsumsi listrik bulanan kamu cukup tinggi. Mengurangi standby power dapat menjadi aksi cepat dengan dampak langsung.",
                confidenceScore: 0.86,
                source: "ENERGY",
            });

            recommendations.push({
                actionName: "Schedule High-Power Device Usage",
                reason:
                    "Data energi menunjukkan potensi optimasi pada perangkat dominan. Penjadwalan perangkat berdaya tinggi dapat menekan biaya listrik.",
                confidenceScore: 0.78,
                source: "ENERGY",
            });
        } else {
            recommendations.push({
                actionName: "Reduce Standby Power",
                reason:
                    "Konsumsi listrik kamu masih dalam rentang moderat. Aksi ringan seperti mematikan perangkat standby dapat menjaga efisiensi.",
                confidenceScore: 0.68,
                source: "ENERGY",
            });
        }
    }

    if (wasteRecord) {
        if (wasteRecord.wasteType === WasteType.FOOD) {
            recommendations.push({
                actionName: "Food Waste Planning",
                reason:
                    "Limbah dominan kamu adalah food waste. Perencanaan konsumsi dapat mengurangi sisa makanan dari sumbernya.",
                confidenceScore: 0.88,
                source: "WASTE",
            });

            recommendations.push({
                actionName: "Organic Composting",
                reason:
                    "Food waste dan limbah organik cocok diarahkan ke kompos untuk mengurangi beban sampah dan emisi.",
                confidenceScore: 0.8,
                source: "WASTE",
            });
        }

        if (
            wasteRecord.wasteType === WasteType.PLASTIC ||
            wasteRecord.managementStatus === WasteManagementStatus.SORTED
        ) {
            recommendations.push({
                actionName: "Send Sorted Waste to Waste Bank",
                reason:
                    "Data limbah menunjukkan adanya potensi pemilahan dan pengiriman ke bank sampah atau mitra daur ulang.",
                confidenceScore: 0.82,
                source: "WASTE",
            });
        }

        if (wasteRecord.managementStatus === WasteManagementStatus.NOT_SORTED) {
            recommendations.push({
                actionName: "Send Sorted Waste to Waste Bank",
                reason:
                    "Status limbah masih belum dipilah. Mulai dari pemilahan dasar agar circular action lebih terukur.",
                confidenceScore: 0.76,
                source: "WASTE",
            });
        }
    }

    if (recommendations.length === 0) {
        recommendations.push({
            actionName: "Community Climate Challenge",
            reason:
                "Belum cukup sinyal spesifik dari data terbaru. Mulai dari challenge komunitas untuk membangun kebiasaan aksi iklim.",
            confidenceScore: 0.6,
            source: "ENERGY",
        });
    }

    const unique = new Map<string, RecommendationCandidate>();

    for (const recommendation of recommendations) {
        const existing = unique.get(recommendation.actionName);

        if (!existing || recommendation.confidenceScore > existing.confidenceScore) {
            unique.set(recommendation.actionName, recommendation);
        }
    }

    return Array.from(unique.values()).slice(0, 3);
}