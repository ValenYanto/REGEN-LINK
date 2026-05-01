"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
    ArrowRight,
    BarChart3,
    Bot,
    Building2,
    CheckCircle2,
    CircleGauge,
    ClipboardList,
    Flame,
    Gauge,
    Leaf,
    LineChart,
    Menu,
    Network,
    Recycle,
    ShieldCheck,
    Sparkles,
    Trophy,
    X,
    Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

const navItems = [
    { label: "Platform", href: "#platform" },
    { label: "Features", href: "#features" },
    { label: "Impact", href: "#impact" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Demo", href: "#demo" },
];

const demoMetrics = [
    { value: "3.072", label: "kWh energy recorded" },
    { value: "94,4", label: "kg waste tracked" },
    { value: "20", label: "completed actions" },
    { value: "5", label: "connected cities" },
];

const featureCards = [
    {
        icon: Zap,
        title: "Energy Input Center",
        description:
            "Catat kWh bulanan, biaya listrik, tipe hunian, jumlah penghuni, dan perangkat dominan.",
        tag: "Energy",
    },
    {
        icon: Recycle,
        title: "Waste Tracking",
        description:
            "Pantau jenis limbah, berat, sumber, dan status pengelolaan untuk aksi sirkular.",
        tag: "Circular",
    },
    {
        icon: Bot,
        title: "AI Recommendation Engine",
        description:
            "Ubah data energi dan limbah menjadi rekomendasi aksi yang relevan dan mudah dilakukan.",
        tag: "AI",
    },
    {
        icon: BarChart3,
        title: "Impact Calculator",
        description:
            "Hitung estimasi energi dihemat, limbah dikurangi, CO2 dihindari, dan biaya dihemat.",
        tag: "Impact",
    },
    {
        icon: Trophy,
        title: "Regenerative Score & Badges",
        description:
            "Aksi selesai menaikkan score, level, dan membuka badge kontribusi.",
        tag: "Score",
    },
    {
        icon: Flame,
        title: "Climate Challenges",
        description:
            "Jalankan challenge energy, waste, circular, community, dan cross-city.",
        tag: "Gamified",
    },
    {
        icon: LineChart,
        title: "Leaderboard",
        description:
            "Bandingkan kontribusi user berdasarkan score, completed actions, dan badge.",
        tag: "Ranking",
    },
    {
        icon: Building2,
        title: "City Insights",
        description:
            "Agregasi aksi individu menjadi insight kota untuk pilot komunitas dan stakeholder.",
        tag: "City",
    },
    {
        icon: ShieldCheck,
        title: "Admin Control Center",
        description:
            "Kelola users, action master, challenges, badges, cities, dan communities.",
        tag: "Ops",
    },
];

const howItWorks = [
    {
        title: "Record behavior",
        description: "Masukkan data energi dan limbah harian atau bulanan.",
        icon: ClipboardList,
    },
    {
        title: "Generate recommendations",
        description: "AI memilih aksi prioritas dari profil dan histori user.",
        icon: Sparkles,
    },
    {
        title: "Complete actions",
        description: "Mulai aksi, tandai selesai, dan simpan progress.",
        icon: CheckCircle2,
    },
    {
        title: "Track city impact",
        description: "Score, badge, leaderboard, dan city insight ikut bergerak.",
        icon: Network,
    },
];

const adminModules = [
    "Users & Roles",
    "Action Master",
    "Challenges",
    "Badges",
    "Cities",
    "Communities",
];

const cityRanks = [
    { city: "Bogor", value: 92 },
    { city: "Surabaya", value: 78 },
    { city: "Jakarta", value: 66 },
];

export function LandingPage() {
    return (
        <main className="min-h-screen overflow-x-hidden bg-[#f7faf6] text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-50">
            <LandingNavbar />
            <HeroSection />
            <MetricsStrip />
            <ProblemSolutionSection />
            <FeatureGrid />
            <HowItWorksSection />
            <CrossCitySection />
            <AdminPreviewSection />
            <CtaSection />
            <SiteFooter />
        </main>
    );
}

function LandingNavbar() {
    const [open, setOpen] = useState(false);

    return (
        <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85"
        >
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex min-w-0 items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="REGEN-LINK"
                        width={40}
                        height={40}
                        className="rounded-2xl"
                        priority
                    />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
                            REGEN-LINK
                        </p>
                        <p className="truncate text-[10px] uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                            Climate Action
                        </p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-6 lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <ThemeToggle />
                    <Button asChild variant="outline" className="rounded-2xl border-emerald-900/10 bg-white text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50 dark:hover:bg-white/[0.1]">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="rounded-2xl bg-emerald-950 text-emerald-50 hover:bg-emerald-900 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                        <Link href="/register">
                            Get Started
                            <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </Button>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setOpen((value) => !value)}
                    className="rounded-2xl border-emerald-900/10 bg-white text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50 lg:hidden"
                    aria-label="Toggle navigation"
                >
                    {open ? <X className="size-4" /> : <Menu className="size-4" />}
                </Button>
            </div>

            {open ? (
                <div className="border-t border-emerald-900/10 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950 lg:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="rounded-2xl px-3 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-white/10"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="mt-3 flex items-center justify-between rounded-2xl border border-emerald-900/10 bg-[#f7faf6] px-3 py-2 dark:border-white/10 dark:bg-white/[0.06]">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-300">
                                Theme
                            </span>
                            <ThemeToggle />
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <Button asChild variant="outline" className="rounded-2xl border-emerald-900/10 bg-white text-emerald-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild className="rounded-2xl bg-emerald-950 text-emerald-50 dark:bg-emerald-300 dark:text-emerald-950">
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </motion.header>
    );
}

function HeroSection() {
    const reduceMotion = useReducedMotion();

    return (
        <section id="platform" className="relative overflow-hidden">
            <div className="absolute left-[-140px] top-[-140px] size-[360px] rounded-full bg-emerald-200/70 blur-3xl dark:bg-emerald-500/10" />
            <div className="absolute bottom-[-180px] right-[-120px] size-[420px] rounded-full bg-lime-200/60 blur-3xl dark:bg-lime-400/10" />
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:px-8 lg:py-20">
                <Reveal className="min-w-0">
                    <Badge className="mb-6 w-fit border-emerald-200 bg-white px-3 py-1.5 text-emerald-800 shadow-sm hover:bg-white dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/10">
                        <Sparkles className="mr-1.5 size-3.5" />
                        AI-Powered Climate Action Platform
                    </Badge>
                    <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-5xl lg:text-6xl">
                        Turn daily energy and waste habits into{" "}
                        <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-lime-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-lime-200 dark:to-teal-300">
                            measurable climate action.
                        </span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
                        REGEN-LINK membantu mahasiswa, komunitas, UMKM, dan kota
                        mencatat data energi/limbah, menerima rekomendasi AI,
                        menghitung dampak, dan berkolaborasi lintas kota.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button asChild className="h-12 rounded-2xl bg-emerald-950 px-6 text-emerald-50 hover:bg-emerald-900 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                            <Link href="/register">
                                Mulai Sekarang
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-12 rounded-2xl border-emerald-900/10 bg-white px-6 text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50 dark:hover:bg-white/[0.1]">
                            <Link href="/login">Lihat Dashboard Demo</Link>
                        </Button>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="rounded-full border border-emerald-900/10 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/[0.06]">
                            MVP without IoT
                        </span>
                        <span className="rounded-full border border-emerald-900/10 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/[0.06]">
                            Campus and city pilot ready
                        </span>
                        <span className="rounded-full border border-emerald-900/10 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/[0.06]">
                            Rule-based AI now, scalable ML later
                        </span>
                    </div>
                </Reveal>

                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
                    className="min-w-0"
                >
                    <motion.div
                        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                    >
                        <DashboardMockup />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

function DashboardMockup() {
    return (
        <div className="relative w-full min-w-0 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white/80 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-5">
            <div className="absolute right-[-80px] top-[-80px] size-52 rounded-full bg-emerald-200/60 blur-3xl dark:bg-emerald-400/10" />
            <div className="relative">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Climate Telemetry
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-emerald-950 dark:text-emerald-50">
                            Regenerative Score
                        </h2>
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <Gauge className="size-5" />
                    </div>
                </div>

                <div className="rounded-3xl border border-emerald-900/10 bg-[#f7faf6] p-5 dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-end justify-between gap-4">
                        <p className="text-5xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
                            84.2
                        </p>
                        <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-300 dark:text-emerald-950">
                            Bogor #1
                        </Badge>
                    </div>
                    <ProgressLine value={84} />
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        AI Recommendation: Kurangi standby power dan mulai waste
                        sorting challenge.
                    </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <MockMetric icon={Zap} label="Energy Saved" value="128 kWh" />
                    <MockMetric icon={Recycle} label="Waste Reduced" value="42 kg" />
                    <MockMetric icon={Leaf} label="CO2 Avoided" value="76 kg" />
                    <MockMetric icon={CircleGauge} label="Cost Saved" value="Rp148k" />
                </div>
            </div>
        </div>
    );
}

function MetricsStrip() {
    return (
        <section className="border-y border-emerald-900/10 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-4 py-6 sm:px-6 md:grid-cols-4 lg:px-8">
                {demoMetrics.map((item, index) => (
                    <Reveal key={item.label} delay={index * 0.04}>
                        <div className="rounded-3xl border border-emerald-900/10 bg-white/80 p-4 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                            <p className="text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
                                {item.value}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                {item.label}
                            </p>
                            <p className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-300">
                                MVP demo telemetry
                            </p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

function ProblemSolutionSection() {
    return (
        <section id="impact" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                    Why REGEN-LINK?
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-4xl">
                    From fragmented habits to coordinated climate action.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    Aksi hemat energi dan pengelolaan limbah sering berjalan
                    terpisah. REGEN-LINK menyatukan data, rekomendasi, impact
                    analytics, dan kolaborasi kota dalam satu platform.
                </p>
            </Reveal>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
                <Reveal>
                    <InfoPanel
                        label="Current gap"
                        title="Data sulit berubah menjadi aksi."
                        items={[
                            "Konsumsi energi dan limbah tercatat terpisah.",
                            "Kontribusi komunitas sulit diukur secara konsisten.",
                            "Kota dan komunitas butuh insight yang mudah dibandingkan.",
                        ]}
                    />
                </Reveal>
                <Reveal delay={0.08}>
                    <InfoPanel
                        label="REGEN-LINK solution"
                        title="Input, AI, impact, action, score, city insight."
                        items={[
                            "AI merekomendasikan aksi dari data energy dan waste.",
                            "Impact calculator mengukur savings dan CO2 avoided.",
                            "Score, badge, challenge, dan city insights membuat aksi berkelanjutan.",
                        ]}
                    />
                </Reveal>
            </div>
        </section>
    );
}

function FeatureGrid() {
    return (
        <section id="features" className="bg-white/55 py-16 dark:bg-white/[0.02]">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                        Platform Features
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-4xl">
                        Built for daily action, campus pilots, and city-level insight.
                    </h2>
                </Reveal>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featureCards.map((feature, index) => (
                        <Reveal key={feature.title} delay={index * 0.04}>
                            <FeatureCard feature={feature} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorksSection() {
    return (
        <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                    How It Works
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-4xl">
                    A simple data flow for measurable regenerative action.
                </h2>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-4">
                {howItWorks.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <Reveal key={step.title} delay={index * 0.05}>
                            <div className="relative h-full rounded-[2rem] border border-emerald-900/10 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                                <div className="mb-5 flex items-center justify-between">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                        <Icon className="size-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400">
                                        0{index + 1}
                                    </span>
                                </div>
                                <h3 className="text-base font-semibold text-emerald-950 dark:text-emerald-50">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    {step.description}
                                </p>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

function CrossCitySection() {
    return (
        <section id="demo" className="bg-emerald-950 py-16 text-emerald-50 dark:bg-white/[0.03]">
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8">
                <Reveal>
                    <Badge className="mb-5 border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/10 dark:bg-emerald-400/10 dark:text-emerald-200">
                        Cross-City Intelligence
                    </Badge>
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Turn individual action into city-level insight.
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-emerald-50/75 dark:text-slate-400">
                        REGEN-LINK menggabungkan aksi individu menjadi insight kota.
                        Kota bisa dibandingkan berdasarkan score, completed action,
                        badge, energy record, dan waste record.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        <Badge className="bg-white/10 text-emerald-50 hover:bg-white/10 dark:bg-white/[0.06]">
                            Best practice replication
                        </Badge>
                        <Badge className="bg-white/10 text-emerald-50 hover:bg-white/10 dark:bg-white/[0.06]">
                            Community challenge ready
                        </Badge>
                    </div>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur dark:bg-white/[0.06]">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/70">
                                    City Ranking
                                </p>
                                <h3 className="mt-1 text-xl font-semibold">Demo city nodes</h3>
                            </div>
                            <Building2 className="size-5 text-emerald-300" />
                        </div>
                        <div className="space-y-4">
                            {cityRanks.map((city, index) => (
                                <div key={city.city} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                    <div className="mb-2 flex items-center justify-between gap-4">
                                        <p className="font-semibold">
                                            {index + 1}. {city.city}
                                        </p>
                                        <p className="text-sm text-emerald-200">{city.value}%</p>
                                    </div>
                                    <ProgressLine value={city.value} light />
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function AdminPreviewSection() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
                <Reveal>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                        Admin Ready
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-4xl">
                        Not just a user app. A full operating layer.
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        Admin Control Center memastikan REGEN-LINK siap dipakai untuk
                        demo stakeholder, pilot kampus, komunitas kota, dan operator
                        program climate action.
                    </p>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {adminModules.map((module) => (
                            <div
                                key={module}
                                className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none"
                            >
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                    <ShieldCheck className="size-4" />
                                </div>
                                <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                                    {module}
                                </p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function CtaSection() {
    return (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none sm:p-12">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 sm:text-4xl">
                    Ready to build measurable regenerative action?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                    Mulai dari data sederhana, ubah menjadi rekomendasi, aksi,
                    skor, dan dampak lintas kota.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button asChild className="h-12 rounded-2xl bg-emerald-950 px-6 text-emerald-50 hover:bg-emerald-900 dark:bg-emerald-300 dark:text-emerald-950 dark:hover:bg-emerald-200">
                        <Link href="/register">Create Account</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 rounded-2xl border-emerald-900/10 bg-white px-6 text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-50">
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </Reveal>
        </section>
    );
}

function SiteFooter() {
    return (
        <footer className="border-t border-emerald-900/10 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                <div>
                    <p className="text-base font-semibold text-emerald-950 dark:text-emerald-50">
                        REGEN-LINK
                    </p>
                    <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                        Collaborative climate action for energy efficiency,
                        circular waste, and cross-city regenerative living.
                    </p>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        Copyright 2026 REGEN-LINK. MVP demo platform.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {[
                        ["Platform", "#platform"],
                        ["Features", "#features"],
                        ["Impact", "#impact"],
                        ["Login", "/login"],
                        ["Register", "/register"],
                    ].map(([label, href]) => (
                        <Link key={label} href={href} className="hover:text-emerald-700 dark:hover:text-emerald-300">
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}

function FeatureCard({
    feature,
}: {
    feature: {
        icon: React.ElementType;
        title: string;
        description: string;
        tag: string;
    };
}) {
    const Icon = feature.icon;
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full rounded-[2rem] border border-emerald-900/10 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none"
        >
            <div className="mb-5 flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    <Icon className="size-5" />
                </div>
                <Badge variant="outline" className="border-emerald-900/10 bg-white text-emerald-800 dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-200">
                    {feature.tag}
                </Badge>
            </div>
            <h3 className="text-lg font-semibold text-emerald-950 dark:text-emerald-50">
                {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {feature.description}
            </p>
        </motion.div>
    );
}

function InfoPanel({
    label,
    title,
    items,
}: {
    label: string;
    title: string;
    items: string[];
}) {
    return (
        <div className="h-full rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                {label}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-emerald-950 dark:text-emerald-50">
                {title}
            </h3>
            <div className="mt-5 space-y-3">
                {items.map((item) => (
                    <div key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                            {item}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MockMetric({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-emerald-900/10 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                <Icon className="size-4" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-semibold text-emerald-950 dark:text-emerald-50">
                {value}
            </p>
        </div>
    );
}

function ProgressLine({ value, light = false }: { value: number; light?: boolean }) {
    const reduceMotion = useReducedMotion();
    return (
        <div className={light ? "h-2 overflow-hidden rounded-full bg-white/15" : "mt-5 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10"}>
            <motion.div
                initial={reduceMotion ? false : { width: 0 }}
                whileInView={{ width: `${value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={light ? "h-full rounded-full bg-gradient-to-r from-emerald-300 to-lime-200" : "h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 dark:from-emerald-300 dark:to-lime-300"}
            />
        </div>
    );
}

function Reveal({
    children,
    className,
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: "easeOut", delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
