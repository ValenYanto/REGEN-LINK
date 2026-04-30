import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { energyRecordSchema } from "@/lib/valdiations/records"

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized. Please login first." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const parsed = energyRecordSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Invalid input.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = parsed.data;

        const record = await prisma.energyRecord.create({
            data: {
                userId: session.user.id,
                monthlyKwh: data.monthlyKwh,
                electricityCost: data.electricityCost,
                housingType: data.housingType,
                occupants: data.occupants,
                dominantDevices: data.dominantDevices,
                notes: data.notes || null,
                recordDate: data.recordDate ? new Date(data.recordDate) : new Date(),
            },
        });

        await prisma.regenerativeScore.upsert({
            where: {
                userId: session.user.id,
            },
            update: {
                totalScore: {
                    increment: 8,
                },
                updatedAt: new Date(),
            },
            create: {
                userId: session.user.id,
                totalScore: 8,
                level: "Sprout",
                cityRank: 0,
            },
        });

        return NextResponse.json(
            {
                message: "Energy record created successfully.",
                record,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[ENERGY_RECORD_POST]", error);

        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}