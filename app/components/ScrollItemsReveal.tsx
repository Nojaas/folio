"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Children, useRef, useState, type ReactNode } from "react";

function ScrubItem({
  children,
  index,
  total,
  progress,
  locked,
}: {
  children: ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
  locked: boolean;
}) {
  const start = index / (total + 1);
  const end = (index + 1) / (total + 1);
  const scrubY = useTransform(progress, [start, end], ["115%", "0%"]);

  return (
    <div className="scroll-line-mask">
      <motion.div
        className="will-change-transform"
        style={locked ? { y: "0%" } : { y: scrubY }}
      >
        {children}
      </motion.div>
    </div>
  );
}

type ScrollItemsRevealProps = {
  children: ReactNode;
  className?: string;
  /** Once fully revealed, keep items visible (no re-hide on scroll up) */
  lockWhenComplete?: boolean;
};

/** Scrub reveal per child — optionally locks when fully shown */
export function ScrollItemsReveal({
  children,
  className,
  lockWhenComplete = false,
}: ScrollItemsRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [locked, setLocked] = useState(false);
  const items = Children.toArray(children);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start 85%", "center 40%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!lockWhenComplete || locked) return;
    if (value >= 0.98) setLocked(true);
  });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={rootRef} className={cn(className)}>
      {items.map((child, index) => (
        <ScrubItem
          key={index}
          index={index}
          total={items.length}
          progress={scrollYProgress}
          locked={locked}
        >
          {child}
        </ScrubItem>
      ))}
    </div>
  );
}
