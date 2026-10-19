export const SECTIONS = ["about", "projects", "contact"] as const;
export type SectionId = (typeof SECTIONS)[number];

export const SCROLL_THRESHOLD = 12;
export const MOBILE_NAV_WIDTH = "90vw";

export { fade, none, spring } from "@/lib/motion/transitions";
