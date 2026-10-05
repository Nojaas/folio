"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";

const Orb = dynamic(() => import("@/app/components/Orb"), { ssr: false });

/** Resolve theme `--background` to an rgb() string the Orb shader can parse */
function useThemeBackgroundColor() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("rgb(42, 42, 46)");

  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.backgroundColor = "var(--background)";
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).backgroundColor;
    document.body.removeChild(probe);
    if (resolved) setColor(resolved);
  }, [resolvedTheme]);

  return color;
}

/**
 * Fixed Orb behind the page:
 * small & centered above the hero name → limited zoom on scroll,
 * light magnetic pull toward the cursor (stronger while small).
 */
export function ScrollOrbBackground() {
  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const backgroundColor = useThemeBackgroundColor();
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-dependent styles only after mount — avoids SSR hydration mismatch
  const isLight = mounted && resolvedTheme === "light";

  const scale = useTransform(scrollYProgress, [0, 1], [0.36, 1.55]);
  const scrollY = useTransform(scrollYProgress, [0, 1], ["-10vh", "0vh"]);
  const opacityDark = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [0.92, 0.85, 0.65],
  );
  const opacityLight = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [0.85, 0.72, 0.5],
  );

  const magnetStrength = useTransform(scrollYProgress, [0, 1], [42, 12]);
  const strengthRef = useMotionValue(42);
  useMotionValueEvent(magnetStrength, "change", (v) => strengthRef.set(v));

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const magnetX = useSpring(rawX, { stiffness: 90, damping: 18, mass: 0.4 });
  const magnetY = useSpring(rawY, { stiffness: 90, damping: 18, mass: 0.4 });

  const [nearOrb, setNearOrb] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    // Magnet is pointer-only — skip on touch to avoid work during scroll
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const s = strengthRef.get();
      rawX.set(nx * s);
      rawY.set(ny * s);

      const dist = Math.hypot(nx, ny);
      setNearOrb(dist < 0.55);
    };

    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
      setNearOrb(false);
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
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ y: scrollY }}>
          <motion.div
            className={cn(
              "h-[min(100vw,100vh)] w-[min(100vw,100vh)] will-change-transform",
              isLight && "mix-blend-screen",
            )}
            style={{
              x: magnetX,
              y: magnetY,
              scale,
              opacity: isLight ? opacityLight : opacityDark,
            }}
          >
            <Orb
              hoverIntensity={0.3}
              rotateOnHover
              forceHoverState={nearOrb}
              backgroundColor={backgroundColor}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
