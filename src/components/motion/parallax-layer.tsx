"use client";

import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { SCROLL_EFFECTS_QUERY, useMediaQuery } from "@/lib/use-media-query";

/**
 * Background layer that moves slower than the page (subtle parallax). The media is 24% taller
 * than its frame and travels ±8% of its height, so its edges never show. Transform only; off on
 * small screens and with reduced motion.
 */
export function ParallaxLayer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const enabled = useMediaQuery(SCROLL_EFFECTS_QUERY);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={frameRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <m.div
        data-parallax=""
        className="absolute inset-x-0 -inset-y-[12%]"
        style={enabled ? { y } : undefined}
      >
        {children}
      </m.div>
    </div>
  );
}
