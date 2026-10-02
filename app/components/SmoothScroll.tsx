"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";

/** Offset for fixed glass nav (~56px pill + top padding). */
const ANCHOR_OFFSET = -88;

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

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.1,
        wheelMultiplier: 1.15,
        touchMultiplier: 1.1,
        smoothWheel: true,
        anchors: {
          offset: ANCHOR_OFFSET,
        },
      }}
    >
      <ScrollToTopOnLoad />
      {children}
    </ReactLenis>
  );
}
