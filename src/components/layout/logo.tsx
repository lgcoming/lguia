import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

// Intrinsic size of public/brand/lguia-logo-*.png (480×169); rendered at a fixed height.
const RATIO = 480 / 169;

type LogoVariant = "on-light" | "on-dark" | "adaptive";

function LogoImage({
  tone,
  height,
  className,
}: {
  tone: "light" | "dark";
  height: number;
  className?: string;
}) {
  return (
    <Image
      src={tone === "dark" ? "/brand/lguia-logo-dark.png" : "/brand/lguia-logo-light.png"}
      alt=""
      width={Math.round(height * RATIO)}
      height={height}
      loading="eager"
      className={className}
    />
  );
}

/**
 * Brand logo as a home link. `adaptive` renders both versions and lets the header theme
 * (globals.css .site-header) show the right one, so the swap never waits for JavaScript.
 */
export function Logo({
  variant = "on-light",
  height = 28,
  className,
}: {
  variant?: LogoVariant;
  height?: number;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="LGuIA, ir al inicio"
      className={cn("inline-flex min-h-11 shrink-0 items-center rounded-lg", className)}
    >
      {variant === "adaptive" ? (
        <>
          <LogoImage tone="dark" height={height} className="logo-on-light" />
          <LogoImage tone="light" height={height} className="logo-on-dark" />
        </>
      ) : (
        <LogoImage tone={variant === "on-dark" ? "light" : "dark"} height={height} />
      )}
    </Link>
  );
}
