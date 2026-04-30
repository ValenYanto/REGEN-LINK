import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { updateActionSchema } from "@/lib/valdiations/admin";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
    await requireAdmin();

    const { id: actionId } = await params;

    try {
        const body = await request.json();
        const parsed = updateActionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Data action tidak valid.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        const targetAction = await prisma.action.findUnique({
            where: {
                id: actionId,
            },
        });

        if (!targetAction) {
            return NextResponse.json(
                {
                    message: "Action tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        const name = parsed.data.name.trim();
        const description = parsed.data.description.trim();

        const duplicateAction = await prisma.action.findFirst({
            where: {
                id: {
                    not: actionId,
                },
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (duplicateAction) {
            return NextResponse.json(
                {
                    message: "Action dengan nama tersebut sudah dipakai.",
                },
                {
                    status: 409,
                }
            );
        }

        const updatedAction = await prisma.action.update({
            where: {
                id: actionId,
            },
            data: {
                name,
                description,
                category: parsed.data.category,
                difficultyLevel: parsed.data.difficultyLevel,
                baseImpactScore: parsed.data.baseImpactScore,
            },
        });

        return NextResponse.json({
            message: "Action berhasil diperbarui.",
            action: updatedAction,
        });
    } catch (error) {
        console.error("[ADMIN_UPDATE_ACTION]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat memperbarui action.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    await requireAdmin();

    const { id: actionId } = await params;

    try {
        const targetAction = await prisma.action.findUnique({
            where: {
                id: actionId,
            },
            include: {
                userActions: {
                    select: {
                        id: true,
                    },
                },
                aiRecommendations: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!targetAction) {
            return NextResponse.json(
                {
                    message: "Action tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        if (
            targetAction.userActions.length > 0 ||
            targetAction.aiRecommendations.length > 0
        ) {
            return NextResponse.json(
                {
                    message:
                        "Action tidak bisa dihapus karena sudah dipakai oleh user action atau rekomendasi AI.",
                    usage: {
                        userActions: targetAction.userActions.length,
                        aiRecommendations: targetAction.aiRecommendations.length,
                    },
                },
                {
                    status: 409,
                }
            );
        }

        await prisma.action.delete({
            where: {
                id: actionId,
            },
        });

        return NextResponse.json({
            message: "Action berhasil dihapus.",
        });
    } catch (error) {
        console.error("[ADMIN_DELETE_ACTION]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat menghapus action.",
            },
            {
                status: 500,
            }
        );
    }
}