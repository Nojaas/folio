"use client";

import { none, pillSpring } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";

export type PillTabItem<T extends string = string> = {
  id: T;
  label: string;
};

/** Visual recipe for the surface pill bar (Stack / island). */
export type PillTone = {
  nav: string;
  indicator: string;
  active: string;
  idle: string;
};

/** Light: Apple-like black/white · Dark: inverted (light track / dark pill) */
export const PILL_TONE_DEFAULT: PillTone = {
  nav: "rounded-full bg-neutral-950 text-white ring-1 ring-white/15 dark:bg-black dark:text-white dark:ring-white/18",
  indicator: "bg-white dark:bg-white",
  active: "text-neutral-950 dark:text-black",
  idle: "text-white/40 hover:text-white/70 dark:text-white/40 dark:hover:text-white/70",
};

type PillTabsProps<T extends string> = {
  items: readonly PillTabItem<T>[];
  active: T;
  wide?: boolean;
  /** Uppercase labels (Stack categories) */
  uppercase?: boolean;
  /**
   * `surface` — standalone pill bar (Stack).
   * `plain` — tabs only, for use inside Dynamic Island shell.
   */
  variant?: "surface" | "plain";
  /** Overrides surface colors (ignored when variant is `plain` for nav shell) */
  tone?: PillTone;
  className?: string;
  "aria-label"?: string;
  getHref?: (id: T) => string;
  onChange?: (id: T) => void;
  onItemClick?: (
    id: T,
    e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
};

type Indicator = { left: number; width: number };

export function PillTabs<T extends string>({
  items,
  active,
  wide = false,
  uppercase = false,
  variant = "surface",
  tone = PILL_TONE_DEFAULT,
  className,
  "aria-label": ariaLabel = "Tabs",
  getHref,
  onChange,
  onItemClick,
}: PillTabsProps<T>) {
  const reduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const [indicator, setIndicator] = useState<Indicator | null>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const el = itemRefs.current.get(active);
    if (!nav || !el) return;

    const sync = () => {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicator({
        left: elRect.left - navRect.left,
        width: elRect.width,
      });
    };

    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(nav);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [active, wide, uppercase, tone]);

  const setItemRef = (id: T) => (node: HTMLElement | null) => {
    if (node) itemRefs.current.set(id, node);
    else itemRefs.current.delete(id);
  };

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className={cn(
        "relative flex items-center p-1",
        wide ? "w-full" : "w-max gap-0.5",
        variant === "surface" && tone.nav,
        className,
      )}
    >
      {indicator ? (
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1 bottom-1 z-0 rounded-full",
            tone.indicator,
          )}
          initial={false}
          animate={{ left: indicator.left, width: indicator.width }}
          transition={reduceMotion ? none : pillSpring}
        />
      ) : null}

      {items.map((item) => {
        const isActive = active === item.id;
        const sharedClass = cn(
          // Taller tap targets on mobile; desktop stays compact
          "relative z-[1] rounded-full px-3 py-2.5 text-center text-[13px] font-medium tracking-tight sm:px-3.5 sm:py-1.5 sm:text-[13px]",
          "transition-colors duration-300 ease-out",
          uppercase && "text-[12px] uppercase tracking-wide sm:text-[12px]",
          wide && "flex-1",
          isActive ? tone.active : tone.idle,
        );

        const label = <span>{item.label}</span>;

        if (getHref) {
          return (
            <a
              key={item.id}
              ref={setItemRef(item.id)}
              href={getHref(item.id)}
              onClick={(e) => {
                onItemClick?.(item.id, e);
                onChange?.(item.id);
              }}
              className={sharedClass}
              aria-current={isActive ? "true" : undefined}
            >
              {label}
            </a>
          );
        }

        return (
          <button
            key={item.id}
            ref={setItemRef(item.id)}
            type="button"
            onClick={(e) => {
              onItemClick?.(item.id, e);
              onChange?.(item.id);
            }}
            className={sharedClass}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
