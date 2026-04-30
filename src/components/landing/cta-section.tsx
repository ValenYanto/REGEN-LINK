import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CtaSection() {
    return (
        <section
            id="community"
            className="bg-[#f3f7fa] px-6 pb-20 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                <Card className="overflow-hidden rounded-3xl border-0 bg-[#06c98f] shadow-none">
                    <CardContent className="px-6 py-16 text-center md:px-10">
                        <h2 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-[-0.05em] text-[#033f2d] md:text-5xl">
                            Ready to link your city&apos;s potential?
                        </h2>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#03513a]">
                            Join a network of students, communities, UMKM, and cities using
                            scientific clarity to achieve measurable regenerative living
                            faster.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                asChild
                                className="h-auto rounded-lg bg-[#070319] px-9 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#101828]"
                            >
                                <Link href="/register">Request Access</Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="h-auto rounded-lg border border-white/30 bg-white/10 px-9 py-4 text-sm font-black text-[#033f2d] transition hover:-translate-y-0.5 hover:bg-white/20"
                            >
                                <Link href="#reports">Documentation</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}