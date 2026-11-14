"use client";

import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

/*
 * Two entrance styles (SPEC-002 v2, Motion):
 * - cards rise 24px and go from a slight blur to sharp, in a cascade;
 * - text only rises 18px and fades: no blur, so it is legible at every instant.
 * `filter` is dropped when the entrance ends: a resting `blur(0px)` would still make the
 * element a stacking context and a backdrop root for the glass inside it.
 */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
    transitionEnd: { filter: "none" },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

interface RevealProps {
  className?: string;
  delay?: number;
  children: ReactNode;
}

/** Fades content in once when it enters the viewport. `data-reveal` lets <noscript> CSS undo the hidden state. */
export function Reveal({ className, delay = 0, children }: RevealProps) {
  return (
    <m.div
      data-reveal
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={textVariants}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

/** A block whose `RevealText` children enter one after another (headline, then subhead). */
export function RevealGroup({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerVariants}
    >
      {children}
    </m.div>
  );
}

export function RevealText({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <m.div data-reveal className={className} variants={textVariants}>
      {children}
    </m.div>
  );
}

/** A list of cards revealed in cascade. Keeps list semantics (ul/ol + li). */
export function RevealList({
  as = "ul",
  className,
  children,
}: {
  as?: "ul" | "ol";
  className?: string;
  children: ReactNode;
}) {
  const List = as === "ol" ? m.ol : m.ul;
  return (
    <List
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerVariants}
    >
      {children}
    </List>
  );
}

export function RevealItem({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <m.li data-reveal className={className} variants={cardVariants}>
      {children}
    </m.li>
  );
}
