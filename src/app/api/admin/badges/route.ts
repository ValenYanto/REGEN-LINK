import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { createBadgeSchema } from "@/lib/valdiations/admin";

export async function POST(request: Request) {
    await requireAdmin();

    try {
        const body = await request.json();
        const parsed = createBadgeSchema.safeParse(body);

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

        const name = parsed.data.name.trim();
        const description = parsed.data.description.trim();

        const existingBadge = await prisma.badge.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (existingBadge) {
            return NextResponse.json(
                {
                    message: "Badge dengan nama tersebut sudah ada.",
                },
                {
                    status: 409,
                }
            );
        }

        const badge = await prisma.badge.create({
            data: {
                name,
                description,
                category: parsed.data.category,
                requiredScore: parsed.data.requiredScore,
            },
        });

        return NextResponse.json(
            {
                message: "Badge berhasil dibuat.",
                badge,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("[ADMIN_CREATE_BADGE]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat membuat badge.",
            },
            {
                status: 500,
            }
        );
    }
}