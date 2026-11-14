/**
 * Supported languages (SPEC-009). Spanish is the default and lives at the root of the site;
 * English lives under /en. Everything that depends on the language starts from this file.
 */
export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

/**
 * Target of hreflang="x-default": the version offered to people whose language is neither
 * Spanish nor English. English is the international version.
 */
export const X_DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

interface LocaleInfo {
  /** BCP 47 tag used for `<html lang>`, hreflang and schema.org `inLanguage`. */
  lang: string;
  /** Open Graph locale (`og:locale`). */
  openGraph: string;
  /** Locale for `Intl` number and date formatting. */
  intl: string;
  /** The language's own name, shown in the language switcher. */
  nativeName: string;
  /** URL prefix of the language's route tree ("" for the default language). */
  prefix: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  es: { lang: "es", openGraph: "es_ES", intl: "es-ES", nativeName: "Español", prefix: "" },
  en: { lang: "en", openGraph: "en_US", intl: "en", nativeName: "English", prefix: "/en" },
};

/** Splits a translated string around one placeholder, to render an element in its place. */
export function splitAt(template: string, placeholder: string): [string, string] {
  const index = template.indexOf(placeholder);
  return index === -1
    ? [template, ""]
    : [template.slice(0, index), template.slice(index + placeholder.length)];
}

/** Fills `{name}` placeholders in a translated string. Keeps dictionaries serializable. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
