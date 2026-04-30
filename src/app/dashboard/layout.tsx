import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
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

    return (
        <DashboardShell
            sidebar={<AppSidebar />}
            header={
                <DashboardHeader
                    user={{
                        name: user.name,
                        email: user.email,
                        city: user.city
                            ? `${user.city.name}, ${user.city.province}`
                            : "Unknown City",
                        level: user.regenerativeScore?.level ?? "Seed",
                    }}
                />
            }
        >
            {children}
        </DashboardShell>
    );
}