import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { updateUserRoleSchema } from "@/lib/valdiations/admin";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
    const admin = await requireAdmin();
    const { id: userId } = await params;

    try {
        const body = await request.json();
        const parsed = updateUserRoleSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Data role tidak valid.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        const targetUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!targetUser) {
            return NextResponse.json(
                {
                    message: "User tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        // Safety: jangan biarkan admin terakhir tidak sengaja menurunkan role sendiri.
        if (admin.id === userId && parsed.data.role !== "ADMIN") {
            const adminCount = await prisma.user.count({
                where: {
                    role: "ADMIN",
                },
            });

            if (adminCount <= 1) {
                return NextResponse.json(
                    {
                        message:
                            "Tidak bisa menurunkan role admin terakhir. Tambahkan admin lain terlebih dahulu.",
                    },
                    {
                        status: 400,
                    }
                );
            }
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role: parsed.data.role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        return NextResponse.json({
            message: "Role user berhasil diperbarui.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("[ADMIN_UPDATE_USER_ROLE]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat memperbarui role user.",
            },
            {
                status: 500,
            }
        );
    }
}