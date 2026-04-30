import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(_req: Request, { params }: RouteContext) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized. Please login first." },
                { status: 401 }
            );
        }

        const { id: challengeId } = await params;

        if (!challengeId) {
            return NextResponse.json(
                { message: "Missing challenge id." },
                { status: 400 }
            );
        }

        const challenge = await prisma.challenge.findUnique({
            where: {
                id: challengeId,
            },
        });

        if (!challenge) {
            return NextResponse.json(
                { message: "Challenge not found." },
                { status: 404 }
            );
        }

        const participant = await prisma.challengeParticipant.upsert({
            where: {
                challengeId_userId: {
                    challengeId,
                    userId: session.user.id,
                },
            },
            update: {},
            create: {
                challengeId,
                userId: session.user.id,
                progressStatus: "JOINED",
                progressValue: 0,
            },
            include: {
                challenge: true,
            },
        });

        return NextResponse.json({
            message: "Challenge joined successfully.",
            participant,
        });
    } catch (error) {
        console.error("[CHALLENGE_JOIN_POST]", error);

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}