import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { createCommunitySchema } from "@/lib/valdiations/admin";

export async function POST(request: Request) {
    await requireAdmin();

    try {
        const body = await request.json();
        const parsed = createCommunitySchema.safeParse(body);

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

        const name = parsed.data.name.trim();

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

        const existingCommunity = await prisma.community.findFirst({
            where: {
                cityId: parsed.data.cityId,
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (existingCommunity) {
            return NextResponse.json(
                {
                    message: "Community dengan nama tersebut sudah ada di city yang sama.",
                },
                {
                    status: 409,
                }
            );
        }

        const community = await prisma.community.create({
            data: {
                name,
                type: parsed.data.type,
                cityId: parsed.data.cityId,
            },
        });

        return NextResponse.json(
            {
                message: "Community berhasil dibuat.",
                community,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("[ADMIN_CREATE_COMMUNITY]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat membuat community.",
            },
            {
                status: 500,
            }
        );
    }
}