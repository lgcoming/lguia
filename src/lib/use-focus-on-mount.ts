"use client";

import { useEffect, useRef } from "react";

/**
 * Moves focus to the element when it mounts. Used when a whole view is replaced
 * (wizard steps, results) so keyboard and screen-reader users land on the new heading.
 */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}
