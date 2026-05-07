import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run demo scenario seed.");
}

const pool = new Pool({
    connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "demo12345";

function addDays(date: Date, days: number) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
}

function getLevelFromScore(score: number) {
    if (score >= 500) return "Juara Regeneratif";
    if (score >= 250) return "Penggerak Komunitas";
    if (score >= 150) return "Pembuat Dampak";
    if (score >= 100) return "Pejuang Minim Sampah";
    if (score >= 50) return "Pemula Hemat Energi";
    return "Perintis Aksi";
}

async function seedCities() {
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

    const seededCities = await prisma.city.findMany();

    return new Map(
        seededCities.map((city) => [`${city.name}-${city.province}`, city])
    );
}

function getCityOrThrow(
    cityMap: Awaited<ReturnType<typeof seedCities>>,
    name: string,
    province: string
) {
    const city = cityMap.get(`${name}-${province}`);

    if (!city) {
        throw new Error(`City not found: ${name}, ${province}`);
    }

    return city;
}

async function seedMasterActions() {
    const actions = [
        {
            name: "Reduce Standby Power",
            category: "ENERGY",
            difficultyLevel: "EASY",
            description:
                "Matikan perangkat elektronik dari stop kontak saat tidak digunakan untuk mengurangi konsumsi listrik standby.",
            baseImpactScore: 12,
        },
        {
            name: "Schedule High-Power Device Usage",
            category: "ENERGY",
            difficultyLevel: "MEDIUM",
            description:
                "Atur jadwal penggunaan perangkat berdaya besar agar konsumsi listrik lebih efisien dan terkontrol.",
            baseImpactScore: 18,
        },
        {
            name: "Food Waste Planning",
            category: "WASTE",
            difficultyLevel: "EASY",
            description:
                "Rencanakan pembelian dan konsumsi makanan untuk mengurangi sisa makanan harian.",
            baseImpactScore: 14,
        },
        {
            name: "Organic Composting",
            category: "CIRCULAR",
            difficultyLevel: "MEDIUM",
            description:
                "Ubah limbah organik menjadi kompos untuk mengurangi beban sampah dan mendukung ekonomi sirkular.",
            baseImpactScore: 22,
        },
        {
            name: "Send Sorted Waste to Waste Bank",
            category: "CIRCULAR",
            difficultyLevel: "MEDIUM",
            description:
                "Pisahkan limbah bernilai ekonomi dan kirim ke bank sampah atau mitra daur ulang.",
            baseImpactScore: 20,
        },
        {
            name: "Community Climate Challenge",
            category: "COMMUNITY",
            difficultyLevel: "HARD",
            description:
                "Ikuti aksi kolektif komunitas untuk mengurangi konsumsi energi dan limbah secara terukur.",
            baseImpactScore: 30,
        },
    ] as const;

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

    const seededActions = await prisma.action.findMany();

    return new Map(seededActions.map((action) => [action.name, action]));
}

async function seedMasterBadges() {
    const badges = [
        {
            name: "Pemula Hemat Energi",
            category: "ENERGY",
            description:
                "Diberikan kepada pengguna yang mulai konsisten mencatat dan menjalankan aksi hemat energi.",
            requiredScore: 50,
        },
        {
            name: "Pejuang Minim Sampah",
            category: "WASTE",
            description:
                "Diberikan kepada pengguna yang mulai mencatat dan mengelola limbah secara lebih bertanggung jawab.",
            requiredScore: 100,
        },
        {
            name: "Pembuat Dampak",
            category: "IMPACT",
            description:
                "Diberikan kepada pengguna yang berhasil menghasilkan estimasi dampak lingkungan dari aksi nyata.",
            requiredScore: 150,
        },
        {
            name: "Penggerak Komunitas",
            category: "COMMUNITY",
            description:
                "Diberikan kepada pengguna yang aktif mendorong aksi keberlanjutan bersama komunitas.",
            requiredScore: 250,
        },
        {
            name: "Juara Regeneratif",
            category: "STREAK",
            description:
                "Diberikan kepada pengguna dengan kontribusi konsisten dan skor regenerative yang tinggi.",
            requiredScore: 500,
        },
    ] as const;

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

    return prisma.badge.findMany({
        orderBy: {
            requiredScore: "asc",
        },
    });
}

async function seedMasterChallenges() {
    const now = new Date();
    const endDate = addDays(now, 30);

    const challenges = [
        {
            name: "7-Day Energy Efficiency Sprint",
            type: "ENERGY",
            description:
                "Tantangan hemat energi selama 7 hari dengan fokus pada pengurangan perangkat standby dan penggunaan listrik sadar waktu.",
            startDate: now,
            endDate,
            targetValue: 50,
        },
        {
            name: "Food Waste Reduction Mission",
            type: "WASTE",
            description:
                "Tantangan mengurangi food waste melalui perencanaan konsumsi, pencatatan sisa makanan, dan aksi kompos.",
            startDate: now,
            endDate,
            targetValue: 25,
        },
        {
            name: "Cross-City Circular Action",
            type: "CROSS_CITY",
            description:
                "Tantangan lintas kota untuk meningkatkan aksi pemilahan dan pengiriman limbah ke bank sampah.",
            startDate: now,
            endDate,
            targetValue: 100,
        },
    ] as const;

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

    return prisma.challenge.findMany();
}

async function resetUserDemoData(userId: string) {
    await prisma.impactEstimation.deleteMany({
        where: {
            userAction: {
                userId,
            },
        },
    });

    await prisma.userAction.deleteMany({
        where: {
            userId,
        },
    });

    await prisma.aiRecommendation.deleteMany({
        where: {
            userId,
        },
    });

    await prisma.challengeParticipant.deleteMany({
        where: {
            userId,
        },
    });

    await prisma.userBadge.deleteMany({
        where: {
            userId,
        },
    });

    await prisma.communityMember.deleteMany({
        where: {
            userId,
        },
    });

    await prisma.energyRecord.deleteMany({
        where: {
            userId,
        },
    });

    await prisma.wasteRecord.deleteMany({
        where: {
            userId,
        },
    });

    await prisma.regenerativeScore.deleteMany({
        where: {
            userId,
        },
    });
}

async function unlockBadges(userId: string, score: number, badges: Awaited<ReturnType<typeof seedMasterBadges>>) {
    const eligibleBadges = badges.filter((badge) => badge.requiredScore <= score);

    for (const badge of eligibleBadges) {
        await prisma.userBadge.upsert({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId: badge.id,
                },
            },
            update: {},
            create: {
                userId,
                badgeId: badge.id,
            },
        });
    }
}

