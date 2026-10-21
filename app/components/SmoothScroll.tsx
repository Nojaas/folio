"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

// Safari iOS: URL-bar show/hide fires vertical resize → ST.refresh mid-scrub → stuck opacity.
ScrollTrigger.config({ ignoreMobileResize: true });
// Keep scrub in sync after background tabs / long frames (Lenis + GSAP).
gsap.ticker.lagSmoothing(0);

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
    // Native scroll backup — Safari can stall Lenis/rAF during momentum touch scroll.
    const onScroll = () => ScrollTrigger.update();
    refresh();
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", onScroll);
    };
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
