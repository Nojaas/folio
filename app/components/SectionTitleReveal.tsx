"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

const titleReveal = {
  duration: 0.65,
  delay: 0.3,
  ease: [0.25, 0.8, 0.25, 1] as const,
};

/** One-shot title reveal: rises into view when visible (no scroll scrub). */
export function SectionTitleReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  if (reduceMotion) {
    return <div className={cn("font-display", className)}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("overflow-hidden font-display", className)}>
      <motion.div
        // em — % y inside overflow:hidden is flaky on Mobile Safari
        initial={{ y: "1.1em", opacity: 0 }}
        animate={inView ? { y: "0em", opacity: 1 } : { y: "1.35em", opacity: 0 }}
        transition={titleReveal}
      >
        {children}
      </motion.div>
    </div>
  );
}
