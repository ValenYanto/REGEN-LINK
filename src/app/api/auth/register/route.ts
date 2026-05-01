import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/valdiations/auth";

export async function POST(request: Request) {
    try {
        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    message: "Payload request tidak valid.",
                },
                {
                    status: 400,
                }
            );
        }

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

        const { name, email, password } = parsed.data;
        const cityId = parsed.data.cityId?.trim();

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

        if (cityId) {
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
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                ...(cityId ? { cityId } : {}),
                regenerativeScore: {
                    create: {
                        totalScore: 0,
                        level: "Perintis Aksi",
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
        console.error("[REGISTER_ERROR]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan pada server.",
            },
            {
                status: 500,
            }
        );
    }
}
