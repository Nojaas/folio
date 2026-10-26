"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Soft ease — no bounce, aligned with section title feel */
const ease = [0.25, 0.8, 0.25, 1] as const;

const SPEEDS = {
  normal: {
    stagger: 0.14,
    lineDuration: 0.42,
    contentDuration: 0.45,
    contentLag: 0.16,
    trailLag: 0.12,
  },
  /** Pill category switches — same choreography, snappier */
  fast: {
    stagger: 0.06,
    lineDuration: 0.35,
    contentDuration: 0.39,
    contentLag: 0.05,
    trailLag: 0.05,
  },
} as const;

type LineContentRevealSpeed = keyof typeof SPEEDS;

const LINE = "h-px w-full origin-left bg-foreground/10";

type LineContentRevealProps = {
  children: ReactNode;
  index: number;
  className?: string;
  contentClassName?: string;
  /** Draw the line above this block (default true) */
  leadingLine?: boolean;
  /** Draw a closing line under this block (last item) */
  trailingLine?: boolean;
  /** `fast` for in-section pill navigation */
  speed?: LineContentRevealSpeed;
};

/**
 * Line draws (scaleX) → content fades in with a tiny y lift.
 * Staggered by `index` for vertical lists.
 */
export function LineContentReveal({
  children,
  index,
  className,
  contentClassName,
  leadingLine = true,
  trailingLine = false,
  speed = "normal",
}: LineContentRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.28 });
  const reduceMotion = useReducedMotion();
  const timing = SPEEDS[speed];

  const lineDelay = index * timing.stagger;
  const contentDelay = leadingLine ? lineDelay + timing.contentLag : lineDelay;
  const trailDelay = contentDelay + timing.trailLag;

  if (reduceMotion) {
    return (
      <div className={className}>
        {leadingLine ? <div aria-hidden className={LINE} /> : null}
        <div className={contentClassName}>{children}</div>
        {trailingLine ? <div aria-hidden className={LINE} /> : null}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {leadingLine ? (
        <motion.div
          aria-hidden
          className={LINE}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: timing.lineDuration,
            ease,
            delay: lineDelay,
          }}
        />
      ) : null}
      <motion.div
        className={cn(contentClassName)}
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{
          duration: timing.contentDuration,
          ease,
          delay: contentDelay,
        }}
      >
        {children}
      </motion.div>
      {trailingLine ? (
        <motion.div
          aria-hidden
          className={LINE}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: timing.lineDuration,
            ease,
            delay: trailDelay,
          }}
        />
      ) : null}
    </div>
  );
}
