"use client";

import { isSafariBrowser } from "@/lib/browser";
import { MOBILE_MAX } from "@/lib/constants/layout";
import { runAfterLcpIdle, shouldSkipStrands } from "@/lib/strands-gate";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
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
/** Fixed mid energy on mobile — no scroll→energy spring */
const ENERGY_MOBILE_DARK = 0.32;
const ENERGY_MOBILE_LIGHT = 0.08;
/** Static scale when Safari disables scroll-zoom (avoids compositor stutter) */
const SCALE_MOBILE_STATIC = 0.48;

/**
 * Fixed Strands behind the page (rule B):
 * - Skip: reduced-motion / Save-Data / 2g / weak device
 * - Else: mount only after LCP + requestIdleCallback (mobile + desktop)
 */
export function ScrollStrandsBackground() {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    if (reducedMotion || shouldSkipStrands()) return;

    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const syncMobile = () => setIsMobile(mq.matches);
    syncMobile();
    mq.addEventListener("change", syncMobile);

    const stop = runAfterLcpIdle(() => setReady(true));

    return () => {
      mq.removeEventListener("change", syncMobile);
      stop();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;
  if (!ready || isMobile === null) return null;
  if (isMobile) return <ScrollStrandsMobile />;
  return <ScrollStrandsDesktop />;
}

function useThemeLight() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && resolvedTheme === "light";
}

function ScrollStrandsMobile() {
  const [safari] = useState(isSafariBrowser);
  // Safari: no useScroll — static scale only (scroll-linked scale stuttered).
  if (safari) return <ScrollStrandsMobileStatic />;
  return <ScrollStrandsMobileScaled />;
}

function ScrollStrandsMobileShell({
  scale,
  isLight,
}: {
  scale: number | MotionValue<number>;
  isLight: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className={cn(
            "h-[min(100vw,100svh)] w-[min(100vw,100svh)] opacity-85",
          )}
          style={{ scale }}
        >
          <Strands
            className="h-full w-full"
            energy={isLight ? ENERGY_MOBILE_LIGHT : ENERGY_MOBILE_DARK}
            lightMode={isLight}
            glass
            interactive={false}
            clickPulse={false}
            globalPointer={false}
            maxDevicePixelRatio={1}
            intro
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ScrollStrandsMobileStatic() {
  const isLight = useThemeLight();
  return (
    <ScrollStrandsMobileShell scale={SCALE_MOBILE_STATIC} isLight={isLight} />
  );
}

function ScrollStrandsMobileScaled() {
  const isLight = useThemeLight();
  const { scrollYProgress } = useScroll();
  const scrollScale = useTransform(scrollYProgress, [0, 1], [0.36, 0.88]);
  return <ScrollStrandsMobileShell scale={scrollScale} isLight={isLight} />;
}

function ScrollStrandsDesktop() {
  const isLight = useThemeLight();
  const energyCalm = isLight ? ENERGY_CALM_LIGHT : ENERGY_CALM_DARK;
  const { scrollYProgress } = useScroll();

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
  }, [rawX, rawY, strengthRef]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
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
