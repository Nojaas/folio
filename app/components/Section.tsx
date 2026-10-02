"use client";

import { useCenterLabelWidth } from "@/app/components/useCenterLabelWidth";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

type SectionProps = ComponentPropsWithoutRef<"section">;

export const Section = ({ className, children, ...rest }: SectionProps) => {
  return (
    <section className={cn("w-full scroll-mt-20", className)} {...rest}>
      {children}
    </section>
  );
};

/**
 * Mobile: left-aligned with px-2.5 (10px).
 * Desktop: left edge aligns with centered “Fullstack developer”.
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
      className={cn(
        "w-full px-2.5 sm:pr-2.5 sm:pl-[max(0.625rem,calc(50%-var(--center-label-half,0px)))]",
        className,
      )}
      style={
        {
          "--center-label-half": labelWidth ? `${labelWidth / 2}px` : "0px",
        } as CSSProperties
      }
    >
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
}
