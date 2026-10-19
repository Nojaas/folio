"use client";

import { DynamicIsland } from "@/app/components/dynamic-island";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ISLAND_SLOT_ID } from "@/lib/constants/layout";
import { motion } from "motion/react";

const DELAY = 0.2;

function NavItem({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function SiteNav() {
  return (
    <header className="relative w-full px-[10px] pt-[10px]">
      <div className="flex w-full items-start justify-between">
        {/* Anchor for available-state island position */}
        <div
          id={ISLAND_SLOT_ID}
          aria-hidden
          className="h-9 w-[7.5rem] shrink-0"
        />

        <div className="flex items-center gap-2 pl-[10px] sm:gap-3">
          <NavItem delay={DELAY} className="inline-flex">
            <LanguageToggle />
          </NavItem>
          <NavItem delay={DELAY * 2} className="inline-flex">
            <AnimatedThemeToggler />
          </NavItem>
        </div>
      </div>

      <DynamicIsland />
    </header>
  );
}
