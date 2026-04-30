import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLevelFromScore } from "@/lib/impact/impact-engine";
import { getActionCompletionScore } from "@/lib/impact/action-score";
import { updateUserActionSchema } from "@/lib/valdiations/actions";
import { awardEligibleBadges } from "@/lib/impact/badge-engine";
import { syncChallengeProgress } from "@/lib/impact/sync-challenge-progress";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized. Please login first." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const parsed = updateUserActionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Invalid input.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const userId = session.user.id;
        const { id: userActionId } = await params;

        const existingAction = await prisma.userAction.findFirst({
            where: {
                id: userActionId,
                userId,
            },
            include: {
                action: true,
                impactEstimation: true,
            },
        });

        if (!existingAction) {
            return NextResponse.json(
                { message: "User action not found." },
                { status: 404 }
            );
        }

        const nextStatus = parsed.data.status;
        const wasCompleted = existingAction.status === "COMPLETED";
        const willBeCompleted = nextStatus === "COMPLETED";

        const updatedAction = await prisma.userAction.update({
            where: {
                id: userActionId,
            },
            data: {
                status: nextStatus,
                notes: parsed.data.notes || existingAction.notes,
                proofUrl: parsed.data.proofUrl || existingAction.proofUrl,
                completedAt: willBeCompleted ? new Date() : existingAction.completedAt,
            },
            include: {
                action: true,
                impactEstimation: true,
            },
        });

        let scoreIncrement = 0;

        let awardedBadges: Awaited<ReturnType<typeof awardEligibleBadges>> = [];

        if (!wasCompleted && willBeCompleted) {
            scoreIncrement = getActionCompletionScore({
                action: existingAction.action,
                impactEstimation: existingAction.impactEstimation,
            });

            const currentScore = await prisma.regenerativeScore.findUnique({
                where: {
                    userId,
                },
            });

            const nextScore = (currentScore?.totalScore ?? 0) + scoreIncrement;

            await prisma.regenerativeScore.upsert({
                where: {
                    userId,
                },
                update: {
                    totalScore: nextScore,
                    level: getLevelFromScore(nextScore),
                    updatedAt: new Date(),
                },
                create: {
                    userId,
                    totalScore: nextScore,
                    level: getLevelFromScore(nextScore),
                },
            });

            awardedBadges = await awardEligibleBadges(userId);
            await syncChallengeProgress(userId);
        }

        return NextResponse.json({
            message: "Action updated successfully.",
            action: updatedAction,
            scoreIncrement,
            awardedBadges,
        });
    } catch (error) {
        console.error("[USER_ACTION_PATCH]", error);

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
