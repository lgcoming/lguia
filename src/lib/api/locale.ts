import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";

/**
 * Language of an API request, from the `locale` query parameter (SPEC-006). Unknown or missing
 * values fall back to the default language, so existing clients keep working.
 */
export function localeFromRequest(request: Request): Locale {
  const value = new URL(request.url).searchParams.get("locale");
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
