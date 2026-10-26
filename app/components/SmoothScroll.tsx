"use client";

import "lenis/dist/lenis.css";
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

function usePreferNativeScroll() {
  const [native, setNative] = useState(true);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const mobile = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
    // Touch / small viewports: native scroll only — no Lenis instance or rAF.
    setNative(coarse || mobile);
  }, []);

  return native;
}

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

function NativeScrollSetup() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    ScrollTrigger.refresh();

    const onScroll = () => ScrollTrigger.update();
    const onResize = () => {
      if (window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches) return;
      ScrollTrigger.refresh();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}

/**
 * Keep GSAP ScrollTrigger in sync with Lenis (desktop fine pointer only).
 */
function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    ScrollTrigger.refresh();

    const onScroll = () => ScrollTrigger.update();
    const onResize = () => {
      if (window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches) return;
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}

/**
 * Desktop (fine pointer, md+): Lenis smooth wheel.
 * Touch / mobile: native scroll — Lenis never mounts (island uses window.scrollTo).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const native = usePreferNativeScroll();

  if (native) {
    return (
      <>
        <NativeScrollSetup />
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
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
