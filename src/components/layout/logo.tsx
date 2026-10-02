import Link from "next/link";

import { cn } from "@/lib/utils";

/** The route mark: a path from where you are to where you want to be. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
      <rect width="32" height="32" rx="9" className="fill-pine-700" />
      <path
        d="M9.5 22.5c0-7 13-5 13-12.5"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="stroke-paper"
      />
      <circle cx="9.5" cy="22.5" r="2.6" className="fill-paper" />
      <circle cx="22.5" cy="10" r="3.4" className="fill-signal" />
    </svg>
  );
}

export function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="LGuIA, ir al inicio"
      className={cn("inline-flex min-h-11 items-center gap-2.5 rounded-lg", className)}
    >
      <LogoMark />
      <span
        className={cn(
          "text-[1.375rem] leading-none font-extrabold tracking-[-0.03em]",
          onDark ? "text-paper" : "text-ink",
        )}
      >
        LGuIA
      </span>
    </Link>
  );
}