async function createCompletedAction({
    userId,
    actionId,
    notes,
    energySaved,
    wasteReduced,
    co2Reduced,
    costSaved,
}: {
    userId: string;
    actionId: string;
    notes: string;
    energySaved: number;
    wasteReduced: number;
    co2Reduced: number;
    costSaved: number;
}) {
    const userAction = await prisma.userAction.create({
        data: {
            userId,
            actionId,
            status: "COMPLETED",
            startedAt: addDays(new Date(), -6),
            completedAt: addDays(new Date(), -1),
            notes,
        },
    });

    await prisma.impactEstimation.create({
        data: {
            userActionId: userAction.id,
            estimatedEnergySavedKwh: energySaved,
            estimatedWasteReducedKg: wasteReduced,
            estimatedCo2ReducedKg: co2Reduced,
            estimatedCostSaved: costSaved,
        },
    });

    return userAction;
}

async function createRecommendation({
    userId,
    actionId,
    confidenceScore,
    recommendationReason,
}: {
    userId: string;
    actionId: string;
    confidenceScore: number;
    recommendationReason: string;
}) {
    await prisma.aiRecommendation.create({
        data: {
            userId,
            actionId,
            confidenceScore,
            recommendationReason,
            generatedAt: new Date(),
        },
    });
}

