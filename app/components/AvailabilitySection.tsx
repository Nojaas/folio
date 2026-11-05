"use client";

import { AvailabilityDot } from "@/app/components/AvailabilityDot";
import { getSectionScrollTarget } from "@/app/components/dynamic-island/scroll";
import { LineContentReveal } from "@/app/components/LineContentReveal";
import { PillTabs } from "@/app/components/PillTabs";
import { ContentRail, Section } from "@/app/components/Section";
import { SectionTitleReveal } from "@/app/components/SectionTitleReveal";
import { DATA } from "@/data/resume";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";
import { ArrowRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

type EngagementMode = "freelance" | "cdi";

const PANEL_EASE = [0.22, 1, 0.36, 1] as const;

function formatParisTime(locale: string) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function useParisClock(locale: string) {
  const [time, setTime] = useState(() => formatParisTime(locale));

  useEffect(() => {
    const tick = () => setTime(formatParisTime(locale));
    tick();

    let intervalId = 0;
    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeoutId = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, 60_000);
    }, msToNextMinute);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [locale]);

  return time;
}

function MagneticPillLink({
  href,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const enabled = !reduceMotion && !isMobile;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.35 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left - rect.width / 2) * 0.28);
    rawY.set((e.clientY - rect.top - rect.height / 2) * 0.38);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.a
      href={href}
      aria-label={ariaLabel}
      className={className}
      style={enabled ? { x, y } : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.a>
  );
}

export function AvailabilitySection() {
  const { t, locale } = useLocale();
  const copy = t.availability;
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const parisTime = useParisClock(locale);

  const [mode, setMode] = useState<EngagementMode>("freelance");

  const modeItems = [
    { id: "freelance" as const, label: copy.modes.freelance },
    { id: "cdi" as const, label: copy.modes.cdi },
  ];

  const facts = copy.panels[mode];
  const mailSubject =
    mode === "freelance" ? copy.cta.subjectFreelance : copy.cta.subjectCdi;
  const mailto = `mailto:${DATA.contact.email}?subject=${encodeURIComponent(mailSubject)}`;
  const liveLine = copy.liveTime.replace("{time}", parisTime);

  const scrollToProjects = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      history.replaceState(null, "", "#projects");
      const target = getSectionScrollTarget("projects", lenis);
      if (target == null) return;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.3, offset: 0 });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    },
    [lenis],
  );

  return (
    <Section
      id="availability"
      className="flex w-full flex-col justify-center space-y-14 py-24 sm:space-y-16 sm:py-32"
      aria-label={copy.label}
    >
      <SectionTitleReveal
        key={`availability-title-${locale}`}
        className="px-2.5 text-4xl font-bold tracking-tighter text-foreground sm:text-5xl"
      >
        <h2>
          {copy.titleLine1} <br />
          {copy.titleLine2}
        </h2>
      </SectionTitleReveal>

      <ContentRail>
        <div className="flex flex-col gap-10 sm:gap-12">
          <LineContentReveal index={0} leadingLine={false}>
            <div className="space-y-3 pb-2">
              <p className="font-display inline-flex items-center gap-2.5 text-4xl leading-[0.95] font-bold tracking-tighter text-foreground sm:text-5xl">
                <AvailabilityDot
                  delayMs={520}
                  className="size-2.5 text-foreground sm:size-3"
                />
                {copy.status.badge}
              </p>
              <p
                className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground sm:text-[15px]"
                aria-live="polite"
              >
                <span>{liveLine}</span>
                <span aria-hidden className="text-foreground/25">
                  ·
                </span>
                <span>{copy.responseSla}</span>
              </p>
            </div>
          </LineContentReveal>

          <LineContentReveal index={1} leadingLine>
            <div className="flex flex-col gap-8 pt-6 sm:gap-10 sm:pt-8">
              <PillTabs
                items={modeItems}
                active={mode}
                wide={isMobile}
                aria-label={copy.modesLabel}
                onChange={setMode}
                className={isMobile ? "w-full" : undefined}
              />

              <div className="relative min-h-[12.5rem] sm:min-h-[11rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.ul
                    key={mode}
                    role="list"
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.28,
                      ease: PANEL_EASE,
                    }}
                    className="grid grid-cols-1 border-y border-foreground/10 sm:grid-cols-2"
                  >
                    {facts.map((fact, i) => (
                      <li
                        key={`${mode}-${fact.label}`}
                        className={cn(
                          "space-y-1 border-foreground/10 py-5 sm:py-6",
                          i < facts.length - 1 && "border-b sm:border-b-0",
                          i < 2 && "sm:border-b",
                          i % 2 === 0 ? "sm:pr-8" : "sm:border-l sm:pl-8",
                        )}
                      >
                        <p className="text-sm text-muted-foreground">
                          {fact.label}
                        </p>
                        <p className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                          {fact.value}
                        </p>
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <MagneticPillLink
                  href={mailto}
                  aria-label={`${copy.cta.primary} — ${mailSubject}`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium tracking-tight text-background",
                    "transition-opacity hover:opacity-90",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                >
                  {copy.cta.primary}
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0"
                    strokeWidth={2}
                  />
                </MagneticPillLink>

                <a
                  href="#projects"
                  onClick={scrollToProjects}
                  className={cn(
                    "text-sm text-muted-foreground underline-offset-4 transition-colors",
                    "hover:text-foreground hover:underline",
                    "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                >
                  {copy.cta.secondary}
                </a>
              </div>
            </div>
          </LineContentReveal>
        </div>
      </ContentRail>
    </Section>
  );
}
