import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { updateChallengeSchema } from "@/lib/valdiations/admin";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
    await requireAdmin();

    const { id: challengeId } = await params;

    try {
        const body = await request.json();
        const parsed = updateChallengeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Data challenge tidak valid.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        const targetChallenge = await prisma.challenge.findUnique({
            where: {
                id: challengeId,
            },
        });

        if (!targetChallenge) {
            return NextResponse.json(
                {
                    message: "Challenge tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        const name = parsed.data.name.trim();
        const description = parsed.data.description.trim();

        const duplicateChallenge = await prisma.challenge.findFirst({
            where: {
                id: {
                    not: challengeId,
                },
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (duplicateChallenge) {
            return NextResponse.json(
                {
                    message: "Challenge dengan nama tersebut sudah dipakai.",
                },
                {
                    status: 409,
                }
            );
        }

        const updatedChallenge = await prisma.challenge.update({
            where: {
                id: challengeId,
            },
            data: {
                name,
                description,
                type: parsed.data.type,
                targetValue: parsed.data.targetValue,
                startDate: parsed.data.startDate,
                endDate: parsed.data.endDate,
            },
        });

        return NextResponse.json({
            message: "Challenge berhasil diperbarui.",
            challenge: updatedChallenge,
        });
    } catch (error) {
        console.error("[ADMIN_UPDATE_CHALLENGE]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat memperbarui challenge.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    await requireAdmin();

    const { id: challengeId } = await params;

    try {
        const targetChallenge = await prisma.challenge.findUnique({
            where: {
                id: challengeId,
            },
            include: {
                participants: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!targetChallenge) {
            return NextResponse.json(
                {
                    message: "Challenge tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        if (targetChallenge.participants.length > 0) {
            return NextResponse.json(
                {
                    message:
                        "Challenge tidak bisa dihapus karena sudah memiliki participant.",
                    usage: {
                        participants: targetChallenge.participants.length,
                    },
                },
                {
                    status: 409,
                }
            );
        }

        await prisma.challenge.delete({
            where: {
                id: challengeId,
            },
        });

        return NextResponse.json({
            message: "Challenge berhasil dihapus.",
        });
    } catch (error) {
        console.error("[ADMIN_DELETE_CHALLENGE]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat menghapus challenge.",
            },
            {
                status: 500,
            }
        );
    }
}