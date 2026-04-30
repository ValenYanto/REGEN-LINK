import { prisma } from "@/lib/prisma";

export async function awardEligibleBadges(userId: string) {
    const regenerativeScore = await prisma.regenerativeScore.findUnique({
        where: {
            userId,
        },
    });

    const totalScore = regenerativeScore?.totalScore ?? 0;

    const eligibleBadges = await prisma.badge.findMany({
        where: {
            requiredScore: {
                lte: totalScore,
            },
        },
        orderBy: {
            requiredScore: "asc",
        },
    });

    if (eligibleBadges.length === 0) {
        return [];
    }

    const awardedBadges = [];

    for (const badge of eligibleBadges) {
        const userBadge = await prisma.userBadge.upsert({
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
            include: {
                badge: true,
            },
        });

        awardedBadges.push(userBadge);
    }

    return awardedBadges;
}