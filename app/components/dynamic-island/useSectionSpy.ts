"use client";

import {
  SECTIONS,
  type SectionId,
} from "@/app/components/dynamic-island/constants";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Viewport line for the active section.
 * Matches getSectionScrollTarget (section centered → mid at ~50%).
 */
const VIEW_LINE = 0.5;
/** Must cover Lenis scrollTo duration (~1.3s) + a little slack. */
const LOCK_MS = 1500;
const CONTACT_BOTTOM_PX = 32;

function readActive(): SectionId {
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  if (window.scrollY >= maxScroll - CONTACT_BOTTOM_PX) return "contact";

  const line = window.innerHeight * VIEW_LINE;
  let current: SectionId = SECTIONS[0];

  for (const id of SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= line) current = id;
  }

  return current;
}

/** Scroll-position spy with lock during programmatic nav. */
export function useSectionSpy() {
  const [active, setActiveState] = useState<SectionId>("projects");
  const activeRef = useRef<SectionId>(active);
  const lockedRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  const setActive = useCallback((id: SectionId) => {
    if (activeRef.current === id) return;
    activeRef.current = id;
    setActiveState(id);
  }, []);

  const sync = useCallback(() => {
    if (lockedRef.current) return;
    setActive(readActive());
  }, [setActive]);

  const scheduleSync = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      sync();
    });
  }, [sync]);

  const unlock = useCallback(() => {
    lockedRef.current = false;
    if (unlockTimerRef.current != null) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
    // Force a fresh read — IO used to skip updates while locked and never catch up.
    setActive(readActive());
  }, [setActive]);

  const lock = useCallback(() => {
    lockedRef.current = true;
    if (unlockTimerRef.current != null) {
      window.clearTimeout(unlockTimerRef.current);
    }
    unlockTimerRef.current = window.setTimeout(unlock, LOCK_MS);
  }, [unlock]);

  useEffect(() => {
    sync();

    const onScroll = () => scheduleSync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleSync);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (unlockTimerRef.current != null) {
        window.clearTimeout(unlockTimerRef.current);
      }
    };
  }, [sync, scheduleSync]);

  return { active, setActive, lock, unlock };
}
