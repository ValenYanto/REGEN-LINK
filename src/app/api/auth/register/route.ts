import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/valdiations/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Data tidak valid.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        const { name, email, password, cityId } = parsed.data;

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    message: "Email sudah terdaftar.",
                },
                {
                    status: 409,
                }
            );
        }

        const city = await prisma.city.findUnique({
            where: {
                id: cityId,
            },
        });

        if (!city) {
            return NextResponse.json(
                {
                    message: "Kota tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                cityId,
                regenerativeScore: {
                    create: {
                        totalScore: 0,
                        level: "Seed",
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return NextResponse.json(
            {
                message: "Registrasi berhasil.",
                user,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("REGISTER_ERROR", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan server.",
            },
            {
                status: 500,
            }
        );
    }
}