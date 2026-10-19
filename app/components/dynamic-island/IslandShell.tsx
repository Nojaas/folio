"use client";

import {
  MOBILE_NAV_WIDTH,
  none,
  spring,
} from "@/app/components/dynamic-island/constants";
import { PILL_TONE_DEFAULT } from "@/app/components/PillTabs";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export function IslandShell({
  wide,
  size,
  reduceMotion,
  children,
}: {
  wide: boolean;
  size: { width: number; height: number };
  reduceMotion: boolean | null;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={false}
      animate={
        size.width > 0
          ? {
              width: wide ? MOBILE_NAV_WIDTH : size.width,
              height: size.height,
            }
          : undefined
      }
      transition={reduceMotion ? none : spring}
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-full",
        PILL_TONE_DEFAULT.nav,
      )}
      style={{ borderRadius: 9999 }}
    >
      {children}
    </motion.div>
  );
}
