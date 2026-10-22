"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MetallicPaint = dynamic(() => import("@/components/MetallicPaint"), {
  ssr: false,
});

const ASTERISK = "/marks/asterisk.svg";

/** Asterisk layout in em (relative to title size) — keep in sync with the span. */
const MARK = {
  size: 0.5,
  /** Offset from the text box top / right (negative = outside). */
  top: -0.18,
  right: -0.28,
  rotate: 28,
} as const;

type HeroMetallicTitleProps = {
  name: string;
  className?: string;
};

export function HeroMetallicTitle({ name, className }: HeroMetallicTitleProps) {
  const { resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lightMode = mounted && resolvedTheme === "light";
  const color = lightMode ? "#b4b4ba" : "#fff";
  const showPaint = mounted && !reduceMotion;

  // Rotated square AABB ≈ size * (|cos| + |sin|) — pad so the mark stays in-flow.
  const rad = (MARK.rotate * Math.PI) / 180;
  const extent =
    MARK.size * (Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad)));
  const padTop = Math.max(0, -MARK.top + (extent - MARK.size) / 2);
  const padRight = Math.max(0, -MARK.right + (extent - MARK.size) / 2);
  const padBottom = (extent - MARK.size) / 2 + 0.06;

  return (
    <div className={cn("relative flex w-full justify-center", className)}>
      <h1
        className="font-display relative text-center text-[clamp(3.25rem,12vw,7.5rem)] leading-[0.9] font-bold tracking-tight text-foreground"
        style={{
          paddingTop: `${padTop}em`,
          paddingRight: `${padRight}em`,
          paddingBottom: `${padBottom}em`,
        }}
      >
        {name}
        {/* Ghost "." keeps the same advance width so the asterisk doesn't shift. */}
        <span className="invisible select-none" aria-hidden>
          .
        </span>
        <span
          className="pointer-events-none absolute size-[0.5em]"
          style={{
            top: `calc(${padTop}em + ${MARK.top}em)`,
            right: `calc(${padRight}em + ${MARK.right}em)`,
            transform: `rotate(${MARK.rotate}deg)`,
          }}
          aria-hidden
        >
          {showPaint ? (
            <MetallicPaint
              imageSrc={ASTERISK}
              scale={1}
              speed={0.7}
              mouseTilt={0}
              softness={0.6}
              density={1.6}
              dispersion={0}
              distortion={0.05}
              edgeBend={0.5}
              angle={50}
              intro
              lightMode={lightMode}
              color={color}
              backgroundColor="transparent"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ASTERISK}
              alt=""
              className="size-full opacity-70 dark:invert"
            />
          )}
        </span>
      </h1>
    </div>
  );
}
