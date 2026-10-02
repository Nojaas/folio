"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const STAGGER = 0.02;

type DownFastLabelProps = {
  label: string;
  className?: string;
};

/** Letter switch — inherits rest/hover variants from a parent motion node */
export function DownFastLabel({ label, className }: DownFastLabelProps) {
  const chars = label.split("");

  return (
    <span className={cn("inline-flex gap-0", className)} aria-hidden>
      {chars.map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="relative inline-block h-[1.15em] overflow-hidden"
          style={{ width: char === " " ? "0.3em" : undefined }}
        >
          <motion.span
            className="flex flex-col"
            variants={{
              rest: { y: "0%" },
              hover: { y: "-50%" },
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 22,
              mass: 0.85,
              delay: i * STAGGER,
            }}
          >
            <span className="flex h-[1.15em] items-center">
              {char === " " ? "\u00A0" : char}
            </span>
            <span className="flex h-[1.15em] items-center">
              {char === " " ? "\u00A0" : char}
            </span>
          </motion.span>
        </span>
      ))}
    </span>
  );
}

type DownFastLinkProps = {
  label: string;
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
      rel={external ? "noreferrer" : undefined}
      aria-label={ariaLabel ?? label}
      initial="rest"
      whileHover="hover"
      className={cn("inline-flex gap-0", className)}
    >
      <DownFastLabel label={label} />
    </motion.a>
  );
}
