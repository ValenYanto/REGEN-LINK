import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("Start seeding REGEN-LINK database...");

    const cities = [
        {
            name: "Bogor",
            province: "Jawa Barat",
            country: "Indonesia",
        },
        {
            name: "Bandung",
            province: "Jawa Barat",
            country: "Indonesia",
        },
        {
            name: "Yogyakarta",
            province: "DI Yogyakarta",
            country: "Indonesia",
        },
        {
            name: "Jakarta",
            province: "DKI Jakarta",
            country: "Indonesia",
        },
        {
            name: "Surabaya",
            province: "Jawa Timur",
            country: "Indonesia",
        },
    ];

    for (const city of cities) {
        await prisma.city.upsert({
            where: {
                name_province: {
                    name: city.name,
                    province: city.province,
                },
            },
            update: {},
            create: city,
        });
    }

    const bogor = await prisma.city.findUnique({
        where: {
            name_province: {
                name: "Bogor",
                province: "Jawa Barat",
            },
        },
    });

    if (!bogor) {
        throw new Error("Bogor city seed failed.");
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    const demoUser = await prisma.user.upsert({
        where: {
            email: "demo@regenlink.id",
        },
        update: {
            cityId: bogor.id,
        },
        create: {
            name: "Demo User",
            email: "demo@regenlink.id",
            passwordHash,
            role: "USER",
            cityId: bogor.id,
        },
    });

    await prisma.regenerativeScore.upsert({
        where: {
            userId: demoUser.id,
        },
        update: {
            totalScore: 120,
            level: "Sprout",
            cityRank: 3,
        },
        create: {
            userId: demoUser.id,
            totalScore: 120,
            level: "Sprout",
            cityRank: 3,
        },
    });

    await prisma.energyRecord.deleteMany({
        where: {
            userId: demoUser.id,
        },
    });

    await prisma.wasteRecord.deleteMany({
        where: {
            userId: demoUser.id,
        },
    });

    await prisma.energyRecord.createMany({
        data: [
            {
                userId: demoUser.id,
                monthlyKwh: 220,
                electricityCost: 320000,
                housingType: "KOS",
                occupants: 1,
                dominantDevices: "Laptop, charger HP, kipas angin, rice cooker",
                notes: "Pemakaian listrik cukup tinggi karena perangkat sering standby.",
                recordDate: new Date("2026-04-01"),
            },
            {
                userId: demoUser.id,
                monthlyKwh: 185,
                electricityCost: 267000,
                housingType: "KOS",
                occupants: 1,
                dominantDevices: "Laptop, charger HP, lampu, kipas angin",
                notes: "Mulai mengurangi perangkat standby.",
                recordDate: new Date("2026-04-15"),
            },
        ],
    });

    await prisma.wasteRecord.createMany({
        data: [
            {
                userId: demoUser.id,
                wasteType: "FOOD",
                weightKg: 7.5,
                wasteSource: "Konsumsi harian anak kos",
                managementStatus: "NOT_SORTED",
                notes: "Food waste masih cukup tinggi karena porsi makan sering berlebih.",
                recordDate: new Date("2026-04-02"),
            },
            {
                userId: demoUser.id,
                wasteType: "PLASTIC",
                weightKg: 3.2,
                wasteSource: "Kemasan makanan dan minuman",
                managementStatus: "SORTED",
                notes: "Mulai memisahkan plastik dari sampah campuran.",
                recordDate: new Date("2026-04-16"),
            },
        ],
    });

    console.log("Seed finished successfully.");
    console.log("Demo account:");
    console.log("Email: demo@regenlink.id");
    console.log("Password: password123");
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });