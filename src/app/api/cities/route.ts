import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const cities = await prisma.city.findMany({
            orderBy: [
                {
                    province: "asc",
                },
                {
                    name: "asc",
                },
            ],
            select: {
                id: true,
                name: true,
                province: true,
                country: true,
            },
        });

        return NextResponse.json({
            cities,
        });
    } catch (error) {
        console.error("GET_CITIES_ERROR", error);

        return NextResponse.json(
            {
                message: "Gagal mengambil data kota.",
            },
            {
                status: 500,
            }
        );
    }
}