async function seedScenarioMahasiswaKos({
    cityMap,
    actionMap,
    badges,
    challenges,
    passwordHash,
}: {
    cityMap: Awaited<ReturnType<typeof seedCities>>;
    actionMap: Awaited<ReturnType<typeof seedMasterActions>>;
    badges: Awaited<ReturnType<typeof seedMasterBadges>>;
    challenges: Awaited<ReturnType<typeof seedMasterChallenges>>;
    passwordHash: string;
}) {
    const bogor = getCityOrThrow(cityMap, "Bogor", "Jawa Barat");

    const user = await prisma.user.upsert({
        where: {
            email: "mahasiswa.kos@regenlink.demo",
        },
        update: {
            name: "Mahasiswa Anak Kos",
            passwordHash,
            role: "USER",
            cityId: bogor.id,
        },
        create: {
            name: "Mahasiswa Anak Kos",
            email: "mahasiswa.kos@regenlink.demo",
            passwordHash,
            role: "USER",
            cityId: bogor.id,
        },
    });

    await resetUserDemoData(user.id);

    await prisma.energyRecord.createMany({
        data: [
            {
                userId: user.id,
                monthlyKwh: 214,
                electricityCost: 318000,
                housingType: "KOS",
                occupants: 1,
                dominantDevices: "Laptop, charger HP, kipas angin, rice cooker, lampu kamar",
                notes: "Pemakaian listrik cukup tinggi karena perangkat sering standby saat malam.",
                recordDate: addDays(new Date(), -21),
            },
            {
                userId: user.id,
                monthlyKwh: 178,
                electricityCost: 264000,
                housingType: "KOS",
                occupants: 1,
                dominantDevices: "Laptop, charger HP, kipas angin, lampu LED",
                notes: "Mulai mematikan perangkat standby dan mengganti pola penggunaan listrik.",
                recordDate: addDays(new Date(), -7),
            },
        ],
    });

    await prisma.wasteRecord.createMany({
        data: [
            {
                userId: user.id,
                wasteType: "FOOD",
                weightKg: 6.4,
                wasteSource: "Sisa makanan harian anak kos",
                managementStatus: "SORTED",
                notes: "Food waste mulai dipisah dari sampah plastik.",
                recordDate: addDays(new Date(), -12),
            },
            {
                userId: user.id,
                wasteType: "PLASTIC",
                weightKg: 2.8,
                wasteSource: "Kemasan makanan dan minuman",
                managementStatus: "SENT_TO_WASTE_BANK",
                notes: "Kemasan plastik dikumpulkan dan dikirim ke bank sampah.",
                recordDate: addDays(new Date(), -5),
            },
        ],
    });

    const reduceStandby = actionMap.get("Reduce Standby Power");
    const foodPlanning = actionMap.get("Food Waste Planning");
    const sendWasteBank = actionMap.get("Send Sorted Waste to Waste Bank");

    if (!reduceStandby || !foodPlanning || !sendWasteBank) {
        throw new Error("Required actions for mahasiswa scenario not found.");
    }

    await createRecommendation({
        userId: user.id,
        actionId: reduceStandby.id,
        confidenceScore: 0.91,
        recommendationReason:
            "Konsumsi listrik anak kos masih dipengaruhi perangkat standby seperti charger, laptop, dan rice cooker. Mematikan perangkat dari stop kontak dapat menurunkan beban listrik bulanan.",
    });

    await createRecommendation({
        userId: user.id,
        actionId: foodPlanning.id,
        confidenceScore: 0.84,
        recommendationReason:
            "Data food waste menunjukkan sisa makanan harian masih muncul. Perencanaan porsi dan jadwal makan dapat mengurangi limbah organik.",
    });

    await createRecommendation({
        userId: user.id,
        actionId: sendWasteBank.id,
        confidenceScore: 0.79,
        recommendationReason:
            "Data plastik menunjukkan potensi pemilahan dan pengiriman ke bank sampah untuk mengurangi limbah residu.",
    });

    await createCompletedAction({
        userId: user.id,
        actionId: reduceStandby.id,
        notes:
            "Alasan AI: pola penggunaan listrik menunjukkan perangkat pribadi sering aktif atau standby. Aksi ini cocok untuk anak kos karena mudah dilakukan tanpa biaya tambahan.",
        energySaved: 18.5,
        wasteReduced: 0,
        co2Reduced: 15.7,
        costSaved: 26800,
    });

    await createCompletedAction({
        userId: user.id,
        actionId: sendWasteBank.id,
        notes:
            "Alasan AI: limbah plastik sudah teridentifikasi dan dapat dipilah untuk dikirim ke bank sampah.",
        energySaved: 0,
        wasteReduced: 2.8,
        co2Reduced: 1.3,
        costSaved: 0,
    });

    const score = 86;

    await prisma.regenerativeScore.create({
        data: {
            userId: user.id,
            totalScore: score,
            level: getLevelFromScore(score),
            cityRank: 2,
        },
    });

    await unlockBadges(user.id, score, badges);

    for (const challenge of challenges) {
        const progressValue =
            challenge.type === "ENERGY"
                ? 18.5
                : challenge.type === "WASTE"
                    ? 2.8
                    : 21.3;

        await prisma.challengeParticipant.upsert({
            where: {
                challengeId_userId: {
                    challengeId: challenge.id,
                    userId: user.id,
                },
            },
            update: {
                progressValue,
                progressStatus:
                    progressValue >= challenge.targetValue ? "COMPLETED" : "IN_PROGRESS",
            },
            create: {
                challengeId: challenge.id,
                userId: user.id,
                progressValue,
                progressStatus:
                    progressValue >= challenge.targetValue ? "COMPLETED" : "IN_PROGRESS",
            },
        });
    }

    console.log("Seeded scenario: Mahasiswa Anak Kos");
}

