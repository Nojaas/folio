"use client";

import {
  DownFastButton,
  DownFastIcon,
  downFastSpring,
} from "@/app/components/DownFastLink";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
};

const iconProps = { className: "size-4.5", strokeWidth: 1.75 } as const;

/** Snappier than hover — click shouldn't feel like waiting on the spring */
const clickSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 32,
  mass: 0.7,
};

export const AnimatedThemeToggler = ({ className }: Props) => {
  const { resolvedTheme, setTheme } = useTheme();
  const { locale } = useLocale();
  const [mounted, setMounted] = useState(false);
  /** Icon stack source — may lag theme briefly during the slide */
  const [visualDark, setVisualDark] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [snap, setSnap] = useState(false);

  const animatingRef = useRef(false);
  const targetDarkRef = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeDark = !mounted || resolvedTheme !== "light";

  // Keep icons in sync when idle
  useEffect(() => {
    if (!animatingRef.current) setVisualDark(themeDark);
  }, [themeDark]);

  const snapTo = useCallback((dark: boolean) => {
    animatingRef.current = false;
    setSnap(true);
    setVisualDark(dark);
    setAnimating(false);
    setHovered(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSnap(false));
    });
  }, []);

  const slid = hovered || animating;

  const ariaLabel =
    locale === "en"
      ? visualDark
        ? "Switch to light mode"
        : "Switch to dark mode"
      : visualDark
        ? "Passer en mode clair"
        : "Passer en mode sombre";

  return (
    <DownFastButton
      animate={slid ? "hover" : "rest"}
      aria-label={ariaLabel}
      className={cn(
        "relative z-20 overflow-hidden text-foreground focus-visible:outline-none",
        className,
      )}
      onHoverStart={() => {
        if (!animatingRef.current) setHovered(true);
      }}
      onHoverEnd={() => {
        if (!animatingRef.current) setHovered(false);
      }}
      onClick={() => {
        // Mid-slide re-click: revert theme + spring back (no waiting on complete)
        if (animatingRef.current) {
          targetDarkRef.current = visualDark;
          setTheme(visualDark ? "dark" : "light");
          animatingRef.current = false;
          setAnimating(false);
          setHovered(false);
          return;
        }

        const nextDark = !visualDark;
        targetDarkRef.current = nextDark;
        // Theme updates immediately — icon catches up via down·fast
        setTheme(nextDark ? "dark" : "light");

        if (hovered) {
          snapTo(nextDark);
          return;
        }

        animatingRef.current = true;
        setAnimating(true);
      }}
    >
      <DownFastIcon
        next={visualDark ? <Sun {...iconProps} /> : <Moon {...iconProps} />}
        transition={
          snap ? { duration: 0 } : animating ? clickSpring : downFastSpring
        }
        onAnimationComplete={(definition) => {
          if (animatingRef.current && definition === "hover") {
            snapTo(targetDarkRef.current);
          }
        }}
      >
        {visualDark ? <Moon {...iconProps} /> : <Sun {...iconProps} />}
      </DownFastIcon>
    </DownFastButton>
  );
};
