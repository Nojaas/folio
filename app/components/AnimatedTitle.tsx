"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

/* Soft decelerate — keeps the rise, less snap at the start */
const EASE = [0.22, 1, 0.36, 1] as const;

type AnimatedTitleProps = {
  text: string;
  delay?: number;
  className?: string;
  trigger?: "load" | "inView";
};

export function AnimatedTitle({
  text,
  delay = 0.5,
  className,
  trigger = "load",
}: AnimatedTitleProps) {
  const reducedMotion = useReducedMotion();
  const chars = text.split("");
  const containerRef = useRef<HTMLHeadingElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const fit = () => {
      const container = containerRef.current;
      const measure = measureRef.current;
      if (!container || !measure) return;

      const available = container.clientWidth;
      if (available <= 0) return;

      // Measure with the same per-letter inline-block layout as the render
      const sample = 100;
      measure.style.fontSize = `${sample}px`;
      const measured = measure.scrollWidth;
      if (measured <= 0) return;

      // Tiny safety so the last glyph (.) never kisses the edge
      setFontSize(((available - 1) / measured) * sample);
    };

    fit();
    const ro = new ResizeObserver(fit);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", fit);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [text]);

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };

  const char: Variants = {
    hidden: {
      y: "90%",
      rotateX: 80,
    },
    show: {
      y: "0%",
      rotateX: 0,
      transition: {
        duration: 1.45,
        ease: EASE,
      },
    },
  };

  const titleClass = cn(
    // pb keeps descenders (Y) inside the overflow box — no nested scroll
    "block w-full overflow-x-clip overflow-y-clip pb-[0.32em] font-semibold leading-none tracking-tight text-foreground",
    className,
  );

  const sizeStyle = fontSize
    ? { fontSize: `${fontSize}px` }
    : { fontSize: "clamp(2.5rem, 12vw, 10rem)" };

  const measureChars = (
    <span
      ref={measureRef}
      className="invisible absolute left-0 top-0 whitespace-nowrap font-semibold tracking-tight"
      aria-hidden
      style={{ fontKerning: "none" }}
    >
      {chars.map((charValue, i) => (
        <span key={`m-${charValue}-${i}`} className="inline-block">
          {charValue === " " ? "\u00A0" : charValue}
        </span>
      ))}
    </span>
  );

  if (reducedMotion) {
    return (
      <h1 ref={containerRef} className={titleClass} style={sizeStyle}>
        {measureChars}
        {text}
      </h1>
    );
  }

  return (
    <h1
      ref={containerRef}
      aria-label={text}
      className={cn(titleClass, "relative")}
      style={sizeStyle}
    >
      {measureChars}
      <motion.span
        aria-hidden
        className="animated-title-line inline-block whitespace-nowrap"
        variants={container}
        initial="hidden"
        {...(trigger === "inView"
          ? {
              whileInView: "show",
              viewport: { once: true, amount: 0.5 },
            }
          : { animate: "show" })}
      >
        {chars.map((charValue, i) => (
          <motion.span
            key={`${charValue}-${i}`}
            variants={char}
            className="animated-title-char inline-block will-change-transform"
          >
            {charValue === " " ? "\u00A0" : charValue}
          </motion.span>
        ))}
      </motion.span>
    </h1>
  );
}
