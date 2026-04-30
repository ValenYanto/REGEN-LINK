import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        include: {
            city: true,
            regenerativeScore: true,
        },
    });

    if (!user) {
        redirect("/login");
    }

    if (user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return user;
}