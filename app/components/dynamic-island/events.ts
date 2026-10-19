import type { SectionId } from "@/app/components/dynamic-island/constants";

export const SECTION_ARRIVED_EVENT = "folio:section-arrived";

export type SectionArrivedDetail = { id: SectionId };

export function emitSectionArrived(id: SectionId) {
  window.dispatchEvent(
    new CustomEvent<SectionArrivedDetail>(SECTION_ARRIVED_EVENT, {
      detail: { id },
    }),
  );
}
