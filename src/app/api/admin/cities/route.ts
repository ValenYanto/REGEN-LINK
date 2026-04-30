import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { createCitySchema } from "@/lib/valdiations/admin";

export async function POST(request: Request) {
    await requireAdmin();

    try {
        const body = await request.json();
        const parsed = createCitySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Data city tidak valid.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        const name = parsed.data.name.trim();
        const province = parsed.data.province.trim();
        const country = parsed.data.country.trim();

        const existingCity = await prisma.city.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                province: {
                    equals: province,
                    mode: "insensitive",
                },
            },
        });

        if (existingCity) {
            return NextResponse.json(
                {
                    message: "City dengan nama dan provinsi tersebut sudah ada.",
                },
                {
                    status: 409,
                }
            );
        }

        const city = await prisma.city.create({
            data: {
                name,
                province,
                country,
            },
        });

        return NextResponse.json(
            {
                message: "City berhasil dibuat.",
                city,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("[ADMIN_CREATE_CITY]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat membuat city.",
            },
            {
                status: 500,
            }
        );
    }
}