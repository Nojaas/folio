"use client";

import FlowingMenu, { type FlowingMenuItem } from "@/components/FlowingMenu";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type Project = {
  id: string;
  title: string;
  year: number;
  href?: string;
  images?: string[];
  description?: string;
};

type ProjectsFlowingMenuProps = {
  projects: Project[];
  className?: string;
  "aria-label"?: string;
};

/**
 * Editorial FlowingMenu preset for projects (v2).
 * Hover band = inverted theme fg/bg; radius 10.
 * Intro is gated inside FlowingMenu via IntersectionObserver.
 */
export function ProjectsFlowingMenu({
  projects,
  className,
  "aria-label": ariaLabel = "Projects",
}: ProjectsFlowingMenuProps) {
  const isMobile = useIsMobile();
  const items: FlowingMenuItem[] = useMemo(
    () =>
      projects.map((project) => ({
        text: project.title,
        link: project.href,
        meta: String(project.year),
        marquee: project.title,
        images: project.images,
        description: project.description,
      })),
    [projects],
  );

  return (
    <div
      className={cn(
        // Desktop height drives cqh title size — don't shrink this.
        // Mobile: shorter wrapper → naturally smaller titles via cqh.
        "h-[min(60vh,30rem)] w-full overflow-hidden max-sm:h-[min(58vh,28rem)]",
        className,
      )}
    >
      <FlowingMenu
        items={items}
        speed={40}
        stretch={0.3}
        magnet={0.15}
        duration={0.45}
        direction="alternate"
        align="left"
        intro
        hoverEnabled={!isMobile}
        showIndex
        showArrow
        dimInactive={!isMobile}
        imageShape="rounded"
        dividers
        bandRadius={10}
        textColor="var(--foreground)"
        bgColor="transparent"
        marqueeBgColor="var(--foreground)"
        marqueeTextColor="var(--background)"
        borderColor="color-mix(in oklab, var(--foreground) 14%, transparent)"
        ariaLabel={ariaLabel}
        className="h-full w-full min-h-0"
      />
    </div>
  );
}
