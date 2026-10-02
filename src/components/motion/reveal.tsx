"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
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
      variants={itemVariants}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/** A list whose items reveal in sequence. Keeps list semantics (ul/li). */
export function RevealList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <m.ul
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={listVariants}
    >
      {children}
    </m.ul>
  );
}

export function RevealItem({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <m.li data-reveal className={className} variants={itemVariants}>
      {children}
    </m.li>
  );
}
