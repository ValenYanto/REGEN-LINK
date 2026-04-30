import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import {
    ActionCategory,
    BadgeCategory,
    ChallengeParticipantStatus,
    ChallengeType,
    CommunityType,
    DifficultyLevel,
    HousingType,
    UserActionStatus,
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

function getLevelFromScore(score: number) {
    if (score >= 500) return "Juara Regeneratif";
    if (score >= 250) return "Penggerak Komunitas";
    if (score >= 150) return "Pembuat Dampak";
    if (score >= 100) return "Pejuang Minim Sampah";
    if (score >= 50) return "Pemula Hemat Energi";
    return "Perintis Aksi";
}

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

    const demoInitialScore = 120;

    const existingDemoScore = await prisma.regenerativeScore.findUnique({
        where: {
            userId: demoUser.id,
        },
    });

    const demoScore = existingDemoScore?.totalScore ?? demoInitialScore;

    await prisma.regenerativeScore.upsert({
        where: {
            userId: demoUser.id,
        },
        update: {
            level: getLevelFromScore(demoScore),
            cityRank: 3,
        },
        create: {
            userId: demoUser.id,
            totalScore: demoInitialScore,
            level: getLevelFromScore(demoInitialScore),
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
            name: "Pemula Hemat Energi",
            category: BadgeCategory.ENERGY,
            description:
                "Diberikan kepada pengguna yang mulai konsisten mencatat dan menjalankan aksi hemat energi.",
            requiredScore: 50,
        },
        {
            name: "Pejuang Minim Sampah",
            category: BadgeCategory.WASTE,
            description:
                "Diberikan kepada pengguna yang mulai mencatat dan mengelola limbah secara lebih bertanggung jawab.",
            requiredScore: 100,
        },
        {
            name: "Pembuat Dampak",
            category: BadgeCategory.IMPACT,
            description:
                "Diberikan kepada pengguna yang berhasil menghasilkan estimasi dampak lingkungan dari aksi nyata.",
            requiredScore: 150,
        },
        {
            name: "Penggerak Komunitas",
            category: BadgeCategory.COMMUNITY,
            description:
                "Diberikan kepada pengguna yang aktif mendorong aksi keberlanjutan bersama komunitas.",
            requiredScore: 250,
        },
        {
            name: "Juara Regeneratif",
            category: BadgeCategory.STREAK,
            description:
                "Diberikan kepada pengguna dengan kontribusi konsisten dan skor regenerative yang tinggi.",
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

    const eligibleDemoBadges = await prisma.badge.findMany({
        where: {
            requiredScore: {
                lte: demoScore,
            },
        },
    });

    for (const badge of eligibleDemoBadges) {
        await prisma.userBadge.upsert({
            where: {
                userId_badgeId: {
                    userId: demoUser.id,
                    badgeId: badge.id,
                },
            },
            update: {},
            create: {
                userId: demoUser.id,
                badgeId: badge.id,
            },
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
    const cityByName = await prisma.city.findMany();

    const cityMap = new Map(
        cityByName.map((city) => [`${city.name}-${city.province}`, city])
    );

    const getCityOrThrow = (name: string, province: string) => {
        const city = cityMap.get(`${name}-${province}`);

        if (!city) {
            throw new Error(`City not found: ${name}, ${province}`);
        }

        return city;
    };

    const demoUsers = [
        {
            name: "Alya Prameswari",
            email: "alya.prameswari@regenlink.id",
            city: getCityOrThrow("Bandung", "Jawa Barat"),
            score: 520,
            cityRank: 1,
            energyRecords: [
                {
                    monthlyKwh: 190,
                    electricityCost: 280000,
                    housingType: HousingType.APARTMENT,
                    occupants: 2,
                    dominantDevices: "Laptop, AC, kulkas, mesin cuci",
                    recordDate: new Date("2026-04-05"),
                },
                {
                    monthlyKwh: 172,
                    electricityCost: 255000,
                    housingType: HousingType.APARTMENT,
                    occupants: 2,
                    dominantDevices: "Laptop, AC mode eco, kulkas",
                    recordDate: new Date("2026-04-20"),
                },
            ],
            wasteRecords: [
                {
                    wasteType: WasteType.ORGANIC,
                    weightKg: 5.8,
                    wasteSource: "Dapur apartemen",
                    managementStatus: WasteManagementStatus.COMPOSTED,
                    recordDate: new Date("2026-04-12"),
                },
                {
                    wasteType: WasteType.PLASTIC,
                    weightKg: 2.1,
                    wasteSource: "Kemasan belanja mingguan",
                    managementStatus: WasteManagementStatus.SENT_TO_WASTE_BANK,
                    recordDate: new Date("2026-04-24"),
                },
            ],
            completedActionNames: [
                "Reduce Standby Power",
                "Schedule High-Power Device Usage",
                "Organic Composting",
                "Send Sorted Waste to Waste Bank",
                "Community Climate Challenge",
            ],
        },
        {
            name: "Nadia Kirana",
            email: "nadia.kirana@regenlink.id",
            city: getCityOrThrow("Yogyakarta", "DI Yogyakarta"),
            score: 360,
            cityRank: 2,
            energyRecords: [
                {
                    monthlyKwh: 155,
                    electricityCost: 230000,
                    housingType: HousingType.DORMITORY,
                    occupants: 1,
                    dominantDevices: "Laptop, kipas angin, charger HP",
                    recordDate: new Date("2026-04-03"),
                },
                {
                    monthlyKwh: 148,
                    electricityCost: 215000,
                    housingType: HousingType.DORMITORY,
                    occupants: 1,
                    dominantDevices: "Laptop, lampu LED, kipas angin",
                    recordDate: new Date("2026-04-19"),
                },
            ],
            wasteRecords: [
                {
                    wasteType: WasteType.FOOD,
                    weightKg: 4.4,
                    wasteSource: "Kantin kampus",
                    managementStatus: WasteManagementStatus.SORTED,
                    recordDate: new Date("2026-04-09"),
                },
                {
                    wasteType: WasteType.PAPER,
                    weightKg: 1.6,
                    wasteSource: "Catatan dan print tugas",
                    managementStatus: WasteManagementStatus.RECYCLED,
                    recordDate: new Date("2026-04-23"),
                },
            ],
            completedActionNames: [
                "Reduce Standby Power",
                "Food Waste Planning",
                "Organic Composting",
                "Send Sorted Waste to Waste Bank",
            ],
        },
        {
            name: "Fajar Nugroho",
            email: "fajar.nugroho@regenlink.id",
            city: getCityOrThrow("Jakarta", "DKI Jakarta"),
            score: 290,
            cityRank: 3,
            energyRecords: [
                {
                    monthlyKwh: 310,
                    electricityCost: 515000,
                    housingType: HousingType.HOUSE,
                    occupants: 4,
                    dominantDevices: "AC, kulkas, TV, mesin cuci, laptop",
                    recordDate: new Date("2026-04-06"),
                },
                {
                    monthlyKwh: 282,
                    electricityCost: 470000,
                    housingType: HousingType.HOUSE,
                    occupants: 4,
                    dominantDevices: "AC inverter, kulkas, TV, laptop",
                    recordDate: new Date("2026-04-21"),
                },
            ],
            wasteRecords: [
                {
                    wasteType: WasteType.PLASTIC,
                    weightKg: 6.5,
                    wasteSource: "Rumah tangga dan belanja online",
                    managementStatus: WasteManagementStatus.SORTED,
                    recordDate: new Date("2026-04-11"),
                },
                {
                    wasteType: WasteType.MIXED,
                    weightKg: 8.2,
                    wasteSource: "Rumah tangga",
                    managementStatus: WasteManagementStatus.NOT_SORTED,
                    recordDate: new Date("2026-04-25"),
                },
            ],
            completedActionNames: [
                "Reduce Standby Power",
                "Schedule High-Power Device Usage",
                "Send Sorted Waste to Waste Bank",
            ],
        },
        {
            name: "Dimas Arya",
            email: "dimas.arya@regenlink.id",
            city: getCityOrThrow("Surabaya", "Jawa Timur"),
            score: 210,
            cityRank: 4,
            energyRecords: [
                {
                    monthlyKwh: 240,
                    electricityCost: 360000,
                    housingType: HousingType.UMKM,
                    occupants: 3,
                    dominantDevices: "Freezer, lampu toko, kipas, laptop kasir",
                    recordDate: new Date("2026-04-07"),
                },
                {
                    monthlyKwh: 226,
                    electricityCost: 340000,
                    housingType: HousingType.UMKM,
                    occupants: 3,
                    dominantDevices: "Freezer, lampu LED toko, kipas",
                    recordDate: new Date("2026-04-22"),
                },
            ],
            wasteRecords: [
                {
                    wasteType: WasteType.FOOD,
                    weightKg: 9.5,
                    wasteSource: "UMKM makanan",
                    managementStatus: WasteManagementStatus.SORTED,
                    recordDate: new Date("2026-04-13"),
                },
                {
                    wasteType: WasteType.ORGANIC,
                    weightKg: 7.8,
                    wasteSource: "Sisa bahan makanan",
                    managementStatus: WasteManagementStatus.COMPOSTED,
                    recordDate: new Date("2026-04-26"),
                },
            ],
            completedActionNames: [
                "Food Waste Planning",
                "Organic Composting",
                "Community Climate Challenge",
            ],
        },
        {
            name: "Raka Mahendra",
            email: "raka.mahendra@regenlink.id",
            city: getCityOrThrow("Bogor", "Jawa Barat"),
            score: 180,
            cityRank: 5,
            energyRecords: [
                {
                    monthlyKwh: 198,
                    electricityCost: 292000,
                    housingType: HousingType.KOS,
                    occupants: 1,
                    dominantDevices: "Laptop, kipas angin, rice cooker",
                    recordDate: new Date("2026-04-08"),
                },
                {
                    monthlyKwh: 176,
                    electricityCost: 260000,
                    housingType: HousingType.KOS,
                    occupants: 1,
                    dominantDevices: "Laptop, kipas angin, lampu LED",
                    recordDate: new Date("2026-04-27"),
                },
            ],
            wasteRecords: [
                {
                    wasteType: WasteType.PLASTIC,
                    weightKg: 3.7,
                    wasteSource: "Kemasan makanan kos",
                    managementStatus: WasteManagementStatus.SENT_TO_WASTE_BANK,
                    recordDate: new Date("2026-04-14"),
                },
                {
                    wasteType: WasteType.FOOD,
                    weightKg: 4.1,
                    wasteSource: "Sisa makanan harian",
                    managementStatus: WasteManagementStatus.SORTED,
                    recordDate: new Date("2026-04-28"),
                },
            ],
            completedActionNames: [
                "Reduce Standby Power",
                "Send Sorted Waste to Waste Bank",
            ],
        },
    ];

    const allActions = await prisma.action.findMany();
    const actionMap = new Map(allActions.map((action) => [action.name, action]));

    const allBadges = await prisma.badge.findMany({
        orderBy: {
            requiredScore: "asc",
        },
    });

    const allChallenges = await prisma.challenge.findMany();

    for (const demo of demoUsers) {
        const demoPasswordHash = await bcrypt.hash("password123", 10);

        const user = await prisma.user.upsert({
            where: {
                email: demo.email,
            },
            update: {
                name: demo.name,
                cityId: demo.city.id,
            },
            create: {
                name: demo.name,
                email: demo.email,
                passwordHash: demoPasswordHash,
                cityId: demo.city.id,
            },
        });

        await prisma.regenerativeScore.upsert({
            where: {
                userId: user.id,
            },
            update: {
                totalScore: demo.score,
                level: getLevelFromScore(demo.score),
                cityRank: demo.cityRank,
            },
            create: {
                userId: user.id,
                totalScore: demo.score,
                level: getLevelFromScore(demo.score),
                cityRank: demo.cityRank,
            },
        });

        const existingDemoEnergyCount = await prisma.energyRecord.count({
            where: {
                userId: user.id,
            },
        });

        if (existingDemoEnergyCount === 0) {
            await prisma.energyRecord.createMany({
                data: demo.energyRecords.map((record) => ({
                    userId: user.id,
                    monthlyKwh: record.monthlyKwh,
                    electricityCost: record.electricityCost,
                    housingType: record.housingType,
                    occupants: record.occupants,
                    dominantDevices: record.dominantDevices,
                    recordDate: record.recordDate,
                })),
            });
        }

        const existingDemoWasteCount = await prisma.wasteRecord.count({
            where: {
                userId: user.id,
            },
        });

        if (existingDemoWasteCount === 0) {
            await prisma.wasteRecord.createMany({
                data: demo.wasteRecords.map((record) => ({
                    userId: user.id,
                    wasteType: record.wasteType,
                    weightKg: record.weightKg,
                    wasteSource: record.wasteSource,
                    managementStatus: record.managementStatus,
                    recordDate: record.recordDate,
                })),
            });
        }

        const existingDemoActionCount = await prisma.userAction.count({
            where: {
                userId: user.id,
            },
        });

        if (existingDemoActionCount === 0) {
            for (const actionName of demo.completedActionNames) {
                const action = actionMap.get(actionName);

                if (!action) continue;

                const userAction = await prisma.userAction.create({
                    data: {
                        userId: user.id,
                        actionId: action.id,
                        status: UserActionStatus.COMPLETED,
                        startedAt: new Date("2026-04-10"),
                        completedAt: new Date("2026-04-29"),
                        notes: `Demo completed action for ${demo.name}.`,
                    },
                });

                const energyImpact =
                    action.category === ActionCategory.ENERGY
                        ? Math.round((8 + Math.random() * 18) * 100) / 100
                        : 0;

                const wasteImpact =
                    action.category === ActionCategory.WASTE ||
                        action.category === ActionCategory.CIRCULAR
                        ? Math.round((1.5 + Math.random() * 5) * 100) / 100
                        : 0;

                const co2Impact =
                    Math.round(
                        (energyImpact * 0.85 + wasteImpact * 0.45) * 100
                    ) / 100;

                const costSaved =
                    action.category === ActionCategory.ENERGY
                        ? Math.round((energyImpact * 1450) / 100) * 100
                        : 0;

                await prisma.impactEstimation.create({
                    data: {
                        userActionId: userAction.id,
                        estimatedEnergySavedKwh: energyImpact,
                        estimatedWasteReducedKg: wasteImpact,
                        estimatedCo2ReducedKg: co2Impact,
                        estimatedCostSaved: costSaved,
                    },
                });
            }
        }

        const eligibleBadges = allBadges.filter(
            (badge) => badge.requiredScore <= demo.score
        );

        for (const badge of eligibleBadges) {
            await prisma.userBadge.upsert({
                where: {
                    userId_badgeId: {
                        userId: user.id,
                        badgeId: badge.id,
                    },
                },
                update: {},
                create: {
                    userId: user.id,
                    badgeId: badge.id,
                },
            });
        }

        for (const challenge of allChallenges) {
            const progressValue =
                challenge.type === ChallengeType.ENERGY
                    ? Math.min(demo.score / 8, challenge.targetValue)
                    : challenge.type === ChallengeType.WASTE
                        ? Math.min(demo.score / 14, challenge.targetValue)
                        : Math.min(demo.score / 5, challenge.targetValue);

            const progressStatus =
                progressValue >= challenge.targetValue
                    ? ChallengeParticipantStatus.COMPLETED
                    : progressValue > 0
                        ? ChallengeParticipantStatus.IN_PROGRESS
                        : ChallengeParticipantStatus.JOINED;

            await prisma.challengeParticipant.upsert({
                where: {
                    challengeId_userId: {
                        challengeId: challenge.id,
                        userId: user.id,
                    },
                },
                update: {
                    progressValue,
                    progressStatus,
                },
                create: {
                    challengeId: challenge.id,
                    userId: user.id,
                    progressValue,
                    progressStatus,
                },
            });
        }
    }
    console.log("Seed completed successfully.");
    await prisma.$executeRaw`
    UPDATE "RegenerativeScore"
    SET "level" = CASE
        WHEN "totalScore" >= 500 THEN 'Juara Regeneratif'
        WHEN "totalScore" >= 250 THEN 'Penggerak Komunitas'
        WHEN "totalScore" >= 150 THEN 'Pembuat Dampak'
        WHEN "totalScore" >= 100 THEN 'Pejuang Minim Sampah'
        WHEN "totalScore" >= 50 THEN 'Pemula Hemat Energi'
        ELSE 'Perintis Aksi'
    END
`;
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