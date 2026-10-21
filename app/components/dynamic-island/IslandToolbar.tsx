"use client";

import { LanguageToggle } from "@/app/components/LanguageToggle";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

/** Locale + theme — sits inside the island nav shell (not the page header). */
export function IslandToolbar() {
  return (
    <div className="flex shrink-0 items-center gap-0.5 pr-1.5 pl-0.5">
      <span aria-hidden className="mx-0.5 h-3.5 w-px bg-white/15" />
      <LanguageToggle tone="island" />
      <AnimatedThemeToggler tone="island" />
    </div>
  );
}
