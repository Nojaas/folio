"use client";

import { measureLines, type LineSegment } from "@/lib/measure-lines";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  Children,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type LinePiece = {
  segments: LineSegment[];
  paragraphIndex: number;
  index: number;
};

function LineContent({ segments }: { segments: LineSegment[] }) {
  return (
    <>
      {segments.map((segment, i) =>
        segment.className ? (
          <span key={i} className={segment.className}>
            {segment.text}
          </span>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </>
  );
}

function ScrubLine({
  segments,
  index,
  total,
  progress,
  locked,
}: {
  segments: LineSegment[];
  index: number;
  total: number;
  progress: MotionValue<number>;
  locked: boolean;
}) {
  const start = index / (total + 1);
  const end = (index + 1) / (total + 1);
  const scrubY = useTransform(progress, [start, end], ["115%", "0%"]);

  return (
    <div className="scroll-line-mask">
      <motion.div
        className="scroll-line will-change-transform"
        style={locked ? { y: "0%" } : { y: scrubY }}
      >
        <LineContent segments={segments} />
      </motion.div>
    </div>
  );
}

type ScrollLineRevealProps = {
  children: ReactNode;
  className?: string;
  /** Once fully revealed, keep text visible (no re-hide on scroll up) */
  lockWhenComplete?: boolean;
};

export function ScrollLineReveal({
  children,
  className,
  lockWhenComplete = true,
}: ScrollLineRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<LinePiece[]>([]);
  const [locked, setLocked] = useState(false);
  const reducedMotion = useReducedMotion();

  const paragraphs = Children.toArray(children).filter(
    (child): child is ReactElement<{
      children?: ReactNode;
      className?: string;
    }> => isValidElement(child),
  );

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start 80%", "center 35%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!lockWhenComplete || locked) return;
    // Last line finishes around total/(total+1) — wait until fully done
    if (value >= 0.98) setLocked(true);
  });

  useLayoutEffect(() => {
    const measure = () => {
      const root = measureRef.current;
      if (!root) return;

      const next: LinePiece[] = [];
      let index = 0;
      Array.from(root.children).forEach((child, paragraphIndex) => {
        if (!(child instanceof HTMLElement)) return;
        measureLines(child).forEach((segments) => {
          next.push({ segments, paragraphIndex, index: index++ });
        });
      });
      setLines(next);
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

  const groups = lines.reduce<LinePiece[][]>((acc, line) => {
    const last = acc[acc.length - 1];
    if (!last || last[0].paragraphIndex !== line.paragraphIndex) {
      acc.push([line]);
    } else {
      last.push(line);
    }
    return acc;
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
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

      {lines.length === 0 ? (
        <div className="space-y-6 sm:space-y-8">{children}</div>
      ) : (
        <div aria-hidden>
          {groups.map((group) => (
            <div
              key={`p-${group[0].paragraphIndex}`}
              className="mb-6 last:mb-0 sm:mb-8 sm:last:mb-0"
            >
              {group.map((line) => (
                <ScrubLine
                  key={`${line.paragraphIndex}-${line.index}`}
                  segments={line.segments}
                  index={line.index}
                  total={lines.length}
                  progress={scrollYProgress}
                  locked={locked}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="sr-only">{children}</div>
    </div>
  );
}
