import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { createCommunityMemberSchema } from "@/lib/valdiations/admin";

export async function POST(request: Request) {
    await requireAdmin();

    try {
        const body = await request.json();
        const parsed = createCommunityMemberSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Data member tidak valid.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        const community = await prisma.community.findUnique({
            where: {
                id: parsed.data.communityId,
            },
        });

        if (!community) {
            return NextResponse.json(
                {
                    message: "Community tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                id: parsed.data.userId,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User tidak ditemukan.",
                },
                {
                    status: 404,
                }
            );
        }

        const existingMember = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: {
                    userId: parsed.data.userId,
                    communityId: parsed.data.communityId,
                },
            },
        });

        if (existingMember) {
            return NextResponse.json(
                {
                    message: "User sudah menjadi member community ini.",
                },
                {
                    status: 409,
                }
            );
        }

        const member = await prisma.communityMember.create({
            data: {
                userId: parsed.data.userId,
                communityId: parsed.data.communityId,
                memberRole: parsed.data.memberRole.trim(),
            },
        });

        return NextResponse.json(
            {
                message: "Member berhasil ditambahkan.",
                member,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("[ADMIN_CREATE_COMMUNITY_MEMBER]", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat menambahkan member.",
            },
            {
                status: 500,
            }
        );
    }
}