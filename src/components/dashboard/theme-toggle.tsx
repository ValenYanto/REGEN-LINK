"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false
    );

    if (!mounted) {
        return (
            <div
                className="size-9 rounded-2xl border border-emerald-900/10 bg-white/70 dark:border-white/10 dark:bg-white/10"
                aria-hidden="true"
            />
        );
    }

    const currentTheme = theme ?? "light";

    function cycleTheme() {
        if (currentTheme === "light") {
            setTheme("dark");
            return;
        }

        if (currentTheme === "dark") {
            setTheme("system");
            return;
        }

        setTheme("light");
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={cycleTheme}
            className="size-9 rounded-2xl border-emerald-900/10 bg-white/70 text-emerald-950 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/10 dark:text-emerald-50 dark:hover:bg-white/15"
            title={`Theme: ${currentTheme}`}
        >
            {currentTheme === "light" ? <Sun className="size-4" /> : null}
            {currentTheme === "dark" ? <Moon className="size-4" /> : null}
            {currentTheme === "system" ? <Monitor className="size-4" /> : null}
        </Button>
    );
}
