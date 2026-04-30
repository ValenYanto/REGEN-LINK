import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
    calculateEnergyImpact,
    calculateWasteImpact,
    combineImpactEstimates,
    getLevelFromScore,
} from "@/lib/impact/impact-engine";
import { generateRecommendationCandidates } from "@/lib/impact/recommendation-engine";

export async function POST() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized. Please login first." },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        const [latestEnergyRecord, latestWasteRecord] = await Promise.all([
            prisma.energyRecord.findFirst({
                where: { userId },
                orderBy: { recordDate: "desc" },
            }),
            prisma.wasteRecord.findFirst({
                where: { userId },
                orderBy: { recordDate: "desc" },
            }),
        ]);

        if (!latestEnergyRecord && !latestWasteRecord) {
            return NextResponse.json(
                {
                    message:
                        "Belum ada data energy atau waste. Isi record terlebih dahulu.",
                },
                { status: 400 }
            );
        }

        const candidates = generateRecommendationCandidates({
            energyRecord: latestEnergyRecord,
            wasteRecord: latestWasteRecord,
        });

        const actionNames = candidates.map((candidate) => candidate.actionName);

        const actions = await prisma.action.findMany({
            where: {
                name: {
                    in: actionNames,
                },
            },
        });

        if (actions.length === 0) {
            return NextResponse.json(
                {
                    message:
                        "Action seed belum ditemukan. Jalankan `npx prisma db seed` terlebih dahulu.",
                },
                { status: 400 }
            );
        }

        const energyImpact = calculateEnergyImpact(latestEnergyRecord);
        const wasteImpact = calculateWasteImpact(latestWasteRecord);

        const totalImpact = combineImpactEstimates([energyImpact, wasteImpact]);

        const createdRecommendations = [];
        const createdUserActions = [];
        const createdImpactEstimations = [];

        for (const candidate of candidates) {
            const action = actions.find((item) => item.name === candidate.actionName);

            if (!action) continue;

            const recommendation = await prisma.aiRecommendation.create({
                data: {
                    userId,
                    actionId: action.id,
                    recommendationReason: candidate.reason,
                    confidenceScore: candidate.confidenceScore,
                },
                include: {
                    action: true,
                },
            });

            const userAction = await prisma.userAction.create({
                data: {
                    userId,
                    actionId: action.id,
                    status: "PLANNED",
                    notes: candidate.reason,
                },
                include: {
                    action: true,
                },
            });

            const sourceImpact =
                candidate.source === "ENERGY" ? energyImpact : wasteImpact;

            const impactEstimation = await prisma.impactEstimation.create({
                data: {
                    userActionId: userAction.id,
                    estimatedEnergySavedKwh: sourceImpact.estimatedEnergySavedKwh,
                    estimatedWasteReducedKg: sourceImpact.estimatedWasteReducedKg,
                    estimatedCo2ReducedKg: sourceImpact.estimatedCo2ReducedKg,
                    estimatedCostSaved: sourceImpact.estimatedCostSaved,
                },
            });

            createdRecommendations.push(recommendation);
            createdUserActions.push(userAction);
            createdImpactEstimations.push(impactEstimation);
        }

        const currentScore = await prisma.regenerativeScore.findUnique({
            where: {
                userId,
            },
        });

        const nextScore =
            (currentScore?.totalScore ?? 0) + totalImpact.scoreIncrement;

        const regenerativeScore = await prisma.regenerativeScore.upsert({
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

        return NextResponse.json({
            message: "Impact and recommendation generated successfully.",
            totalImpact,
            regenerativeScore,
            recommendations: createdRecommendations,
            userActions: createdUserActions,
            impactEstimations: createdImpactEstimations,
        });
    } catch (error) {
        console.error("[IMPACT_GENERATE_POST]", error);

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}