import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

// Intrinsic size of public/brand/lguia-logo-*.png (480×169).
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
      // `w-auto` keeps the aspect ratio when `imageClassName` changes the rendered height.
      className={cn("w-auto", className)}
    />
  );
}

/**
 * Brand logo as a home link. `adaptive` renders both versions and lets the header theme
 * (globals.css .site-header) show the right one, so the swap never waits for JavaScript.
 * `height` is the largest rendered height (it sizes the image request); `imageClassName` can
 * render it smaller on narrow screens.
 */
export function Logo({
  variant = "on-light",
  height = 28,
  href = "/",
  label,
  imageClassName,
  className,
}: {
  variant?: LogoVariant;
  height?: number;
  /** Home of the current language. */
  href?: string;
  /** Accessible name in the current language, e.g. "lguia, ir al inicio". */
  label: string;
  imageClassName?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("inline-flex min-h-11 shrink-0 items-center rounded-lg", className)}
    >
      {variant === "adaptive" ? (
        <>
          <LogoImage tone="dark" height={height} className={cn("logo-on-light", imageClassName)} />
          <LogoImage tone="light" height={height} className={cn("logo-on-dark", imageClassName)} />
        </>
      ) : (
        <LogoImage
          tone={variant === "on-dark" ? "light" : "dark"}
          height={height}
          className={imageClassName}
        />
      )}
    </Link>
  );
}
