"use client";

import "lenis/dist/lenis.css";
import { isSafariTouch } from "@/lib/browser";
import { MOBILE_MAX } from "@/lib/constants/layout";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

// Safari iOS: URL-bar show/hide fires vertical resize → ST.refresh mid-scrub → stutter / stuck opacity.
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

/**
 * Keep GSAP ScrollTrigger in sync with Lenis.
 *
 * Safari touch pitfalls we hit before:
 * 1. Manual resize → refresh() undid ignoreMobileResize (URL bar = hitch at scroll start).
 * 2. Lenis rAF + window scroll both calling update() = double main-thread work.
 */
function LenisScrollTriggerSync() {
  const [safariTouch] = useState(() =>
    typeof window !== "undefined" ? isSafariTouch() : false,
  );

  useLenis(() => {
    // On Safari touch, prefer the native scroll listener — Lenis rAF can stall mid-momentum.
    if (safariTouch) return;
    ScrollTrigger.update();
  });

  useEffect(() => {
    ScrollTrigger.refresh();

    const onScroll = () => ScrollTrigger.update();

    // Desktop / non-Safari: refresh layout on resize.
    // Mobile (esp. Safari): skip — URL bar toggle is a vertical resize and was the hitch.
    const onResize = () => {
      if (window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches) return;
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    // Safari: needed. Others: harmless backup if Lenis skips a frame.
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
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
