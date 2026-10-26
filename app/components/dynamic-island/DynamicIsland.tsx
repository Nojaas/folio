"use client";

import { AvailableContent } from "@/app/components/dynamic-island/AvailableContent";
import {
  fade,
  none,
  spring,
  type SectionId,
} from "@/app/components/dynamic-island/constants";
import { IslandShell } from "@/app/components/dynamic-island/IslandShell";
import { NavContent } from "@/app/components/dynamic-island/NavContent";
import { getSectionScrollTarget } from "@/app/components/dynamic-island/scroll";
import { useIslandPosition } from "@/app/components/dynamic-island/useIslandPosition";
import { useNavMode } from "@/app/components/dynamic-island/useNavMode";
import { useSectionSpy } from "@/app/components/dynamic-island/useSectionSpy";
import { useShellSize } from "@/app/components/dynamic-island/useShellSize";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

export function DynamicIsland() {
  const { t, locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { active, setActive, lock, unlock } = useSectionSpy();
  const navMode = useNavMode();
  const [ready, setReady] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const dockBottom = navMode && isMobile;
  const mode = !navMode ? "slot" : dockBottom ? "dock" : "center";
  const pos = useIslandPosition(mode);

  const { measureRef, size } = useShellSize(
    [
      navMode,
      isMobile,
      dockBottom,
      locale,
      t.nav.projects,
      t.nav.stack,
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

      const target = getSectionScrollTarget(id, lenis);
      if (target == null) {
        unlock();
        return;
      }

      const current = lenis?.scroll ?? window.scrollY;
      if (Math.abs(current - target) < 4) {
        unlock();
        return;
      }

      lock();
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.3,
          offset: 0,
          onComplete: unlock,
        });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    },
    [lenis, setActive, lock, unlock],
  );

  const labels: Record<SectionId, string> = {
    projects: t.nav.projects,
    stack: t.nav.stack,
    contact: t.nav.contact,
  };

  const contentFade = reduceMotion ? none : fade;
  const positioned = ready && pos.left > 0;
  const move = reduceMotion || !positioned ? none : spring;

  return (
    <motion.div
      className="pointer-events-none fixed z-[60] w-max max-w-[100vw]"
      initial={false}
      animate={{
        top: pos.top,
        left: pos.left,
        x: pos.centered ? "-50%" : 0,
      }}
      transition={{
        top: move,
        left: move,
        x: move,
      }}
    >
      {/* Disponible / pill: static for LCP — only the dot fades in. */}
      <div className="pointer-events-auto">
        <IslandShell wide={dockBottom} size={size} reduceMotion={reduceMotion}>
          <div
            ref={measureRef}
            className={cn("relative", dockBottom ? "w-[90vw]" : "w-max")}
          >
            <AnimatePresence mode="popLayout">
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