async function seedScenarioKomunitasKampus({
    cityMap,
    actionMap,
    badges,
    challenges,
    passwordHash,
}: {
    cityMap: Awaited<ReturnType<typeof seedCities>>;
    actionMap: Awaited<ReturnType<typeof seedMasterActions>>;
    badges: Awaited<ReturnType<typeof seedMasterBadges>>;
    challenges: Awaited<ReturnType<typeof seedMasterChallenges>>;
    passwordHash: string;
}) {
    const bogor = getCityOrThrow(cityMap, "Bogor", "Jawa Barat");

    const community = await prisma.community.upsert({
        where: {
            name_cityId: {
                name: "Green Campus Collective",
                cityId: bogor.id,
            },
        },
        update: {
            type: "CAMPUS",
        },
        create: {
            name: "Green Campus Collective",
            type: "CAMPUS",
            cityId: bogor.id,
        },
    });

    const user = await prisma.user.upsert({
        where: {
            email: "komunitas.kampus@regenlink.demo",
        },
        update: {
            name: "Komunitas Kampus",
            passwordHash,
            role: "COMMUNITY_LEADER",
            cityId: bogor.id,
        },
        create: {
            name: "Komunitas Kampus",
            email: "komunitas.kampus@regenlink.demo",
            passwordHash,
            role: "COMMUNITY_LEADER",
            cityId: bogor.id,
        },
    });

    await resetUserDemoData(user.id);

    await prisma.communityMember.upsert({
        where: {
            userId_communityId: {
                userId: user.id,
                communityId: community.id,
            },
        },
        update: {
            memberRole: "Community Leader",
        },
        create: {
            userId: user.id,
            communityId: community.id,
            memberRole: "Community Leader",
        },
    });

    await prisma.energyRecord.createMany({
        data: [
            {
                userId: user.id,
                monthlyKwh: 840,
                electricityCost: 1260000,
                housingType: "DORMITORY",
                occupants: 18,
                dominantDevices: "Lampu ruang komunitas, proyektor, laptop anggota, kipas ruangan",
                notes: "Data gabungan aktivitas komunitas kampus untuk monitoring kontribusi kolektif.",
                recordDate: addDays(new Date(), -18),
            },
            {
                userId: user.id,
                monthlyKwh: 790,
                electricityCost: 1185000,
                housingType: "DORMITORY",
                occupants: 18,
                dominantDevices: "Lampu LED, laptop anggota, kipas ruangan, proyektor terjadwal",
                notes: "Pemakaian listrik mulai lebih terjadwal setelah aksi komunitas.",
                recordDate: addDays(new Date(), -4),
            },
        ],
    });

    await prisma.wasteRecord.createMany({
        data: [
            {
                userId: user.id,
                wasteType: "PAPER",
                weightKg: 11.2,
                wasteSource: "Materi kegiatan kampus dan print tugas",
                managementStatus: "RECYCLED",
                notes: "Kertas kegiatan dikumpulkan untuk daur ulang.",
                recordDate: addDays(new Date(), -13),
            },
            {
                userId: user.id,
                wasteType: "ORGANIC",
                weightKg: 14.6,
                wasteSource: "Kegiatan konsumsi komunitas",
                managementStatus: "COMPOSTED",
                notes: "Sisa konsumsi kegiatan diarahkan ke kompos kampus.",
                recordDate: addDays(new Date(), -6),
            },
        ],
    });

    const communityChallenge = actionMap.get("Community Climate Challenge");
    const organicComposting = actionMap.get("Organic Composting");
    const schedulePower = actionMap.get("Schedule High-Power Device Usage");

    if (!communityChallenge || !organicComposting || !schedulePower) {
        throw new Error("Required actions for komunitas kampus scenario not found.");
    }

    await createRecommendation({
        userId: user.id,
        actionId: communityChallenge.id,
        confidenceScore: 0.94,
        recommendationReason:
            "Data aksi anggota menunjukkan potensi kontribusi kolektif. Challenge komunitas dapat mengubah aktivitas individu menjadi progress bersama yang terlihat di dashboard.",
    });

    await createRecommendation({
        userId: user.id,
        actionId: organicComposting.id,
        confidenceScore: 0.88,
        recommendationReason:
            "Limbah organik dari kegiatan kampus cukup tinggi dan sudah bisa diarahkan ke kompos sebagai aksi sirkular komunitas.",
    });

    await createRecommendation({
        userId: user.id,
        actionId: schedulePower.id,
        confidenceScore: 0.81,
        recommendationReason:
            "Perangkat ruang komunitas seperti proyektor, lampu, dan kipas dapat dijadwalkan agar konsumsi energi lebih efisien.",
    });

    await createCompletedAction({
        userId: user.id,
        actionId: communityChallenge.id,
        notes:
            "Alasan AI: komunitas memiliki data aksi anggota dan aktivitas kolektif, sehingga challenge akan memperjelas kontribusi tiap anggota pada dashboard bersama.",
        energySaved: 24.2,
        wasteReduced: 6.5,
        co2Reduced: 23.5,
        costSaved: 35100,
    });

    await createCompletedAction({
        userId: user.id,
        actionId: organicComposting.id,
        notes:
            "Alasan AI: limbah organik kegiatan kampus cukup tinggi dan cocok dikelola melalui kompos komunitas.",
        energySaved: 0,
        wasteReduced: 8.4,
        co2Reduced: 3.8,
        costSaved: 0,
    });

    await createCompletedAction({
        userId: user.id,
        actionId: schedulePower.id,
        notes:
            "Alasan AI: penggunaan perangkat ruang komunitas dapat dikurangi lewat jadwal pemakaian yang lebih disiplin.",
        energySaved: 32.6,
        wasteReduced: 0,
        co2Reduced: 27.7,
        costSaved: 47200,
    });

    const score = 282;

    await prisma.regenerativeScore.create({
        data: {
            userId: user.id,
            totalScore: score,
            level: getLevelFromScore(score),
            cityRank: 1,
        },
    });

    await unlockBadges(user.id, score, badges);

    for (const challenge of challenges) {
        const progressValue =
            challenge.type === "ENERGY"
                ? 56.8
                : challenge.type === "WASTE"
                    ? 14.9
                    : 71.7;

        await prisma.challengeParticipant.upsert({
            where: {
                challengeId_userId: {
                    challengeId: challenge.id,
                    userId: user.id,
                },
            },
            update: {
                progressValue,
                progressStatus:
                    progressValue >= challenge.targetValue ? "COMPLETED" : "IN_PROGRESS",
            },
            create: {
                challengeId: challenge.id,
                userId: user.id,
                progressValue,
                progressStatus:
                    progressValue >= challenge.targetValue ? "COMPLETED" : "IN_PROGRESS",
            },
        });
    }

    console.log("Seeded scenario: Komunitas Kampus");
}

