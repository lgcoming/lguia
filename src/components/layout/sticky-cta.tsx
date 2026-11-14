"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyCtaProps {
  href: string;
  text: string;
  button: string;
  /** Pages where the bar would compete with the page's own form. */
  hideOn: string[];
}

/**
 * Phone-only call to action (SPEC-003, CRO). Below 640px the header has no button, so once the
 * first screen is behind, a glass bar keeps the diagnosis one tap away. It stays out of the
 * way: hidden over the first screen, over the footer and on the form pages. IntersectionObserver
 * only (no scroll listener); `scroll-padding-bottom` in globals.css keeps focused elements
 * from hiding behind it (WCAG 2.4.11).
 */
export function StickyCta({ href, text, button, hideOn }: StickyCtaProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const excluded = hideOn.includes(pathname);

  useEffect(() => {
    if (excluded) return;
    const first = document.querySelector("#contenido > :not(script)");
    const footer = document.querySelector("footer");
    if (!first || !footer) return;

    const state = { pastFirst: false, atFooter: false };
    const update = () => setVisible(state.pastFirst && !state.atFooter);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === first) state.pastFirst = !entry.isIntersecting;
        else state.atFooter = entry.isIntersecting;
      }
      update();
    });
    observer.observe(first);
    observer.observe(footer);
    return () => {
      observer.disconnect();
      setVisible(false);
    };
  }, [excluded, pathname]);

  if (excluded) return null;

  return (
    <div
      data-sticky-cta=""
      data-visible={visible}
      // `inert` while hidden: the link must not be focusable off screen.
      inert={!visible}
      className={cn(
        "glass-light fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5 text-obsidian sm:hidden",
        "border border-pale-mist/70 transition-[opacity,transform] duration-300 ease-out",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <p className="min-w-0 truncate text-footnote font-semibold">{text}</p>
      <Link href={href} className={buttonStyles({ size: "sm" })}>
        {button}
      </Link>
    </div>
  );
}
