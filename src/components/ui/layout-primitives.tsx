import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

type SectionTone = "paper" | "mist" | "ink";

const toneClasses: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  mist: "bg-mist text-ink",
  // Amber focus ring: pine would not reach 3:1 against ink.
  ink: "bg-ink text-paper [--focus-ring:var(--color-signal)]",
};

interface SectionProps {
  id?: string;
  labelledBy?: string;
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
}

export function Section({ id, labelledBy, tone = "paper", className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-16 md:py-24", toneClasses[tone], className)}
    >
      <Container>{children}</Container>
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

export function SectionHeader({
  id,
  title,
  intro,
  onDark,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-10 max-w-2xl md:mb-12", className)}>
      <h2 id={id} className="text-[1.75rem] leading-tight md:text-h2">
        {title}
      </h2>
      {intro ? (
        <p className={cn("mt-4 text-lead", onDark ? "text-on-dark-soft" : "text-ink-soft")}>
          {intro}
        </p>
      ) : null}
      {children}
    </div>
  );
}
