import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
    await requireAdmin();

    const { id: memberId } = await params;

    try {
        const member = await prisma.communityMember.findUnique({
            where: {
                id: memberId,
            },
        });

        if (!member) {
            return NextResponse.json(
                {
                    message: "Community member tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        await prisma.communityMember.delete({
            where: {
                id: memberId,
            },
        });

        return NextResponse.json({
            message: "Member berhasil dihapus dari community.",
        });
    } catch (error) {
        console.error("[ADMIN_DELETE_COMMUNITY_MEMBER]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat menghapus member.",
            },
            {
                status: 500,
            }
        );
    }
}