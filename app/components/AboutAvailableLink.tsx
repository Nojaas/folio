"use client";

import { emitSectionArrived } from "@/app/components/dynamic-island/events";
import { getSectionScrollTarget } from "@/app/components/dynamic-island/scroll";
import ShinyText from "@/components/ShinyText";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";
import { useLayoutEffect, useState, type MouseEvent } from "react";

type AboutAvailableLinkProps = {
  label: string;
  className?: string;
};

/** Geometry shared across themes — only colors / glow differ */
const SHINE = {
  shineWidth: 36,
  softness: 0.8,
  speed: 2.4,
} as const;

type ShineColors = {
  base: string;
  shine: string;
  glow: number;
};

/** CSS color → `rgb()` (ShinyText’s canvas parser can’t read oklch). */
function cssToRgb(value: string): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  document.body.appendChild(probe);
  const css = getComputedStyle(probe).color;
  probe.remove();

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return css;

  ctx.fillStyle = "#000";
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

function colorsForTheme(dark: boolean): ShineColors {
  const fg = cssToRgb("var(--foreground)");
  if (dark) {
    return {
      base: fg, // same white as body text
      // Cool sheen — white-on-white wouldn’t read; glow stays strong
      shine: "#e2e8f0",
      glow: 0.95,
    };
  }
  return {
    base: fg,
    // Soft gray sheen — less punchy than pure white on dark type
    shine: "#c4c4c4",
    glow: 0.1,
  };
}

/** “Disponible” / “Available” → contact, with theme-tuned ShinyText */
export function AboutAvailableLink({
  label,
  className,
}: AboutAvailableLinkProps) {
  const lenis = useLenis();
  const [colors, setColors] = useState<ShineColors | null>(null);

  useLayoutEffect(() => {
    const sync = () => {
      setColors(
        colorsForTheme(document.documentElement.classList.contains("dark")),
      );
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => mo.disconnect();
  }, []);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    history.replaceState(null, "", "#contact");
    emitSectionArrived("contact");

    const target = getSectionScrollTarget("contact", lenis);
    if (target == null) return;

    const current = lenis?.scroll ?? window.scrollY;
    if (Math.abs(current - target) < 4) return;

    if (lenis) {
      lenis.scrollTo(target, { duration: 1.15, offset: 0 });
      return;
    }
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <a
      href="#contact"
      onClick={onClick}
      aria-label={label}
      className={cn(
        // border-b — text-decoration is clipped by ShinyText’s background-clip
        "inline whitespace-nowrap align-baseline border-b-[0.5px] border-foreground pb-px",
        className,
      )}
    >
      {colors ? (
        <ShinyText
          text={label}
          color={colors.base}
          direction="right"
          shineColor={colors.shine}
          glow={colors.glow}
          shineWidth={SHINE.shineWidth}
          softness={SHINE.softness}
          speed={SHINE.speed}
          className="align-baseline font-[inherit] leading-[inherit]"
        />
      ) : (
        <span>{label}</span>
      )}
    </a>
  );
}
