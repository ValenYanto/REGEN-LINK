import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { createChallengeSchema } from "@/lib/valdiations/admin";

export async function POST(request: Request) {
    await requireAdmin();

    try {
        const body = await request.json();
        const parsed = createChallengeSchema.safeParse(body);

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

        const name = parsed.data.name.trim();
        const description = parsed.data.description.trim();

        const existingChallenge = await prisma.challenge.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (existingChallenge) {
            return NextResponse.json(
                {
                    message: "Challenge dengan nama tersebut sudah ada.",
                },
                {
                    status: 409,
                }
            );
        }

        const challenge = await prisma.challenge.create({
            data: {
                name,
                description,
                type: parsed.data.type,
                targetValue: parsed.data.targetValue,
                startDate: parsed.data.startDate,
                endDate: parsed.data.endDate,
            },
        });

        return NextResponse.json(
            {
                message: "Challenge berhasil dibuat.",
                challenge,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("[ADMIN_CREATE_CHALLENGE]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat membuat challenge.",
            },
            {
                status: 500,
            }
        );
    }
}