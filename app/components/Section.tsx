"use client";

import { useCenterLabelWidth } from "@/app/components/useCenterLabelWidth";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SectionProps = ComponentPropsWithoutRef<"section">;

export const Section = ({ className, children, ...rest }: SectionProps) => {
  return (
    <section className={cn("w-full scroll-mt-20", className)} {...rest}>
      {children}
    </section>
  );
};

/**
 * Content left edge aligns with the left edge of the centered
 * “Fullstack developer” / “Disponible” labels.
 */
export function ContentRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const labelWidth = useCenterLabelWidth();

  return (
    <div
      className={cn("pr-2.5", className)}
      style={{
        paddingLeft: labelWidth
          ? `max(0.625rem, calc(50% - ${labelWidth / 2}px))`
          : "max(0.625rem, 50%)",
      }}
    >
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
}
