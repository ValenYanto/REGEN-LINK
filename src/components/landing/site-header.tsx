"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, Settings, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
    {
        label: "Dashboard",
        href: "#",
        active: true,
    },
    {
        label: "Impact",
        href: "#network",
        active: false,
    },
    {
        label: "Community",
        href: "#community",
        active: false,
    },
    {
        label: "Reports",
        href: "#reports",
        active: false,
    },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-[#e4e7ec] bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-4">
                        <div className="relative h-11 w-11 overflow-hidden rounded-full">
                            <Image
                                src="/logo.png"
                                alt="REGEN-LINK Logo"
                                fill
                                sizes="44px"
                                className="object-contain"
                                priority
                            />
                        </div>

                        <span className="text-lg font-black tracking-[-0.03em] text-[#101828]">
                            REGEN-LINK
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`relative text-sm font-bold transition ${item.active
                                        ? "text-[#00a66a]"
                                        : "text-[#344054] hover:text-[#00a66a]"
                                    }`}
                            >
                                {item.label}
                                {item.active && (
                                    <span className="absolute -bottom-[22px] left-0 h-0.5 w-full rounded-full bg-[#00a66a]" />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="hidden items-center gap-3 text-[#101828] md:flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-[#f2f4f7]"
                        aria-label="Notifications"
                    >
                        <Bell size={19} />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-[#f2f4f7]"
                        aria-label="Settings"
                    >
                        <Settings size={19} />
                    </Button>

                    <Button
                        asChild
                        size="icon"
                        className="rounded-full bg-[#101828] text-white hover:bg-[#00a66a]"
                        aria-label="Login"
                    >
                        <Link href="/login">
                            <UserRound size={17} />
                        </Link>
                    </Button>
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                aria-label="Open menu"
                            >
                                <Menu size={22} />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="border-[#e4e7ec]">
                            <div className="mt-8 flex flex-col gap-3">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`rounded-xl px-4 py-3 text-sm font-black ${item.active
                                                ? "bg-[#dff8ec] text-[#00a66a]"
                                                : "text-[#344054] hover:bg-[#f2f4f7]"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                <Button
                                    asChild
                                    className="mt-4 bg-[#00a66a] font-black text-white hover:bg-[#008f5d]"
                                >
                                    <Link href="/login">Login</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}