async function seedScenarioUmkmMakanan({
    cityMap,
    actionMap,
    badges,
    challenges,
    passwordHash,
}: {
    cityMap: Awaited<ReturnType<typeof seedCities>>;
    actionMap: Awaited<ReturnType<typeof seedMasterActions>>;
    badges: Awaited<ReturnType<typeof seedMasterBadges>>;
    challenges: Awaited<ReturnType<typeof seedMasterChallenges>>;
    passwordHash: string;
}) {
    const bandung = getCityOrThrow(cityMap, "Bandung", "Jawa Barat");

    const community = await prisma.community.upsert({
        where: {
            name_cityId: {
                name: "Bandung Circular Living Hub",
                cityId: bandung.id,
            },
        },
        update: {
            type: "CITY",
        },
        create: {
            name: "Bandung Circular Living Hub",
            type: "CITY",
            cityId: bandung.id,
        },
    });

    const user = await prisma.user.upsert({
        where: {
            email: "umkm.makanan@regenlink.demo",
        },
        update: {
            name: "UMKM Makanan",
            passwordHash,
            role: "USER",
            cityId: bandung.id,
        },
        create: {
            name: "UMKM Makanan",
            email: "umkm.makanan@regenlink.demo",
            passwordHash,
            role: "USER",
            cityId: bandung.id,
        },
    });

    await resetUserDemoData(user.id);

    await prisma.communityMember.upsert({
        where: {
            userId_communityId: {
                userId: user.id,
                communityId: community.id,
            },
        },
        update: {
            memberRole: "UMKM Partner",
        },
        create: {
            userId: user.id,
            communityId: community.id,
            memberRole: "UMKM Partner",
        },
    });

    await prisma.energyRecord.createMany({
        data: [
            {
                userId: user.id,
                monthlyKwh: 465,
                electricityCost: 720000,
                housingType: "UMKM",
                occupants: 4,
                dominantDevices: "Freezer, rice cooker, lampu toko, kipas, blender, charger kasir",
                notes: "Biaya listrik tinggi karena freezer dan peralatan produksi makanan aktif harian.",
                recordDate: addDays(new Date(), -20),
            },
            {
                userId: user.id,
                monthlyKwh: 418,
                electricityCost: 645000,
                housingType: "UMKM",
                occupants: 4,
                dominantDevices: "Freezer, lampu LED toko, kipas, blender terjadwal",
                notes: "Mulai mengatur jam operasional alat berdaya tinggi.",
                recordDate: addDays(new Date(), -3),
            },
        ],
    });

    await prisma.wasteRecord.createMany({
        data: [
            {
                userId: user.id,
                wasteType: "FOOD",
                weightKg: 21.5,
                wasteSource: "Sisa produksi dan makanan tidak terjual",
                managementStatus: "SORTED",
                notes: "Food waste dipisahkan dari kemasan plastik.",
                recordDate: addDays(new Date(), -14),
            },
            {
                userId: user.id,
                wasteType: "PLASTIC",
                weightKg: 7.2,
                wasteSource: "Kemasan makanan dan minuman",
                managementStatus: "SENT_TO_WASTE_BANK",
                notes: "Kemasan plastik dikumpulkan untuk mitra daur ulang.",
                recordDate: addDays(new Date(), -6),
            },
            {
                userId: user.id,
                wasteType: "ORGANIC",
                weightKg: 15.8,
                wasteSource: "Sisa bahan makanan",
                managementStatus: "COMPOSTED",
                notes: "Sisa bahan organik diarahkan untuk kompos.",
                recordDate: addDays(new Date(), -2),
            },
        ],
    });

    const foodPlanning = actionMap.get("Food Waste Planning");
    const schedulePower = actionMap.get("Schedule High-Power Device Usage");
    const organicComposting = actionMap.get("Organic Composting");
    const sendWasteBank = actionMap.get("Send Sorted Waste to Waste Bank");

    if (!foodPlanning || !schedulePower || !organicComposting || !sendWasteBank) {
        throw new Error("Required actions for UMKM scenario not found.");
    }

    await createRecommendation({
        userId: user.id,
        actionId: foodPlanning.id,
        confidenceScore: 0.93,
        recommendationReason:
            "Food waste UMKM cukup tinggi dari sisa produksi dan makanan tidak terjual. Perencanaan stok dan produksi harian dapat mengurangi pemborosan bahan.",
    });

    await createRecommendation({
        userId: user.id,
        actionId: schedulePower.id,
        confidenceScore: 0.87,
        recommendationReason:
            "Biaya listrik didominasi freezer, lampu toko, dan alat produksi. Penjadwalan alat berdaya tinggi dapat menurunkan biaya operasional.",
    });

    await createRecommendation({
        userId: user.id,
        actionId: organicComposting.id,
        confidenceScore: 0.82,
        recommendationReason:
            "Sisa bahan organik dari produksi makanan dapat dikomposkan agar tidak menjadi limbah residu.",
    });

    await createCompletedAction({
        userId: user.id,
        actionId: foodPlanning.id,
        notes:
            "Alasan AI: data food waste menunjukkan sisa produksi dan makanan tidak terjual cukup tinggi. Perencanaan stok membantu mengurangi biaya bahan dan limbah.",
        energySaved: 0,
        wasteReduced: 9.6,
        co2Reduced: 4.3,
        costSaved: 85000,
    });

    await createCompletedAction({
        userId: user.id,
        actionId: schedulePower.id,
        notes:
            "Alasan AI: freezer, lampu toko, dan alat produksi menyumbang biaya listrik besar. Jadwal penggunaan alat membantu efisiensi biaya operasional.",
        energySaved: 38.4,
        wasteReduced: 0,
        co2Reduced: 32.6,
        costSaved: 55700,
    });

    await createCompletedAction({
        userId: user.id,
        actionId: sendWasteBank.id,
        notes:
            "Alasan AI: kemasan plastik dari operasional makanan dapat dikumpulkan dan dikirim ke mitra daur ulang.",
        energySaved: 0,
        wasteReduced: 7.2,
        co2Reduced: 3.2,
        costSaved: 0,
    });

    const score = 168;

    await prisma.regenerativeScore.create({
        data: {
            userId: user.id,
            totalScore: score,
            level: getLevelFromScore(score),
            cityRank: 2,
        },
    });

    await unlockBadges(user.id, score, badges);

    for (const challenge of challenges) {
        const progressValue =
            challenge.type === "ENERGY"
                ? 38.4
                : challenge.type === "WASTE"
                    ? 16.8
                    : 55.2;

        await prisma.challengeParticipant.upsert({
            where: {
                challengeId_userId: {
                    challengeId: challenge.id,
                    userId: user.id,
                },
            },
            update: {
                progressValue,
                progressStatus:
                    progressValue >= challenge.targetValue ? "COMPLETED" : "IN_PROGRESS",
            },
            create: {
                challengeId: challenge.id,
                userId: user.id,
                progressValue,
                progressStatus:
                    progressValue >= challenge.targetValue ? "COMPLETED" : "IN_PROGRESS",
            },
        });
    }

    console.log("Seeded scenario: UMKM Makanan");
}

