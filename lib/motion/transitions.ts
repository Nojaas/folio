import type { Transition } from "motion/react";

/** Shared island / pill springs — keep Dynamic Island & Stack in sync */
export const spring: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 38,
  mass: 0.72,
};

export const pillSpring: Transition = {
  type: "spring",
  stiffness: 170,
  damping: 23,
  mass: 0.8,
};

export const fade: Transition = {
  duration: 0.14,
  ease: [0.22, 1, 0.36, 1],
};

export const none: Transition = { duration: 0 };
