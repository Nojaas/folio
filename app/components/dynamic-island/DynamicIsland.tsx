"use client";

import { AvailableContent } from "@/app/components/dynamic-island/AvailableContent";
import {
  fade,
  none,
  SCROLL_THRESHOLD,
  spring,
  type SectionId,
} from "@/app/components/dynamic-island/constants";
import { IslandShell } from "@/app/components/dynamic-island/IslandShell";
import { NavContent } from "@/app/components/dynamic-island/NavContent";
import { emitSectionArrived } from "@/app/components/dynamic-island/events";
import { getSectionScrollTarget } from "@/app/components/dynamic-island/scroll";
import { useIslandPosition } from "@/app/components/dynamic-island/useIslandPosition";
import { useSectionSpy } from "@/app/components/dynamic-island/useSectionSpy";
import { useShellSize } from "@/app/components/dynamic-island/useShellSize";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

export function DynamicIsland() {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { active, setActive, lock, unlock } = useSectionSpy();
  const [navMode, setNavMode] = useState(false);
  const [ready, setReady] = useState(false);

  const lenis = useLenis((instance) => {
    const next = instance.scroll > SCROLL_THRESHOLD;
    setNavMode((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > SCROLL_THRESHOLD;
      setNavMode((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 220);
    return () => window.clearTimeout(id);
  }, []);

  const dockBottom = navMode && isMobile;
  const mode = !navMode ? "slot" : dockBottom ? "dock" : "center";
  const pos = useIslandPosition(mode);

  const { measureRef, size } = useShellSize(
    [
      navMode,
      isMobile,
      dockBottom,
      t.nav.about,
      t.nav.projects,
      t.nav.contact,
      t.nav.available,
    ].join("|"),
  );

  const onNavClick = useCallback(
    (id: SectionId) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setActive(id);
      history.replaceState(null, "", `#${id}`);
      // Start reveal autoplay with the scroll — avoids a pause at scroll end
      emitSectionArrived(id);

      const target = getSectionScrollTarget(id, lenis);
      if (target == null) return;

      const current = lenis?.scroll ?? window.scrollY;
      if (Math.abs(current - target) < 4) {
        unlock();
        return;
      }

      lock();
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.15,
          offset: 0,
          onComplete: unlock,
        });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
        window.setTimeout(unlock, 1200);
      }
    },
    [lenis, setActive, lock, unlock],
  );

  const labels: Record<SectionId, string> = {
    about: t.nav.about,
    projects: t.nav.projects,
    contact: t.nav.contact,
  };

  const move = reduceMotion ? none : spring;
  const contentFade = reduceMotion ? none : fade;

  return (
    <motion.div
      className="pointer-events-none fixed z-[60] w-max max-w-[100vw]"
      initial={false}
      animate={{
        top: pos.top,
        left: pos.left,
        x: pos.centered ? "-50%" : 0,
        opacity: ready && pos.left > 0 ? 1 : 0,
      }}
      transition={{
        top: move,
        left: move,
        x: move,
        opacity: reduceMotion
          ? none
          : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
      }}
    >
      <div className="pointer-events-auto">
        <IslandShell wide={dockBottom} size={size} reduceMotion={reduceMotion}>
          <div
            ref={measureRef}
            className={cn("relative", dockBottom ? "w-[90vw]" : "w-max")}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {!navMode ? (
                <AvailableContent
                  label={t.nav.available}
                  reduceMotion={reduceMotion}
                  transition={contentFade}
                />
              ) : (
                <NavContent
                  active={active}
                  labels={labels}
                  wide={dockBottom}
                  reduceMotion={reduceMotion}
                  transition={contentFade}
                  onNavClick={onNavClick}
                />
              )}
            </AnimatePresence>
          </div>
        </IslandShell>
      </div>
    </motion.div>
  );
}
