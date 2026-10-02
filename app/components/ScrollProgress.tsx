"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/** Thick inset rail — right edge, 10px inset */
export function ScrollProgress() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed top-[18%] right-1.25 z-[70] h-[64%] w-0.5 bg-foreground/10">
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top bg-foreground"
        style={{ scaleY }}
      />
    </div>
  );
}
