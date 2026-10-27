"use client";

import "lenis/dist/lenis.css";
import { MOBILE_MAX } from "@/lib/constants/layout";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

gsap.registerPlugin(ScrollTrigger);

// Safari iOS: URL-bar show/hide fires vertical resize → ST.refresh mid-scrub → stutter / stuck opacity.
ScrollTrigger.config({ ignoreMobileResize: true });
// Keep scrub in sync after background tabs / long frames (Lenis + GSAP).
gsap.ticker.lagSmoothing(0);

/** True when Lenis rAF/smoothWheel are off — consumers must use window scroll. */
const NativeScrollContext = createContext(true);

export function useNativeScroll() {
  return useContext(NativeScrollContext);
}

/**
 * Touch / small viewports: native scroll (Lenis autoRaf off — no rAF).
 * Desktop fine pointer: Lenis smooth wheel.
 *
 * Always keep the same ReactLenis → children tree so FlowingMenu (and friends)
 * are not remounted when we flip native ↔ Lenis after mount.
 */
function usePreferNativeScroll() {
  const [native, setNative] = useState(true);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const mobile = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const sync = () => setNative(coarse.matches || mobile.matches);
    sync();
    coarse.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    return () => {
      coarse.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
    };
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
 * Touch / mobile: native scroll feel — Lenis stays mounted with autoRaf off
 * so the page tree (FlowingMenu hover, intro IO, etc.) never remounts.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const native = usePreferNativeScroll();

  return (
    <NativeScrollContext.Provider value={native}>
      <ReactLenis
        root
        options={{
          autoRaf: !native,
          lerp: 0.12,
          wheelMultiplier: 0.8,
          syncTouch: false,
          touchMultiplier: 1,
          overscroll: false,
          smoothWheel: !native,
          anchors: false,
        }}
      >
        {native ? (
          <NativeScrollSetup />
        ) : (
          <>
            <ScrollToTopOnLoad />
            <LenisScrollTriggerSync />
          </>
        )}
        {children}
      </ReactLenis>
    </NativeScrollContext.Provider>
  );
}
