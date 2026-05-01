import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
    ActionCategory,
    BadgeCategory,
    ChallengeType,
    CommunityType,
    DifficultyLevel,
    PrismaClient,
    Role,
} from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run the production seed.");
}

const pool = new Pool({
    connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

type CitySeed = {
    name: string;
    province: string;
    country: string;
};

function getRequiredEnv(name: string) {
    const value = process.env[name];

    if (!value || value.trim().length === 0) {
        throw new Error(`${name} is required for production seed.`);
    }

    return value.trim();
}

function getOptionalEnv(name: string, fallback: string) {
    const value = process.env[name];

    if (!value || value.trim().length === 0) {
        return fallback;
    }

    return value.trim();
}

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
    const cities: CitySeed[] = [
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
        throw new Error(`City not found after seed: ${name}, ${province}`);
    }

    return city;
}

async function seedCommunities(cityMap: Awaited<ReturnType<typeof seedCities>>) {
    const bogor = getCityOrThrow(cityMap, "Bogor", "Jawa Barat");
    const bandung = getCityOrThrow(cityMap, "Bandung", "Jawa Barat");

    const communities = [
        {
            name: "IPB Climate Action Node",
            type: CommunityType.CAMPUS,
            cityId: bogor.id,
        },
        {
            name: "Bandung Circular Living Hub",
            type: CommunityType.CITY,
            cityId: bandung.id,
        },
    ];

    for (const community of communities) {
        await prisma.community.upsert({
            where: {
                name_cityId: {
                    name: community.name,
                    cityId: community.cityId,
                },
            },
            update: {
                type: community.type,
            },
            create: community,
        });
    }
}

async function seedActions() {
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
}

async function seedBadges() {
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
}

async function seedChallenges() {
    const startDate = new Date();
    const endDate = addDays(startDate, 30);

    const challenges = [
        {
            name: "7-Day Energy Efficiency Sprint",
            type: ChallengeType.ENERGY,
            description:
                "Tantangan hemat energi selama 7 hari dengan fokus pada pengurangan perangkat standby dan penggunaan listrik sadar waktu.",
            startDate,
            endDate,
            targetValue: 50,
        },
        {
            name: "Food Waste Reduction Mission",
            type: ChallengeType.WASTE,
            description:
                "Tantangan mengurangi food waste melalui perencanaan konsumsi, pencatatan sisa makanan, dan aksi kompos.",
            startDate,
            endDate,
            targetValue: 25,
        },
        {
            name: "Cross-City Circular Action",
            type: ChallengeType.CROSS_CITY,
            description:
                "Tantangan lintas kota untuk meningkatkan aksi pemilahan dan pengiriman limbah ke bank sampah.",
            startDate,
            endDate,
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
}

async function seedAdmin(cityMap: Awaited<ReturnType<typeof seedCities>>) {
    const adminName = getOptionalEnv("ADMIN_NAME", "Admin REGEN-LINK");
    const adminEmail = getRequiredEnv("ADMIN_EMAIL").toLowerCase();
    const adminPassword = getRequiredEnv("ADMIN_PASSWORD");
    const adminCityName = getOptionalEnv("ADMIN_CITY_NAME", "Bogor");
    const adminCityProvince = getOptionalEnv("ADMIN_CITY_PROVINCE", "Jawa Barat");

    if (adminPassword.length < 8) {
        throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
    }

    const adminCity = getCityOrThrow(cityMap, adminCityName, adminCityProvince);
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
        where: {
            email: adminEmail,
        },
        update: {
            name: adminName,
            passwordHash,
            role: Role.ADMIN,
            cityId: adminCity.id,
        },
        create: {
            name: adminName,
            email: adminEmail,
            passwordHash,
            role: Role.ADMIN,
            cityId: adminCity.id,
        },
    });

    const currentScore = await prisma.regenerativeScore.findUnique({
        where: {
            userId: admin.id,
        },
    });

    await prisma.regenerativeScore.upsert({
        where: {
            userId: admin.id,
        },
        update: {
            level: getLevelFromScore(currentScore?.totalScore ?? 0),
        },
        create: {
            userId: admin.id,
            totalScore: 0,
            level: "Perintis Aksi",
            cityRank: 0,
        },
    });

    console.log(`Admin account is ready: ${admin.email}`);
}

async function main() {
    console.log("Starting production seed...");

    const cityMap = await seedCities();

    await seedCommunities(cityMap);
    await seedActions();
    await seedBadges();
    await seedChallenges();
    await seedAdmin(cityMap);

    console.log("Production seed completed successfully.");
}

main()
    .catch((error) => {
        console.error("[SEED_ERROR]", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });