"use client";

import MetallicPaint from "@/components/MetallicPaint";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type HeroMetallicTitleProps = {
  text: string;
  className?: string;
};

export function HeroMetallicTitle({ text, className }: HeroMetallicTitleProps) {
  const { resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [fontFamily, setFontFamily] = useState("Inter, system-ui, sans-serif");

  useEffect(() => {
    setMounted(true);
    // next/font hashed family lives on the document — canvas needs the resolved name
    const resolved = getComputedStyle(document.documentElement).fontFamily;
    if (resolved) setFontFamily(resolved);
  }, []);

  // Match site default (dark) until hydrated
  const lightMode = mounted && resolvedTheme === "light";
  const color = lightMode ? "#b4b4ba" : "#fff";

  return (
    <div className={cn("relative w-full", className)}>
      <h1 className="sr-only">{text}</h1>
      <div
        className="h-[clamp(4.5rem,16vw,9.5rem)] w-full sm:h-[clamp(5.5rem,14vw,10rem)]"
        aria-hidden
      >
        <MetallicPaint
          key={fontFamily}
          text={text}
          fontFamily={fontFamily}
          fontWeight={600}
          scale={1}
          speed={reduceMotion ? 0 : 0.7}
          mouseTilt={0}
          softness={0.6}
          density={1.6}
          dispersion={0}
          distortion={0.05}
          edgeBend={0.5}
          angle={90}
          intro={!reduceMotion}
          paused={!!reduceMotion}
          lightMode={lightMode}
          color={color}
          backgroundColor="transparent"
        />
      </div>
    </div>
  );
}
