"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

const STAGGER = 0.02;

export const downFastSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 22,
  mass: 0.85,
};

type DownFastLabelProps = {
  /** Visible at rest */
  label: string;
  /** Revealed on hover — defaults to duplicating `label` */
  next?: string;
  className?: string;
};

const glyph = (char: string | undefined) =>
  !char || char === " " ? "\u00A0" : char;

/** Letter switch — inherits rest/hover variants from a parent motion node */
export function DownFastLabel({ label, next, className }: DownFastLabelProps) {
  const top = Array.from(label);
  const bottom = Array.from(next ?? label);
  const len = Math.max(top.length, bottom.length);

  return (
    <span className={cn("inline-flex gap-0", className)} aria-hidden>
      {Array.from({ length: len }, (_, i) => {
        const a = top[i];
        const b = bottom[i];
        const wide = a === " " || b === " " || (!a && !b);

        return (
          <span
            key={`${a ?? ""}${b ?? ""}-${i}`}
            className="relative inline-block h-[1.15em] overflow-hidden"
            style={{ width: wide ? "0.3em" : undefined }}
          >
            <motion.span
              className="flex flex-col"
              variants={{
                rest: { y: "0%" },
                hover: { y: "-50%" },
              }}
              transition={{
                ...downFastSpring,
                delay: i * STAGGER,
              }}
            >
              <span className="flex h-[1.15em] items-center">{glyph(a)}</span>
              <span className="flex h-[1.15em] items-center">{glyph(b)}</span>
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

type DownFastIconProps = {
  /** Visible at rest */
  children: ReactNode;
  /** Revealed on hover — defaults to duplicating `children` */
  next?: ReactNode;
  className?: string;
  transition?: typeof downFastSpring | { duration: number };
  onAnimationComplete?: (definition: "rest" | "hover") => void;
};

/** Icon switch — same down·fast hover as letter labels */
export function DownFastIcon({
  children,
  next,
  className,
  transition = downFastSpring,
  onAnimationComplete,
}: DownFastIconProps) {
  // Must clone — the same React element can't mount in two slots
  const bottom =
    next ??
    (isValidElement(children)
      ? cloneElement(children as ReactElement)
      : children);

  return (
    <span
      className={cn(
        "relative inline-block h-4.5 w-4.5 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {/*
        Track is 200% of the clip window. y: -50% then moves by exactly
        one icon height (same model as DownFastLabel’s 2×1.15em stack).
      */}
      <motion.span
        className="absolute inset-x-0 top-0 flex h-[200%] w-full flex-col"
        variants={{
          rest: { y: "0%" },
          hover: { y: "-50%" },
        }}
        transition={transition}
        onAnimationComplete={
          onAnimationComplete
            ? (definition) => {
                if (definition === "rest" || definition === "hover") {
                  onAnimationComplete(definition);
                }
              }
            : undefined
        }
      >
        <span className="flex h-1/2 w-full shrink-0 items-center justify-center">
          {children}
        </span>
        <span className="flex h-1/2 w-full shrink-0 items-center justify-center">
          {bottom}
        </span>
      </motion.span>
    </span>
  );
}

type DownFastLinkProps = {
  label: string;
  /** Hover reveal — e.g. other locale on the language toggle */
  nextLabel?: string;
  href: string;
  className?: string;
  external?: boolean;
  download?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

/** Letter switch down · fast with a light spring bounce */
export function DownFastLink({
  label,
  nextLabel,
  href,
  className,
  external,
  download,
  onClick,
  "aria-label": ariaLabel,
}: DownFastLinkProps) {
  return (
    <motion.a
      href={href}
      download={download || undefined}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel ?? label}
      initial="rest"
      whileHover="hover"
      className={cn("inline-flex gap-0", className)}
    >
      <DownFastLabel label={label} next={nextLabel} />
    </motion.a>
  );
}

type DownFastButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
  suppressHydrationWarning?: boolean;
  /** Controlled variant — when set, disables whileHover */
  animate?: "rest" | "hover";
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
};

/** Button shell that drives DownFastLabel / DownFastIcon hover variants */
export function DownFastButton({
  children,
  className,
  onClick,
  "aria-label": ariaLabel,
  suppressHydrationWarning,
  animate,
  onHoverStart,
  onHoverEnd,
}: DownFastButtonProps) {
  const controlled = animate !== undefined;

  return (
    <motion.button
      type="button"
      initial="rest"
      animate={controlled ? animate : undefined}
      whileHover={controlled ? undefined : "hover"}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      aria-label={ariaLabel}
      suppressHydrationWarning={suppressHydrationWarning}
      className={cn("inline-flex items-center justify-center", className)}
    >
      {children}
    </motion.button>
  );
}
