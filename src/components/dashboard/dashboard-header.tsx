import { Bell, LogOut, Menu, Settings } from "lucide-react";

import { signOut } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type DashboardHeaderProps = {
    user: {
        name: string;
        email: string;
        city: string;
        level: string;
    };
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-[#e4e7ec] bg-white/90 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-5 md:px-8 lg:px-10">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full lg:hidden"
                    >
                        <Menu size={20} />
                    </Button>

                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#00a66a]">
                            Environmental Telemetry
                        </p>
                        <h1 className="text-lg font-black tracking-[-0.03em] text-[#101828] md:text-xl">
                            Welcome back, {user.name}
                        </h1>
                    </div>
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    <div className="text-right">
                        <p className="text-sm font-black text-[#101828]">{user.city}</p>
                        <p className="text-xs font-semibold text-[#667085]">
                            {user.email}
                        </p>
                    </div>

                    <Badge className="rounded-full bg-[#dff8ec] px-3 py-1 text-xs font-black text-[#00734f] hover:bg-[#dff8ec]">
                        {user.level}
                    </Badge>

                    <Separator orientation="vertical" className="h-8 bg-[#e4e7ec]" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-[#f2f4f7]"
                    >
                        <Bell size={18} />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-[#f2f4f7]"
                    >
                        <Settings size={18} />
                    </Button>

                    <form
                        action={async () => {
                            "use server";

                            await signOut({
                                redirectTo: "/login",
                            });
                        }}
                    >
                        <Button
                            type="submit"
                            variant="outline"
                            className="gap-2 rounded-xl border-[#d0d5dd] font-black"
                        >
                            <LogOut size={16} />
                            Logout
                        </Button>
                    </form>
                </div>
            </div>
        </header>
    );
}