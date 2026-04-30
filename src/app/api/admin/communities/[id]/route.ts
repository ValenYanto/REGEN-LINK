import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { updateCommunitySchema } from "@/lib/valdiations/admin";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
    await requireAdmin();

    const { id: communityId } = await params;

    try {
        const body = await request.json();
        const parsed = updateCommunitySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Data community tidak valid.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        const targetCommunity = await prisma.community.findUnique({
            where: {
                id: communityId,
            },
        });

        if (!targetCommunity) {
            return NextResponse.json(
                {
                    message: "Community tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        const city = await prisma.city.findUnique({
            where: {
                id: parsed.data.cityId,
            },
        });

        if (!city) {
            return NextResponse.json(
                {
                    message: "City node tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        const name = parsed.data.name.trim();

        const duplicateCommunity = await prisma.community.findFirst({
            where: {
                id: {
                    not: communityId,
                },
                cityId: parsed.data.cityId,
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (duplicateCommunity) {
            return NextResponse.json(
                {
                    message:
                        "Community dengan nama tersebut sudah ada di city yang sama.",
                },
                {
                    status: 409,
                }
            );
        }

        const updatedCommunity = await prisma.community.update({
            where: {
                id: communityId,
            },
            data: {
                name,
                type: parsed.data.type,
                cityId: parsed.data.cityId,
            },
        });

        return NextResponse.json({
            message: "Community berhasil diperbarui.",
            community: updatedCommunity,
        });
    } catch (error) {
        console.error("[ADMIN_UPDATE_COMMUNITY]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat memperbarui community.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    await requireAdmin();

    const { id: communityId } = await params;

    try {
        const targetCommunity = await prisma.community.findUnique({
            where: {
                id: communityId,
            },
            include: {
                members: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!targetCommunity) {
            return NextResponse.json(
                {
                    message: "Community tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        if (targetCommunity.members.length > 0) {
            return NextResponse.json(
                {
                    message:
                        "Community tidak bisa dihapus karena sudah memiliki member.",
                    usage: {
                        members: targetCommunity.members.length,
                    },
                },
                {
                    status: 409,
                }
            );
        }

        await prisma.community.delete({
            where: {
                id: communityId,
            },
        });

        return NextResponse.json({
            message: "Community berhasil dihapus.",
        });
    } catch (error) {
        console.error("[ADMIN_DELETE_COMMUNITY]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat menghapus community.",
            },
            {
                status: 500,
            }
        );
    }
}
