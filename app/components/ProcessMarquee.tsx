"use client";

import ScrollVelocity from "@/components/ScrollVelocity";

const LINE_1 = "IDEA · BUILD · SHIP";
const LINE_2 = "PRODUCT · ENGINEERING · PERFORMANCE";

export function ProcessMarquee() {
  return (
    <section
      className="relative flex h-[100dvh] w-full max-w-[100vw] flex-col justify-center gap-6 overflow-x-clip overflow-y-clip sm:gap-8"
      aria-label="Idea build ship"
    >
      <ScrollVelocity
        texts={[LINE_1, LINE_2]}
        velocity={70}
        fadeEdges
        skewWithVelocity={16}
        scaleWithVelocity={0.18}
        outlineAlternate
        fontSize="clamp(2.75rem, 9vw, 104px)"
        fontWeight={500}
        separator="·"
        gap={16}
        draggable
        numCopies={3}
        className="tracking-tight text-foreground"
      />
    </section>
  );
}
