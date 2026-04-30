import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import {
    ActionCategory,
    BadgeCategory,
    ChallengeType,
    CommunityType,
    DifficultyLevel,
    HousingType,
    WasteManagementStatus,
    WasteType,
} from "@prisma/client";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

async function main() {
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
            update: {
                country: city.country,
            },
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

    const bandung = await prisma.city.findUnique({
        where: {
            name_province: {
                name: "Bandung",
                province: "Jawa Barat",
            },
        },
    });

    if (!bogor || !bandung) {
        throw new Error("Required seed cities not found.");
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    const demoUser = await prisma.user.upsert({
        where: {
            email: "demo@regenlink.id",
        },
        update: {
            name: "Demo User",
            cityId: bogor.id,
        },
        create: {
            name: "Demo User",
            email: "demo@regenlink.id",
            passwordHash,
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

    const existingEnergyCount = await prisma.energyRecord.count({
        where: {
            userId: demoUser.id,
        },
    });

    if (existingEnergyCount === 0) {
        await prisma.energyRecord.createMany({
            data: [
                {
                    userId: demoUser.id,
                    monthlyKwh: 220,
                    electricityCost: 320000,
                    housingType: HousingType.KOS,
                    occupants: 1,
                    dominantDevices: "Laptop, charger HP, kipas angin, rice cooker",
                    recordDate: new Date("2026-04-01"),
                },
                {
                    userId: demoUser.id,
                    monthlyKwh: 185,
                    electricityCost: 267000,
                    housingType: HousingType.KOS,
                    occupants: 1,
                    dominantDevices: "Laptop, charger HP, lampu, kipas angin",
                    recordDate: new Date("2026-04-15"),
                },
            ],
        });
    }

    const existingWasteCount = await prisma.wasteRecord.count({
        where: {
            userId: demoUser.id,
        },
    });

    if (existingWasteCount === 0) {
        await prisma.wasteRecord.createMany({
            data: [
                {
                    userId: demoUser.id,
                    wasteType: WasteType.FOOD,
                    weightKg: 7.5,
                    wasteSource: "Dapur kos",
                    managementStatus: WasteManagementStatus.SORTED,
                    recordDate: new Date("2026-04-10"),
                },
                {
                    userId: demoUser.id,
                    wasteType: WasteType.PLASTIC,
                    weightKg: 3.2,
                    wasteSource: "Kemasan makanan dan minuman",
                    managementStatus: WasteManagementStatus.SENT_TO_WASTE_BANK,
                    recordDate: new Date("2026-04-18"),
                },
            ],
        });
    }

    const ipbCommunity = await prisma.community.upsert({
        where: {
            name_cityId: {
                name: "IPB Climate Action Node",
                cityId: bogor.id,
            },
        },
        update: {
            type: CommunityType.CAMPUS,
        },
        create: {
            name: "IPB Climate Action Node",
            type: CommunityType.CAMPUS,
            cityId: bogor.id,
        },
    });

    await prisma.community.upsert({
        where: {
            name_cityId: {
                name: "Bandung Circular Living Hub",
                cityId: bandung.id,
            },
        },
        update: {
            type: CommunityType.CITY,
        },
        create: {
            name: "Bandung Circular Living Hub",
            type: CommunityType.CITY,
            cityId: bandung.id,
        },
    });

    await prisma.communityMember.upsert({
        where: {
            userId_communityId: {
                userId: demoUser.id,
                communityId: ipbCommunity.id,
            },
        },
        update: {
            memberRole: "Researcher",
        },
        create: {
            userId: demoUser.id,
            communityId: ipbCommunity.id,
            memberRole: "Researcher",
        },
    });

    const actions = [
        {
            name: "Reduce Standby Power",
            category: ActionCategory.ENERGY,
            difficultyLevel: DifficultyLevel.EASY,
            description:
                "Matikan perangkat elektronik dari stop kontak saat tidak digunakan untuk mengurangi konsumsi listrik standby.",
            baseImpactScore: 12,
        },
        {
            name: "Schedule High-Power Device Usage",
            category: ActionCategory.ENERGY,
            difficultyLevel: DifficultyLevel.MEDIUM,
            description:
                "Atur jadwal penggunaan perangkat berdaya besar agar konsumsi listrik lebih efisien dan terkontrol.",
            baseImpactScore: 18,
        },
        {
            name: "Food Waste Planning",
            category: ActionCategory.WASTE,
            difficultyLevel: DifficultyLevel.EASY,
            description:
                "Rencanakan pembelian dan konsumsi makanan untuk mengurangi sisa makanan harian.",
            baseImpactScore: 14,
        },
        {
            name: "Organic Composting",
            category: ActionCategory.CIRCULAR,
            difficultyLevel: DifficultyLevel.MEDIUM,
            description:
                "Ubah limbah organik menjadi kompos untuk mengurangi beban sampah dan mendukung ekonomi sirkular.",
            baseImpactScore: 22,
        },
        {
            name: "Send Sorted Waste to Waste Bank",
            category: ActionCategory.CIRCULAR,
            difficultyLevel: DifficultyLevel.MEDIUM,
            description:
                "Pisahkan limbah bernilai ekonomi dan kirim ke bank sampah atau mitra daur ulang.",
            baseImpactScore: 20,
        },
        {
            name: "Community Climate Challenge",
            category: ActionCategory.COMMUNITY,
            difficultyLevel: DifficultyLevel.HARD,
            description:
                "Ikuti aksi kolektif komunitas untuk mengurangi konsumsi energi dan limbah secara terukur.",
            baseImpactScore: 30,
        },
    ];

    for (const action of actions) {
        await prisma.action.upsert({
            where: {
                name: action.name,
            },
            update: {
                category: action.category,
                difficultyLevel: action.difficultyLevel,
                description: action.description,
                baseImpactScore: action.baseImpactScore,
            },
            create: action,
        });
    }

    const badges = [
        {
            name: "Energy Starter",
            category: BadgeCategory.ENERGY,
            description: "Diberikan kepada pengguna yang mulai mencatat data energi.",
            requiredScore: 50,
        },
        {
            name: "Circular Starter",
            category: BadgeCategory.WASTE,
            description: "Diberikan kepada pengguna yang mulai mencatat data limbah.",
            requiredScore: 50,
        },
        {
            name: "Impact Builder",
            category: BadgeCategory.IMPACT,
            description:
                "Diberikan kepada pengguna yang mulai menghasilkan estimasi dampak.",
            requiredScore: 150,
        },
        {
            name: "Community Mover",
            category: BadgeCategory.COMMUNITY,
            description:
                "Diberikan kepada pengguna yang aktif dalam challenge komunitas.",
            requiredScore: 250,
        },
        {
            name: "Regenerative Champion",
            category: BadgeCategory.STREAK,
            description:
                "Diberikan kepada pengguna dengan kontribusi konsisten dan skor tinggi.",
            requiredScore: 500,
        },
    ];

    for (const badge of badges) {
        await prisma.badge.upsert({
            where: {
                name: badge.name,
            },
            update: {
                category: badge.category,
                description: badge.description,
                requiredScore: badge.requiredScore,
            },
            create: badge,
        });
    }

    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const challenges = [
        {
            name: "7-Day Energy Efficiency Sprint",
            type: ChallengeType.ENERGY,
            description:
                "Tantangan hemat energi selama 7 hari dengan fokus pada pengurangan perangkat standby dan penggunaan listrik sadar waktu.",
            startDate: now,
            endDate: nextMonth,
            targetValue: 50,
        },
        {
            name: "Food Waste Reduction Mission",
            type: ChallengeType.WASTE,
            description:
                "Tantangan mengurangi food waste melalui perencanaan konsumsi, pencatatan sisa makanan, dan aksi kompos.",
            startDate: now,
            endDate: nextMonth,
            targetValue: 25,
        },
        {
            name: "Cross-City Circular Action",
            type: ChallengeType.CROSS_CITY,
            description:
                "Tantangan lintas kota untuk meningkatkan aksi pemilahan dan pengiriman limbah ke bank sampah.",
            startDate: now,
            endDate: nextMonth,
            targetValue: 100,
        },
    ];

    for (const challenge of challenges) {
        await prisma.challenge.upsert({
            where: {
                name: challenge.name,
            },
            update: {
                type: challenge.type,
                description: challenge.description,
                startDate: challenge.startDate,
                endDate: challenge.endDate,
                targetValue: challenge.targetValue,
            },
            create: challenge,
        });
    }

    console.log("Seed completed successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });