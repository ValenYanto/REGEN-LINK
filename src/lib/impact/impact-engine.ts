import type { EnergyRecord, WasteRecord } from "@prisma/client";
import { WasteManagementStatus, WasteType } from "@prisma/client";

export type ImpactEstimate = {
    estimatedEnergySavedKwh: number;
    estimatedWasteReducedKg: number;
    estimatedCo2ReducedKg: number;
    estimatedCostSaved: number;
    scoreIncrement: number;
};

const CO2_PER_KWH_KG = 0.85;
const CO2_PER_WASTE_KG = 0.45;

function round(value: number) {
    return Math.round(value * 100) / 100;
}

export function calculateEnergyImpact(
    energyRecord: EnergyRecord | null
): ImpactEstimate {
    if (!energyRecord) {
        return {
            estimatedEnergySavedKwh: 0,
            estimatedWasteReducedKg: 0,
            estimatedCo2ReducedKg: 0,
            estimatedCostSaved: 0,
            scoreIncrement: 0,
        };
    }

    const usage = energyRecord.monthlyKwh;
    const cost = energyRecord.electricityCost;

    let savingRate = 0.05;

    if (usage >= 350) savingRate = 0.14;
    else if (usage >= 250) savingRate = 0.1;
    else if (usage >= 150) savingRate = 0.07;

    const estimatedEnergySavedKwh = usage * savingRate;
    const estimatedCostSaved = cost * savingRate;
    const estimatedCo2ReducedKg = estimatedEnergySavedKwh * CO2_PER_KWH_KG;

    return {
        estimatedEnergySavedKwh: round(estimatedEnergySavedKwh),
        estimatedWasteReducedKg: 0,
        estimatedCo2ReducedKg: round(estimatedCo2ReducedKg),
        estimatedCostSaved: round(estimatedCostSaved),
        scoreIncrement: Math.max(8, Math.round(estimatedEnergySavedKwh / 2)),
    };
}

export function calculateWasteImpact(
    wasteRecord: WasteRecord | null
): ImpactEstimate {
    if (!wasteRecord) {
        return {
            estimatedEnergySavedKwh: 0,
            estimatedWasteReducedKg: 0,
            estimatedCo2ReducedKg: 0,
            estimatedCostSaved: 0,
            scoreIncrement: 0,
        };
    }

    const weight = wasteRecord.weightKg;

    let reductionRate = 0.08;

    if (wasteRecord.wasteType === WasteType.FOOD) reductionRate = 0.25;
    if (wasteRecord.wasteType === WasteType.PLASTIC) reductionRate = 0.18;
    if (wasteRecord.wasteType === WasteType.ORGANIC) reductionRate = 0.3;

    if (
        [
            WasteManagementStatus.SORTED,
            WasteManagementStatus.RECYCLED,
            WasteManagementStatus.COMPOSTED,
            WasteManagementStatus.DONATED,
            WasteManagementStatus.SENT_TO_WASTE_BANK,
            WasteManagementStatus.OTHER,
            WasteManagementStatus.NOT_SORTED,
        ].includes(wasteRecord.managementStatus)
    ) {
        reductionRate += 0.08;
    }

    const estimatedWasteReducedKg = weight * reductionRate;
    const estimatedCo2ReducedKg = estimatedWasteReducedKg * CO2_PER_WASTE_KG;

    return {
        estimatedEnergySavedKwh: 0,
        estimatedWasteReducedKg: round(estimatedWasteReducedKg),
        estimatedCo2ReducedKg: round(estimatedCo2ReducedKg),
        estimatedCostSaved: 0,
        scoreIncrement: Math.max(10, Math.round(estimatedWasteReducedKg * 6)),
    };
}

export function combineImpactEstimates(
    estimates: ImpactEstimate[]
): ImpactEstimate {
    return estimates.reduce(
        (total, estimate) => ({
            estimatedEnergySavedKwh: round(
                total.estimatedEnergySavedKwh + estimate.estimatedEnergySavedKwh
            ),
            estimatedWasteReducedKg: round(
                total.estimatedWasteReducedKg + estimate.estimatedWasteReducedKg
            ),
            estimatedCo2ReducedKg: round(
                total.estimatedCo2ReducedKg + estimate.estimatedCo2ReducedKg
            ),
            estimatedCostSaved: round(
                total.estimatedCostSaved + estimate.estimatedCostSaved
            ),
            scoreIncrement: total.scoreIncrement + estimate.scoreIncrement,
        }),
        {
            estimatedEnergySavedKwh: 0,
            estimatedWasteReducedKg: 0,
            estimatedCo2ReducedKg: 0,
            estimatedCostSaved: 0,
            scoreIncrement: 0,
        }
    );
}

export function getLevelFromScore(score: number) {
    if (score >= 500) return "Regenerative Champion";
    if (score >= 300) return "Impact Builder";
    if (score >= 150) return "Green Catalyst";
    if (score >= 50) return "Sprout";
    return "Seed";
}