"use client";

import type { SectionId } from "@/app/components/dynamic-island/constants";
import { IslandToolbar } from "@/app/components/dynamic-island/IslandToolbar";
import { PillTabs } from "@/app/components/PillTabs";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { MouseEvent } from "react";

export function NavContent({
  active,
  labels,
  wide,
  reduceMotion,
  transition,
  onNavClick,
}: {
  active: SectionId;
  labels: Record<SectionId, string>;
  wide: boolean;
  reduceMotion: boolean | null;
  transition: object;
  onNavClick: (id: SectionId) => (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const items = (
    [
      { id: "projects" as const, label: labels.projects },
      { id: "stack" as const, label: labels.stack },
      { id: "contact" as const, label: labels.contact },
    ] as const
  );

  return (
    <motion.div
      key="nav"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        reduceMotion
          ? undefined
          : { opacity: 0, position: "absolute", left: 0, top: 0 }
      }
      transition={transition}
      className={cn(
        "flex items-center",
        wide ? "w-full" : "w-max",
      )}
    >
      <PillTabs
        items={items}
        active={active}
        wide={wide}
        variant="plain"
        aria-label="Sections"
        className={wide ? "min-w-0 flex-1" : undefined}
        getHref={(id) => `#${id}`}
        onItemClick={(id, e) => {
          onNavClick(id)(e as MouseEvent<HTMLAnchorElement>);
        }}
      />
      <IslandToolbar />
    </motion.div>
  );
}
