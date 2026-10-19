import type { SectionId } from "@/app/components/dynamic-island/constants";
import type { useLenis } from "lenis/react";

export function getSectionScrollTarget(
  id: SectionId,
  lenis: ReturnType<typeof useLenis>,
) {
  const el = document.getElementById(id);
  if (!el) return null;

  const max =
    lenis?.limit ??
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  if (id === "contact") return max;

  const current = lenis?.scroll ?? window.scrollY;
  const rect = el.getBoundingClientRect();
  return Math.max(
    0,
    Math.min(
      rect.top + current + rect.height / 2 - window.innerHeight / 2,
      max,
    ),
  );
}
