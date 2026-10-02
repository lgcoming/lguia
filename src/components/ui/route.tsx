import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type RouteStopState = "done" | "current" | "upcoming";
type RouteStopSize = "xs" | "sm" | "md";
type RouteStopTone = "light" | "dark";

const stateClasses: Record<RouteStopState, string> = {
  done: "border-pine-700 bg-pine-700 text-paper",
  current: "border-signal bg-signal text-ink ring-4 ring-signal/30",
  upcoming: "border-control bg-paper text-ink-soft",
};

const darkUpcomingClasses = "border-on-dark-soft bg-ink text-paper";

const sizeClasses: Record<RouteStopSize, string> = {
  xs: "size-4",
  sm: "size-5",
  md: "size-9 text-sm",
};

interface RouteStopProps {
  state: RouteStopState;
  size?: RouteStopSize;
  tone?: RouteStopTone;
  children?: ReactNode;
}

/** A stop on the route line, the brand's wayfinding device (SPEC-002). Decorative. */
export function RouteStop({ state, size = "md", tone = "light", children }: RouteStopProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative z-10 inline-flex shrink-0 items-center justify-center rounded-full border-2 font-bold tabular transition-colors duration-300",
        tone === "dark" && state === "upcoming" ? darkUpcomingClasses : stateClasses[state],
        sizeClasses[size],
      )}
    >
      {children}
    </span>
  );
}
