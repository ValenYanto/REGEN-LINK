import type { Action, ImpactEstimation } from "@prisma/client";

import { DifficultyLevel } from "@prisma/client";

export function getActionCompletionScore({
    action,
    impactEstimation,
}: {
    action: Action;
    impactEstimation: ImpactEstimation | null;
}) {
    let difficultyBonus = 0;

    if (action.difficultyLevel === DifficultyLevel.EASY) difficultyBonus = 5;
    if (action.difficultyLevel === DifficultyLevel.MEDIUM) difficultyBonus = 12;
    if (action.difficultyLevel === DifficultyLevel.HARD) difficultyBonus = 22;

    const impactBonus = Math.round(
        (impactEstimation?.estimatedEnergySavedKwh ?? 0) * 0.3 +
        (impactEstimation?.estimatedWasteReducedKg ?? 0) * 2 +
        (impactEstimation?.estimatedCo2ReducedKg ?? 0) * 0.5
    );

    return Math.max(10, Math.round(action.baseImpactScore + difficultyBonus + impactBonus));
}