"use client";

import { ScrollVelocity } from "@/components/ScrollVelocity";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const TECHS = "React  ✦  TypeScript  ✦  Next.js  ✦  Node.js  ✦";

export function TechVelocity() {
  const { t } = useLocale();

  return (
    <section
      id="stack"
      className="relative flex h-[100dvh] w-full flex-col justify-center overflow-hidden"
      aria-label={t.stack.label}
    >
      <ScrollVelocity
        texts={[TECHS, TECHS]}
        velocity={120}
        numCopies={6}
        damping={20}
        stiffness={100}
        velocityMapping={{ input: [0, 1000], output: [0, 2.5] }}
        className="tracking-tight"
      />
    </section>
  );
}
