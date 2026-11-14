"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a media query. Returns `false` on the server and during hydration, so markup
 * always matches the server render; the real value arrives right after.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Wide screens that allow motion: where pinned, scroll-linked media effects run. */
export const SCROLL_EFFECTS_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
