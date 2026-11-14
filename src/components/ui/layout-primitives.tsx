import type { ReactNode } from "react";

import { RevealGroup, RevealText } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type ContainerWidth = "text" | "grid";

const widthClasses: Record<ContainerWidth, string> = {
  text: "max-w-text",
  grid: "max-w-grid",
};

export function Container({
  width = "grid",
  className,
  children,
}: {
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widthClasses[width], className)}>
      {children}
    </div>
  );
}

export type SectionTone = "canvas" | "white" | "ice" | "dark";

const toneClasses: Record<SectionTone, string> = {
  canvas: "bg-fog-white text-obsidian",
  white: "bg-pure-white text-obsidian",
  ice: "bg-ice-wash text-obsidian",
  dark: "surface-dark bg-carbon text-pure-white",
};

interface SectionProps {
  id?: string;
  labelledBy?: string;
  tone?: SectionTone;
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
}

/** Full-bleed band. Sections are separated by surface changes, never by rules (SPEC-002 v2). */
export function Section({
  id,
  labelledBy,
  tone = "canvas",
  width = "grid",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-nav-theme={tone === "dark" ? "dark" : undefined}
      className={cn("py-20 md:py-28", toneClasses[tone], className)}
    >
      <Container width={width}>{children}</Container>
    </section>
  );
}

interface SectionHeaderProps {
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  onDark?: boolean;
  className?: string;
  children?: ReactNode;
}

/** Centered headline stack: headline → subhead → optional actions, entering in sequence. */
export function SectionHeader({
  id,
  title,
  intro,
  onDark,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <RevealGroup className={cn("mx-auto mb-12 max-w-3xl text-center md:mb-16", className)}>
      <RevealText>
        <h2 id={id} className="text-[2rem] leading-[1.1] tracking-[-0.01em] md:text-heading-lg">
          {title}
        </h2>
      </RevealText>
      {intro ? (
        <RevealText>
          <p className={cn("mt-4 text-subheading", onDark ? "text-ash-veil" : "text-pewter")}>
            {intro}
          </p>
        </RevealText>
      ) : null}
      {children ? <RevealText>{children}</RevealText> : null}
    </RevealGroup>
  );
}
