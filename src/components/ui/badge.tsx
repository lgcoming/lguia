import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "brand" | "signal";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-mist text-ink-soft",
  brand: "bg-pine-50 text-pine-700",
  signal: "bg-signal text-ink",
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
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
