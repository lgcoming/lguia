"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routes";

/**
 * Link to the same page in another language (SPEC-009). A plain <a>: each language has its own
 * root layout, so the switch is a full navigation, and `hreflang` tells crawlers what it is.
 */
export function LanguageLink({
  target,
  label,
  className,
  children,
}: {
  target: Locale;
  /** Accessible name, e.g. "Cambiar idioma a English". */
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <a
      href={localizedPath(pathname, target)}
      hrefLang={LOCALE_INFO[target].lang}
      lang={LOCALE_INFO[target].lang}
      aria-label={label}
      className={className}
    >
      {children}
    </a>
  );
}
