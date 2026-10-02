"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import "./ScrollVelocity.css";

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  if (range === 0) return min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

function useElementWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const updateWidth = () => {
      if (cancelled) return;
      const next = Math.ceil(el.getBoundingClientRect().width);
      setWidth((prev) => (prev === next ? prev : next));
    };

    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    void document.fonts?.ready.then(updateWidth);

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [ref]);

  return width;
}

type VelocityMapping = {
  input: [number, number];
  output: [number, number];
};

type VelocityTextProps = {
  children: ReactNode;
  baseVelocity?: number;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: CSSProperties;
  scrollerStyle?: CSSProperties;
};

function VelocityText({
  children,
  baseVelocity = 100,
  scrollContainerRef,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
  parallaxStyle,
  scrollerStyle,
}: VelocityTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.1, once: false });
  const reducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const scrollOptions = scrollContainerRef
    ? { container: scrollContainerRef }
    : {};
  const { scrollY } = useScroll(scrollOptions);
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping,
    stiffness,
  });
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false },
  );

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);
  const copyWidthRef = useRef(0);
  const directionFactor = useRef(1);

  useLayoutEffect(() => {
    copyWidthRef.current = copyWidth;
  }, [copyWidth]);

  useAnimationFrame((_t, delta) => {
    if (reducedMotion || !inView) return;

    const width = copyWidthRef.current;
    if (width === 0) return;

    // Cap frame delta to avoid jumps after tab blur / long frames
    const dt = Math.min(delta, 32) / 1000;

    // Soften Lenis velocity spikes
    let factor = velocityFactor.get();
    factor = Math.max(-2, Math.min(2, factor));

    // Ignore near-zero noise so direction doesn't flicker
    if (factor < -0.15) directionFactor.current = -1;
    else if (factor > 0.15) directionFactor.current = 1;

    let moveBy = directionFactor.current * baseVelocity * dt;
    moveBy += directionFactor.current * moveBy * factor;

    const next = wrap(-width, 0, baseX.get() + moveBy);
    baseX.set(next);
  });

  const spans = Array.from({ length: numCopies }, (_, i) => (
    <span className={className} key={i} ref={i === 0 ? copyRef : null}>
      {children}
    </span>
  ));

  return (
    <div ref={rootRef} className={parallaxClassName} style={parallaxStyle}>
      <motion.div
        className={scrollerClassName}
        style={{ x: baseX, ...scrollerStyle }}
      >
        {spans}
      </motion.div>
    </div>
  );
}

export type ScrollVelocityProps = {
  scrollContainerRef?: RefObject<HTMLElement | null>;
  texts?: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: CSSProperties;
  scrollerStyle?: CSSProperties;
};

export function ScrollVelocity({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
  parallaxStyle,
  scrollerStyle,
}: ScrollVelocityProps) {
  return (
    <section className="scroll-velocity">
      {texts.map((text, index) => (
        <VelocityText
          key={`${text}-${index}`}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}
        </VelocityText>
      ))}
    </section>
  );
}
