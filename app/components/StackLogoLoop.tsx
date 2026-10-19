"use client";

import LogoLoop, { type LogoItem } from "@/components/LogoLoop";
import type { StackCategoryId } from "@/data/stack";
import { cn } from "@/lib/utils";
import {
  siDocker,
  siFramer,
  siGithubactions,
  siNextdotjs,
  siNodedotjs,
  siOpenapiinitiative,
  siPostgresql,
  siPrisma,
  siReact,
  siRedis,
  siSentry,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVitest,
  type SimpleIcon,
} from "simple-icons";

function BrandLogo({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="h-[1em] w-[1em]"
      fill="currentColor"
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  );
}

/** Playwright path from simple-icons (removed in newer versions). */
function PlaywrightLogo() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="h-[1em] w-[1em]"
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.996 7.462c-.056.837-.257 2.135-.716 3.85-.995 3.715-4.27 10.874-10.42 9.227-6.15-1.65-5.407-9.487-4.412-13.201.46-1.716.934-2.94 1.305-3.694.42-.853.846-.289 1.815.523.684.573 2.41 1.791 5.011 2.488 2.601.697 4.706.506 5.583.352 1.245-.219 1.897-.494 1.834.455Zm-9.807 3.863s-.127-1.819-1.773-2.286c-1.644-.467-2.613 1.04-2.613 1.04Zm4.058 4.539-7.769-2.172s.446 2.306 3.338 3.153c2.862.836 4.43-.98 4.43-.981Zm2.701-2.51s-.13-1.818-1.773-2.286c-1.644-.469-2.612 1.038-2.612 1.038ZM8.57 18.23c-4.749 1.279-7.261-4.224-8.021-7.08C.197 9.831.044 8.832.003 8.188c-.047-.73.455-.52 1.415-.354.677.118 2.3.261 4.308-.28a11.28 11.28 0 0 0 2.41-.956c-.058.197-.114.4-.17.61-.433 1.618-.827 4.055-.632 6.426-1.976.732-2.267 2.423-2.267 2.423l2.524-.715c.227 1.002.6 1.987 1.15 2.838a5.914 5.914 0 0 1-.171.049Zm-4.188-6.298c1.265-.333 1.363-1.631 1.363-1.631l-3.374.888s.745 1.076 2.01.743Z" />
    </svg>
  );
}

function logo(icon: SimpleIcon, title: string, ariaLabel = title): LogoItem {
  return {
    node: <BrandLogo icon={icon} />,
    title,
    ariaLabel,
  };
}

const LOGOS_BY_CATEGORY: Record<StackCategoryId, LogoItem[]> = {
  frontend: [
    logo(siReact, "React"),
    logo(siNextdotjs, "Next.js"),
    logo(siTypescript, "TypeScript"),
    logo(siTailwindcss, "Tailwind CSS"),
    logo(siFramer, "Framer Motion"),
  ],
  backend: [
    logo(siNodedotjs, "Node.js"),
    logo(siPostgresql, "PostgreSQL"),
    logo(siPrisma, "Prisma"),
    logo(siRedis, "Redis"),
    logo(siOpenapiinitiative, "REST APIs"),
  ],
  product: [
    logo(siDocker, "Docker"),
    logo(siGithubactions, "GitHub Actions"),
    logo(siVitest, "Vitest"),
    {
      node: <PlaywrightLogo />,
      title: "Playwright",
      ariaLabel: "Playwright",
    },
    logo(siVercel, "Vercel"),
    logo(siSentry, "Sentry"),
  ],
};

export function StackLogoLoop({
  category,
  className,
}: {
  category: StackCategoryId;
  className?: string;
}) {
  return (
    <div
      className={cn("w-full flex justify-center text-foreground", className)}
    >
      <LogoLoop
        key={category}
        logos={LOGOS_BY_CATEGORY[category]}
        layout="line"
        direction="left"
        speed={30}
        logoHeight={36}
        gap={42}
        width="90%"
        fadeOut
        pauseOnHover={false}
        draggable={false}
        labels="none"
        ariaLabel={`${category} logos`}
      />
    </div>
  );
}
