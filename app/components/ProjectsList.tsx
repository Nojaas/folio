"use client";

import { DownFastLabel } from "@/app/components/DownFastLink";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type Project = {
  id: "pingora" | "krono" | "kanboard";
  title: string;
  href?: string;
  description: string;
};

type ProjectsListProps = {
  projects: Project[];
  isExternal: (href?: string) => boolean;
  className?: string;
};

export function ProjectsList({
  projects,
  isExternal,
  className,
}: ProjectsListProps) {
  return (
    <div className={cn("flex flex-col gap-6 sm:gap-7", className)}>
      {projects.map((project, index) => {
        const external = isExternal(project.href);
        const n = String(index + 1).padStart(2, "0");

        return (
          <motion.a
            key={project.title}
            href={project.href ?? "#"}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            aria-label={project.title}
            initial="rest"
            whileHover="hover"
            className="group flex w-full flex-col gap-1.5"
          >
            <span className="text-[11px] tracking-[0.08em] tabular-nums text-muted-foreground/45 transition-colors duration-300 group-hover:text-foreground">
              {n}
            </span>
            <span className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              <DownFastLabel label={project.title} />
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground/70 transition-colors duration-300 group-hover:text-foreground sm:text-[13px]">
              {project.description}
            </p>
          </motion.a>
        );
      })}
    </div>
  );
}