async function main() {
    console.log("Starting REGEN-LINK demo scenario seed...");

    if (DEMO_PASSWORD.length < 8) {
        throw new Error("DEMO_PASSWORD must be at least 8 characters.");
    }

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    const cityMap = await seedCities();
    const actionMap = await seedMasterActions();
    const badges = await seedMasterBadges();
    const challenges = await seedMasterChallenges();

    await seedScenarioMahasiswaKos({
        cityMap,
        actionMap,
        badges,
        challenges,
        passwordHash,
    });

    await seedScenarioKomunitasKampus({
        cityMap,
        actionMap,
        badges,
        challenges,
        passwordHash,
    });

    await seedScenarioUmkmMakanan({
        cityMap,
        actionMap,
        badges,
        challenges,
        passwordHash,
    });

    console.log("Demo scenario seed completed successfully.");
    console.log("Demo accounts:");
    console.log(`- mahasiswa.kos@regenlink.demo / ${DEMO_PASSWORD}`);
    console.log(`- komunitas.kampus@regenlink.demo / ${DEMO_PASSWORD}`);
    console.log(`- umkm.makanan@regenlink.demo / ${DEMO_PASSWORD}`);
}

main()
    .catch((error) => {
        console.error("[DEMO_SCENARIO_SEED_ERROR]", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });