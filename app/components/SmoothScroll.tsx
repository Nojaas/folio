"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

function ScrollToTopOnLoad() {
  const lenis = useLenis();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  return null;
}

/** Keep GSAP ScrollTrigger in sync with Lenis (ScrollReveal scrub). */
function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener("resize", refresh);
    return () => window.removeEventListener("resize", refresh);
  }, []);

  return null;
}

/**
 * Lenis everywhere.
 * - Desktop: smoothWheel
 * - Mobile: syncTouch false → native touch momentum (best perf per Lenis docs);
 *   Lenis still runs and syncs scroll. Never call stop()
 *   (`.lenis-stopped { overflow: clip }` locks scrolling).
 * - Anchors disabled: DynamicIsland handles section scrolls (centered).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.12,
        wheelMultiplier: 0.8,
        // Native touch — no smoothed touch, avoids iOS jank / edge fights
        syncTouch: false,
        touchMultiplier: 1,
        overscroll: false,
        smoothWheel: true,
        anchors: false,
      }}
    >
      <ScrollToTopOnLoad />
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
