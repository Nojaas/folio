"use client";

import {
  SECTION_ARRIVED_EVENT,
  type SectionArrivedDetail,
} from "@/app/components/dynamic-island/events";
import { measureLines, type LineSegment } from "@/lib/measure-lines";
import { cn } from "@/lib/utils";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  Children,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type WordToken = {
  text: string;
  className?: string;
  wordIndex: number;
};

type LineWords = {
  paragraphIndex: number;
  lineKey: string;
  words: WordToken[];
};

/** Dim state for words not yet revealed */
const DIM_OPACITY = 0.14;

/** How much each word's fade overlaps neighbors (1 = no overlap) */
const WORD_OVERLAP = 1.85;

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function segmentsToWords(
  segments: LineSegment[],
  wordIndexStart: number,
): { words: WordToken[]; nextIndex: number } {
  const words: WordToken[] = [];
  let wordIndex = wordIndexStart;

  for (const segment of segments) {
    const parts = segment.text.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        const prev = words[words.length - 1];
        if (prev) prev.text += part;
        else {
          words.push({
            text: part,
            className: segment.className,
            wordIndex: wordIndex++,
          });
        }
        continue;
      }
      words.push({
        text: part,
        className: segment.className,
        wordIndex: wordIndex++,
      });
    }
  }

  return { words, nextIndex: wordIndex };
}

function FadeWord({
  text,
  className,
  wordIndex,
  totalWords,
  progress,
  locked,
}: {
  text: string;
  className?: string;
  wordIndex: number;
  totalWords: number;
  progress: MotionValue<number>;
  locked: boolean;
}) {
  const step = 1 / (totalWords + 1);
  const start = wordIndex * step;
  const end = Math.min(1, start + step * WORD_OVERLAP);

  const opacity = useTransform(progress, (p) => {
    if (locked) return 1;
    if (p <= start) return DIM_OPACITY;
    if (p >= end) return 1;
    const t = smoothstep((p - start) / (end - start));
    return DIM_OPACITY + (1 - DIM_OPACITY) * t;
  });

  return (
    <motion.span
      className={cn("inline text-foreground will-change-[opacity]", className)}
      style={{ opacity: locked ? 1 : opacity }}
    >
      {text}
    </motion.span>
  );
}

type ScrollLineRevealProps = {
  children: ReactNode;
  className?: string;
  /** Once fully filled, keep color (no fade-back on scroll up) */
  lockWhenComplete?: boolean;
  /**
   * When the island navigates to this section id, finish the reveal with a
   * soft autoplay (nav scroll often stops before scrub completes).
   */
  autoPlayOnSection?: string;
};

/** Word-by-word scroll opacity reveal (dim → full). */
export function ScrollLineReveal({
  children,
  className,
  lockWhenComplete = true,
  autoPlayOnSection,
}: ScrollLineRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<LineWords[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [locked, setLocked] = useState(false);
  const reducedMotion = useReducedMotion();
  const scrub = useMotionValue(0);
  const autoplayingRef = useRef(false);
  const lockedRef = useRef(false);
  const autoControlsRef = useRef<{ stop: () => void } | null>(null);

  const paragraphs = Children.toArray(children).filter(
    (child): child is ReactElement<{
      children?: ReactNode;
      className?: string;
    }> => isValidElement(child),
  );

  const { scrollYProgress } = useScroll({
    target: rootRef,
    // Done once the text block sits around the viewport center
    offset: ["start 90%", "center center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (lockedRef.current || autoplayingRef.current) return;
    scrub.set(value);
    if (lockWhenComplete && value >= 0.98) {
      lockedRef.current = true;
      setLocked(true);
    }
  });

  useEffect(() => {
    if (!autoPlayOnSection || reducedMotion) return;

    let delayTimer: number | null = null;

    const onArrived = (event: Event) => {
      const id = (event as CustomEvent<SectionArrivedDetail>).detail?.id;
      if (id !== autoPlayOnSection) return;
      if (lockedRef.current || autoplayingRef.current) return;

      // Let the page scroll land before starting the reveal
      if (delayTimer != null) window.clearTimeout(delayTimer);
      delayTimer = window.setTimeout(() => {
        delayTimer = null;
        if (lockedRef.current || autoplayingRef.current) return;

        const from = Math.max(scrub.get(), scrollYProgress.get());
        if (from >= 0.98) {
          lockedRef.current = true;
          setLocked(true);
          return;
        }

        scrub.set(from);
        autoplayingRef.current = true;
        autoControlsRef.current?.stop();
        const duration = 0.55 + (1 - from) * 0.85;
        autoControlsRef.current = animate(scrub, 1, {
          duration,
          ease: [0.22, 1, 0.36, 1],
          onComplete: () => {
            autoplayingRef.current = false;
            autoControlsRef.current = null;
            lockedRef.current = true;
            setLocked(true);
          },
        });
      }, 700);
    };

    window.addEventListener(SECTION_ARRIVED_EVENT, onArrived);
    return () => {
      if (delayTimer != null) window.clearTimeout(delayTimer);
      autoControlsRef.current?.stop();
      autoControlsRef.current = null;
      window.removeEventListener(SECTION_ARRIVED_EVENT, onArrived);
    };
  }, [autoPlayOnSection, reducedMotion, scrub, scrollYProgress]);

  useLayoutEffect(() => {
    const measure = () => {
      const root = measureRef.current;
      if (!root) return;

      const next: LineWords[] = [];
      let wordIndex = 0;
      let lineSerial = 0;

      Array.from(root.children).forEach((child, paragraphIndex) => {
        if (!(child instanceof HTMLElement)) return;
        measureLines(child).forEach((segments) => {
          const { words, nextIndex } = segmentsToWords(segments, wordIndex);
          wordIndex = nextIndex;
          next.push({
            paragraphIndex,
            lineKey: `${paragraphIndex}-${lineSerial++}`,
            words,
          });
        });
      });

      setLines(next);
      setTotalWords(wordIndex);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [children]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const groups = lines.reduce<LineWords[][]>((acc, line) => {
    const last = acc[acc.length - 1];
    if (!last || last[0].paragraphIndex !== line.paragraphIndex) {
      acc.push([line]);
    } else {
      last.push(line);
    }
    return acc;
  }, []);

  return (
    <div ref={rootRef} className={cn("relative text-foreground", className)}>
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 space-y-6 sm:space-y-8"
      >
        {paragraphs.map((p, i) => (
          <p key={i} className={p.props.className}>
            {p.props.children}
          </p>
        ))}
      </div>

      {lines.length === 0 || totalWords === 0 ? (
        <div className="space-y-6 sm:space-y-8">{children}</div>
      ) : (
        <div aria-hidden>
          {groups.map((group) => (
            <div
              key={`p-${group[0].paragraphIndex}`}
              className="mb-6 last:mb-0 sm:mb-8 sm:last:mb-0"
            >
              {group.map((line) => (
                <div key={line.lineKey} className="block">
                  {line.words.map((word, i) => (
                    <FadeWord
                      key={`${line.lineKey}-${i}`}
                      text={word.text}
                      className={word.className}
                      wordIndex={word.wordIndex}
                      totalWords={totalWords}
                      progress={scrub}
                      locked={locked}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="sr-only">{children}</div>
    </div>
  );
}
