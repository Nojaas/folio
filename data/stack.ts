export const STACK_CATEGORIES = [
  {
    id: "frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "backend",
    items: ["Node.js", "PostgreSQL", "Prisma", "Redis", "REST APIs"],
  },
  {
    id: "product",
    items: ["Docker", "GitHub Actions", "Testing", "Vercel", "Sentry"],
  },
] as const;

export type StackCategoryId = (typeof STACK_CATEGORIES)[number]["id"];
