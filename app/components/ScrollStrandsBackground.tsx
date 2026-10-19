"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Strands = dynamic(() => import("@/components/Strands"), { ssr: false });

/** Calm at top of page → Siri energy once scrolling (dark) */
const ENERGY_CALM_DARK = 0.18;
/** Light mode starts fully calm */
const ENERGY_CALM_LIGHT = 0;
const ENERGY_SIRI = 0.72;

/**
 * Fixed Strands behind the page:
 * centered → zoom on scroll, magnetic cursor pull.
 * energy: calm → siri with scroll; hover/click via Strands interactive + clickPulse.
 */
export function ScrollStrandsBackground() {
  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";
  const energyCalm = isLight ? ENERGY_CALM_LIGHT : ENERGY_CALM_DARK;

  const scale = useTransform(scrollYProgress, [0, 1], [0.36, 0.88]);
  const scrollY = useTransform(scrollYProgress, [0, 1], ["-10vh", "0vh"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [0.92, 0.85, 0.65],
  );

  const energyTarget = useTransform(
    scrollYProgress,
    [0, 0.5],
    [energyCalm, ENERGY_SIRI],
  );
  const energySpring = useSpring(energyTarget, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
  });
  const [energy, setEnergy] = useState(ENERGY_CALM_DARK);
  useMotionValueEvent(energySpring, "change", setEnergy);

  const magnetStrength = useTransform(scrollYProgress, [0, 1], [42, 12]);
  const strengthRef = useMotionValue(42);
  useMotionValueEvent(magnetStrength, "change", (v) => strengthRef.set(v));

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const magnetX = useSpring(rawX, { stiffness: 90, damping: 18, mass: 0.4 });
  const magnetY = useSpring(rawY, { stiffness: 90, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const s = strengthRef.get();
      rawX.set(nx * s);
      rawY.set(ny * s);
    };

    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY, reducedMotion, strengthRef]);

  if (reducedMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ y: scrollY }}>
          <motion.div
            className={cn(
              "h-[min(100vw,100vh)] w-[min(100vw,100vh)] will-change-transform",
            )}
            style={{
              x: magnetX,
              y: magnetY,
              scale,
              opacity,
            }}
          >
            <Strands
              className="h-full w-full"
              energy={energy}
              lightMode={isLight}
              globalPointer
              intro
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
