"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";

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
        lerp: 0.1,
        wheelMultiplier: 1,
        // Native touch — no smoothed touch, avoids iOS jank / edge fights
        syncTouch: false,
        touchMultiplier: 1,
        overscroll: false,
        smoothWheel: true,
        anchors: false,
      }}
    >
      <ScrollToTopOnLoad />
      {children}
    </ReactLenis>
  );
}
