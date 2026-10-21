/**
 * True Safari only.
 * Chrome iOS = CriOS, Firefox iOS = FxiOS — both include "Safari" in UA but must keep scrub.
 */
export function isSafariBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|CriOS|Chromium|Edg|FxiOS|OPiOS/i.test(ua);
}

/** Mobile/tablet Safari only — not Chrome iOS, not desktop Safari with a mouse. */
export function isSafariTouch() {
  if (typeof window === "undefined") return false;
  return isSafariBrowser() && window.matchMedia("(pointer: coarse)").matches;
}
