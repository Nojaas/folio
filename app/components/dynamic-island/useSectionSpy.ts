"use client";

import {
  SECTIONS,
  type SectionId,
} from "@/app/components/dynamic-island/constants";
import { useCallback, useEffect, useRef, useState } from "react";

/** IntersectionObserver scroll-spy with lock during programmatic nav. */
export function useSectionSpy() {
  const [active, setActive] = useState<SectionId>("about");
  const lockedRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const elements = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!elements.length) return;

    const ratios = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        if (lockedRef.current) return;

        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let best: SectionId | null = null;
        let bestRatio = 0;
        for (const id of SECTIONS) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best && bestRatio > 0) setActive(best);
      },
      {
        rootMargin: "-28% 0px -42% 0px",
        threshold: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 1],
      },
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const unlock = useCallback(() => {
    lockedRef.current = false;
    if (unlockTimerRef.current != null) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }, []);

  const lock = useCallback(() => {
    lockedRef.current = true;
    if (unlockTimerRef.current != null) {
      window.clearTimeout(unlockTimerRef.current);
    }
    unlockTimerRef.current = window.setTimeout(unlock, 1600);
  }, [unlock]);

  useEffect(
    () => () => {
      if (unlockTimerRef.current != null) {
        window.clearTimeout(unlockTimerRef.current);
      }
    },
    [],
  );

  return { active, setActive, lock, unlock };
}
