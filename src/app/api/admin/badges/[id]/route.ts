import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { updateBadgeSchema } from "@/lib/valdiations/admin";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
    await requireAdmin();

    const { id: badgeId } = await params;

    try {
        const body = await request.json();
        const parsed = updateBadgeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Data badge tidak valid.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        const targetBadge = await prisma.badge.findUnique({
            where: {
                id: badgeId,
            },
        });

        if (!targetBadge) {
            return NextResponse.json(
                {
                    message: "Badge tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        const name = parsed.data.name.trim();
        const description = parsed.data.description.trim();

        const duplicateBadge = await prisma.badge.findFirst({
            where: {
                id: {
                    not: badgeId,
                },
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (duplicateBadge) {
            return NextResponse.json(
                {
                    message: "Badge dengan nama tersebut sudah dipakai.",
                },
                {
                    status: 409,
                }
            );
        }

        const updatedBadge = await prisma.badge.update({
            where: {
                id: badgeId,
            },
            data: {
                name,
                description,
                category: parsed.data.category,
                requiredScore: parsed.data.requiredScore,
            },
        });

        return NextResponse.json({
            message: "Badge berhasil diperbarui.",
            badge: updatedBadge,
        });
    } catch (error) {
        console.error("[ADMIN_UPDATE_BADGE]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat memperbarui badge.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    await requireAdmin();

    const { id: badgeId } = await params;

    try {
        const targetBadge = await prisma.badge.findUnique({
            where: {
                id: badgeId,
            },
            include: {
                userBadges: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!targetBadge) {
            return NextResponse.json(
                {
                    message: "Badge tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        if (targetBadge.userBadges.length > 0) {
            return NextResponse.json(
                {
                    message:
                        "Badge tidak bisa dihapus karena sudah pernah dibuka oleh user.",
                    usage: {
                        userBadges: targetBadge.userBadges.length,
                    },
                },
                {
                    status: 409,
                }
            );
        }

        await prisma.badge.delete({
            where: {
                id: badgeId,
            },
        });

        return NextResponse.json({
            message: "Badge berhasil dihapus.",
        });
    } catch (error) {
        console.error("[ADMIN_DELETE_BADGE]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat menghapus badge.",
            },
            {
                status: 500,
            }
        );
    }
}