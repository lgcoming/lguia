"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * The sticky header follows whatever band is under it: dark glass over
 * [data-nav-theme="dark"] sections, light glass elsewhere. IntersectionObserver with a thin
 * strip at the top of the viewport — no scroll listeners.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [overDark, setOverDark] = useState<boolean | null>(null);

  useEffect(() => {
    const bands = Array.from(document.querySelectorAll('[data-nav-theme="dark"]'));
    const underBar = new Set<Element>();
    let observer: IntersectionObserver | undefined;
    let resizeTimer: number | undefined;

    const observe = () => {
      observer?.disconnect();
      underBar.clear();
      // The root strip is the top 24px of the viewport, always inside the bar (56–64px).
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) underBar.add(entry.target);
            else underBar.delete(entry.target);
          }
          setOverDark(underBar.size > 0);
        },
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - 24)}px 0px` },
      );
      bands.forEach((band) => observer?.observe(band));
      if (bands.length === 0) setOverDark(false);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(observe, 150);
    };

    observe();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      observer?.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  return (
    <header
      data-theme={overDark === null ? undefined : overDark ? "dark" : "light"}
      className="site-header sticky top-0 z-40"
    >
      {children}
    </header>
  );
}
