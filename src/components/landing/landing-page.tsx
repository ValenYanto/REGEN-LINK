import { CtaSection } from "@/components/landing/cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { MechanismSection } from "@/components/landing/mechanism-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { StatsSection } from "@/components/landing/stats-section";

export function LandingPage() {
    return (
        <main className="min-h-screen bg-[#f7faf8] text-[#101828]">
            <SiteHeader />
            <HeroSection />
            <StatsSection />
            <MechanismSection />
            <CtaSection />
            <SiteFooter />
        </main>
    );
}