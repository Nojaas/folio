import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

type SectionProps = ComponentPropsWithoutRef<"section">;

export const Section = ({ className, children, ...rest }: SectionProps) => {
  return (
    <section
      className={cn("max-w-4xl px-4 m-auto scroll-mt-20", className)}
      {...rest}
    >
      {children}
    </section>
  );
};
