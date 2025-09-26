import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/ui/timeline";
import { DATA } from "@/data/resume";
import Image from "next/image";
import React from "react";

// Explicit types to ensure proper discriminated union narrowing
interface WorkItem {
  company: string;
  badges: string[];
  location?: string;
  title: string;
  logoUrl?: string | React.ComponentType<{ size?: number }>;
  start: string;
  end: string;
  technologies?: string[];
  description?: string;
}

interface EducationItem {
  school: string;
  href?: string;
  degree: string;
  location?: string;
  logoUrl?: string | React.ComponentType<{ size?: number }>;
  start: string;
  end: string;
  technologies?: string[];
  description?: string;
}

type TimelineItem =
  | { type: "work"; title: string; endYear: string; data: WorkItem }
  | { type: "education"; title: string; endYear: string; data: EducationItem };

export function WorkTimeline() {
  // Combiner les expériences et formations
  const allItems: TimelineItem[] = [
    ...DATA.work.map((work) => ({
      type: "work" as const,
      title: work.start,
      endYear: work.end,
      data: work as WorkItem,
    })),
    ...DATA.education.map((education) => ({
      type: "education" as const,
      title: education.start,
      endYear: education.end,
      data: education as EducationItem,
    })),
  ];

  // Trier par année de fin (plus récent en premier)
  const sortedItems = allItems.sort(
    (a, b) => parseInt(b.endYear) - parseInt(a.endYear)
  );

  const data = sortedItems.map((item, index) => ({
    key: `${item.type}-${item.endYear}-${index}`,
    title: `${item.endYear}-${item.title}`,
    content: (
      <div
        key={`content-${item.type}-${item.endYear}-${index}`}
        className="space-y-8"
      >
        {/* Header avec logo et infos principales */}
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 shadow-sm">
            {item.data.logoUrl ? (
              typeof item.data.logoUrl === "string" ? (
                <Image
                  src={item.data.logoUrl}
                  alt={`${
                    item.type === "work" ? item.data.company : item.data.school
                  }`}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-8 h-8 text-neutral-600 dark:text-neutral-400">
                  {React.createElement(item.data.logoUrl, { size: 32 })}
                </div>
              )
            ) : (
              <div className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-600 dark:text-neutral-300 text-2xl font-bold">
                {(item.type === "work" ? item.data.company : item.data.school)
                  ?.charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
              {item.type === "work" ? item.data.title : item.data.degree}
            </h3>
            <div className="flex flex-row items-center gap-1 sm:gap-2">
              <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
                {item.type === "work" ? item.data.company : item.data.school}
              </p>
              {item.data.location && (
                <>
                  <span className="text-neutral-400 dark:text-neutral-500">
                    •
                  </span>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {item.data.location}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className=" max-w-3xl">
          <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
            {item.data.description}
          </p>
        </div>

        {/* Technologies */}
        {item.data.technologies && item.data.technologies.length > 0 && (
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              {item.data.technologies.map((tech, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-0 font-medium"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
