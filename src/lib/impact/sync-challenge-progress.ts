import { prisma } from "@/lib/prisma";
import {
    calculateChallengeProgress,
    roundProgress,
} from "@/lib/impact/challenge-progress";

export async function syncChallengeProgress(userId: string) {
    const participants = await prisma.challengeParticipant.findMany({
        where: {
            userId,
        },
        include: {
            challenge: true,
        },
    });

    if (participants.length === 0) {
        return [];
    }

    const completedActions = await prisma.userAction.findMany({
        where: {
            userId,
            status: {
                in: ["COMPLETED", "VERIFIED"],
            },
        },
        include: {
            action: true,
            impactEstimation: true,
        },
    });

    const updatedParticipants = [];

    for (const participant of participants) {
        const rawProgress = calculateChallengeProgress({
            challengeType: participant.challenge.type,
            completedActions,
        });

        const progressValue = roundProgress(rawProgress);

        const progressStatus =
            progressValue >= participant.challenge.targetValue
                ? "COMPLETED"
                : progressValue > 0
                    ? "IN_PROGRESS"
                    : "JOINED";

        const updated = await prisma.challengeParticipant.update({
            where: {
                id: participant.id,
            },
            data: {
                progressValue,
                progressStatus,
            },
            include: {
                challenge: true,
            },
        });

        updatedParticipants.push(updated);
    }

    return updatedParticipants;
}