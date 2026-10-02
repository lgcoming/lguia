"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () =>
  import("@/components/motion/motion-features").then((module) => module.default);

/**
 * Ships only the small `m` component core up front and loads the DOM animation
 * features after hydration. Honours the OS reduced-motion setting app-wide.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
