import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "info" | "strong" | "glass" | "inverse";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-fog-white text-obsidian",
  info: "bg-ice-wash text-obsidian",
  strong: "bg-obsidian text-pure-white",
  // On dark surfaces and glass.
  glass: "bg-pure-white/15 text-pure-white",
  inverse: "bg-pure-white text-carbon",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
