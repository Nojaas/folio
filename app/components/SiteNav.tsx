"use client";

import { DynamicIsland } from "@/app/components/dynamic-island";
import { useNavMode } from "@/app/components/dynamic-island/useNavMode";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ISLAND_SLOT_ID } from "@/lib/constants/layout";
import {
  HEADER_STAGGER,
  headerEntranceTransition,
} from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

function NavItem({
  children,
  delay,
  className,
  reduceMotion,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={headerEntranceTransition(delay)}
    >
      {children}
    </motion.div>
  );
}

export function SiteNav() {
  const navMode = useNavMode();
  const reduceMotion = useReducedMotion();

  return (
    <header className="relative w-full px-[10px] pt-[10px]">
      <div className="flex w-full items-start justify-between">
        {/* Anchor for available-state island position */}
        <div
          id={ISLAND_SLOT_ID}
          aria-hidden
          className="h-9 w-[7.5rem] shrink-0"
        />

        {/* Page chrome — fades out when controls move into the island */}
        <motion.div
          className={cn(
            "flex items-center gap-2 pl-[10px] sm:gap-3",
            navMode && "pointer-events-none",
          )}
          initial={false}
          animate={{ opacity: navMode ? 0 : 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
          }
          aria-hidden={navMode}
        >
          {/* Stagger after Disponible (delay 0): lang → theme */}
          <NavItem
            delay={HEADER_STAGGER}
            reduceMotion={reduceMotion}
            className="inline-flex"
          >
            <LanguageToggle />
          </NavItem>
          <NavItem
            delay={HEADER_STAGGER * 2}
            reduceMotion={reduceMotion}
            className="inline-flex"
          >
            <AnimatedThemeToggler />
          </NavItem>
        </motion.div>
      </div>

      <DynamicIsland />
    </header>
  );
}
