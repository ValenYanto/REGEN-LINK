import Link from "next/link";

import { Separator } from "@/components/ui/separator";

const footerLinks = [
    {
        label: "Documentation",
        href: "#reports",
    },
    {
        label: "API Access",
        href: "#",
    },
    {
        label: "City Partners",
        href: "#",
    },
    {
        label: "Contact Support",
        href: "#",
    },
];

export function SiteFooter() {
    return (
        <footer id="reports" className="bg-white">
            <Separator className="bg-[#e4e7ec]" />

            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between lg:px-8">
                <div>
                    <p className="font-black text-[#101828]">REGEN-LINK</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#667085]">
                        © 2026 REGEN-LINK. Scientific clarity for climate agency.
                    </p>
                </div>

                <div className="flex flex-wrap gap-6 text-xs font-black uppercase tracking-[0.18em] text-[#667085]">
                    {footerLinks.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="transition hover:text-[#00a66a]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}