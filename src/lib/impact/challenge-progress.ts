import { ChallengeType, type UserAction } from "@prisma/client";

type UserActionWithImpact = UserAction & {
    action: {
        category: string;
    };
    impactEstimation: {
        estimatedEnergySavedKwh: number;
        estimatedWasteReducedKg: number;
        estimatedCo2ReducedKg: number;
        estimatedCostSaved: number;
    } | null;
};

export function calculateChallengeProgress({
    challengeType,
    completedActions,
}: {
    challengeType: ChallengeType;
    completedActions: UserActionWithImpact[];
}) {
    if (completedActions.length === 0) {
        return 0;
    }

    if (challengeType === ChallengeType.ENERGY) {
        return completedActions.reduce(
            (total, item) =>
                total + (item.impactEstimation?.estimatedEnergySavedKwh ?? 0),
            0
        );
    }

    if (challengeType === ChallengeType.WASTE) {
        return completedActions.reduce(
            (total, item) =>
                total + (item.impactEstimation?.estimatedWasteReducedKg ?? 0),
            0
        );
    }

    if (challengeType === ChallengeType.CIRCULAR) {
        return completedActions.reduce(
            (total, item) =>
                total +
                (item.impactEstimation?.estimatedWasteReducedKg ?? 0) +
                (item.impactEstimation?.estimatedCo2ReducedKg ?? 0),
            0
        );
    }

    if (challengeType === ChallengeType.CROSS_CITY) {
        return completedActions.reduce(
            (total, item) =>
                total +
                (item.impactEstimation?.estimatedEnergySavedKwh ?? 0) +
                (item.impactEstimation?.estimatedWasteReducedKg ?? 0) +
                (item.impactEstimation?.estimatedCo2ReducedKg ?? 0),
            0
        );
    }

    if (challengeType === ChallengeType.COMMUNITY) {
        return completedActions.length;
    }

    return completedActions.length;
}

export function getChallengeProgressLabel(challengeType: ChallengeType) {
    if (challengeType === ChallengeType.ENERGY) return "kWh saved";
    if (challengeType === ChallengeType.WASTE) return "kg waste reduced";
    if (challengeType === ChallengeType.CIRCULAR) return "circular impact pts";
    if (challengeType === ChallengeType.CROSS_CITY) return "cross-city impact pts";
    if (challengeType === ChallengeType.COMMUNITY) return "completed actions";

    return "progress";
}

export function roundProgress(value: number) {
    return Math.round(value * 100) / 100;
}