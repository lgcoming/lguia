import type { Locale } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { es, type Dictionary } from "@/i18n/dictionaries/es";

const DICTIONARIES: Record<Locale, Dictionary> = { es, en };

/**
 * Site copy in one language. Server Components call this directly; Client Components receive
 * only the strings they need as props, so no dictionary reaches the browser bundle.
 */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary };
