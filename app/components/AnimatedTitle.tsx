"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion, type Variants } from "motion/react";

/** Softer than the reference curve — less snap at the start, longer settle. */
const CHAR_EASE = [0.45, 0, 0.1, 1] as const;
const CHAR_DURATION = 1.15;
const STAGGER = 0.02;

const containerVariants = (delayChildren: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: STAGGER,
      delayChildren,
    },
  },
});

const charVariants: Variants = {
  hidden: {
    y: "90%",
    rotateX: 90,
  },
  show: {
    y: "0%",
    rotateX: 0,
    transition: {
      duration: CHAR_DURATION,
      ease: CHAR_EASE,
    },
  },
};

export type AnimatedTitleProps = {
  text: string;
  /** Seconds before the cascade starts (default 0.5). */
  delay?: number;
  className?: string;
  trigger?: "load" | "inView";
};

export function AnimatedTitle({
  text,
  delay = 0.1,
  className,
  trigger = "load",
}: AnimatedTitleProps) {
  const reduceMotion = useReducedMotion();

  const titleClass = cn(
    "font-display relative pb-1 text-center text-[clamp(3.25rem,12vw,7.5rem)] leading-[1.15] font-bold tracking-tight text-foreground",
    className,
  );

  if (reduceMotion) {
    return (
      <div className="flex w-full justify-center">
        <h1 className={titleClass}>{text}</h1>
      </div>
    );
  }

  const chars = Array.from(text);

  return (
    <div className="flex w-full justify-center">
      <h1 className={titleClass} aria-label={text}>
        <motion.span
          className="scroll-line-mask inline-block [font-kerning:none] [perspective:2000px] whitespace-nowrap"
          aria-hidden
          variants={containerVariants(delay)}
          initial="hidden"
          {...(trigger === "inView"
            ? {
                whileInView: "show" as const,
                viewport: { once: true, amount: 0.5 },
              }
            : { animate: "show" as const })}
        >
          {chars.map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              className="inline-block origin-[50%_100%]"
              variants={charVariants}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>
      </h1>
    </div>
  );
}
