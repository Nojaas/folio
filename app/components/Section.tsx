"use client";

import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SectionProps = ComponentPropsWithoutRef<"section">;

export function Section({ className, children, ...rest }: SectionProps) {
  return (
    <section className={cn("w-full scroll-mt-20", className)} {...rest}>
      {children}
    </section>
  );
}

/**
 * Section body rail.
 * Mobile: left-aligned with page padding.
 * Desktop: starts at page mid, fills to the right page padding (empty left).
 */
export function ContentRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full px-2.5 md:px-0", className)}>
      <div className="w-full max-w-2xl md:ml-[50%] md:max-w-[calc(50%-0.625rem)] md:pr-2.5">
        {children}
      </div>
    </div>
  );
}
