import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { createActionSchema } from "@/lib/valdiations/admin";

export async function POST(request: Request) {
    await requireAdmin();

    try {
        const body = await request.json();
        const parsed = createActionSchema.safeParse(body);

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

        const name = parsed.data.name.trim();
        const description = parsed.data.description.trim();

        const existingAction = await prisma.action.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (existingAction) {
            return NextResponse.json(
                {
                    message: "Action dengan nama tersebut sudah ada.",
                },
                {
                    status: 409,
                }
            );
        }

        const action = await prisma.action.create({
            data: {
                name,
                description,
                category: parsed.data.category,
                difficultyLevel: parsed.data.difficultyLevel,
                baseImpactScore: parsed.data.baseImpactScore,
            },
        });

        return NextResponse.json(
            {
                message: "Action berhasil dibuat.",
                action,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("[ADMIN_CREATE_ACTION]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat membuat action.",
            },
            {
                status: 500,
            }
        );
    }
}