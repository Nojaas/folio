/** Matches Tailwind `md` — below = mobile, md+ = tablet/desktop */
export const BREAKPOINTS = {
  md: 768,
} as const;

export const MOBILE_MAX = BREAKPOINTS.md - 1;

/** Header spacer the island overlays in available state */
export const ISLAND_SLOT_ID = "island-slot";
