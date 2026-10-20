"use client";

import "lenis/dist/lenis.css";
import { MOBILE_MAX } from "@/lib/constants/layout";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

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

function NativeScrollToTop() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}

/**
 * Desktop: Lenis smooth wheel.
 * Mobile: native scroll only — Lenis RAF + sync fights iOS momentum on
 * direction reverses (stutter). Programmatic scrollTo falls back to window
 * (island / about link already handle `lenis` being undefined).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // SSR / first paint — no Lenis yet (avoids mounting it on phones)
  if (isMobile === null) {
    return <>{children}</>;
  }

  if (isMobile) {
    return (
      <>
        <NativeScrollToTop />
        {children}
      </>
    );
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.12,
        wheelMultiplier: 0.8,
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
