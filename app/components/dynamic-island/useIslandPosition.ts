"use client";

import { ISLAND_SLOT_ID, MOBILE_MAX } from "@/lib/constants/layout";
import { useLayoutEffect, useState } from "react";

export type IslandPosition = {
  top: number;
  left: number;
  /** When true, apply x: -50% to center on `left` */
  centered: boolean;
};

const DOCK_OFFSET = 72;

function measure(mode: "slot" | "center" | "dock"): IslandPosition {
  if (mode === "dock") {
    return {
      top: Math.round(window.innerHeight - DOCK_OFFSET),
      left: Math.round(window.innerWidth / 2),
      centered: true,
    };
  }

  const slot = document.getElementById(ISLAND_SLOT_ID);
  const rect = slot?.getBoundingClientRect();
  const slotTop = rect ? Math.max(8, Math.round(rect.top)) : 10;
  const slotLeft = rect ? Math.max(0, Math.round(rect.left)) : 88;

  if (mode === "center") {
    return {
      top: slotTop,
      left: Math.round(window.innerWidth / 2),
      centered: true,
    };
  }

  return { top: slotTop, left: slotLeft, centered: false };
}

/** Layout-viewport positions only — no visualViewport (zoom-safe). */
export function useIslandPosition(
  mode: "slot" | "center" | "dock",
): IslandPosition {
  const [pos, setPos] = useState<IslandPosition>({
    top: 10,
    left: 0,
    centered: false,
  });

  useLayoutEffect(() => {
    const sync = () => setPos(measure(mode));
    sync();

    // Safari toggles the URL bar on scroll reverse → resize spam + spring jank.
    // Debounce on small viewports; desktop stays immediate.
    let resizeTimer: number | null = null;
    const onResize = () => {
      const mobile = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
      if (!mobile) {
        sync();
        return;
      }
      if (resizeTimer != null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        sync();
      }, 120);
    };

    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(onResize);
    const slot = document.getElementById(ISLAND_SLOT_ID);
    if (slot) ro.observe(slot);
    const header = document.querySelector("header");
    if (header) ro.observe(header);

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer != null) window.clearTimeout(resizeTimer);
      ro.disconnect();
    };
  }, [mode]);

  return pos;
}
