import { DEFAULT_LOCALE, LOCALE_INFO, type Locale } from "@/i18n/config";
import type { PlanPricing } from "@/types/catalog";

const formatters = new Map<Locale, Intl.NumberFormat>();

export function formatEuro(amount: number, locale: Locale = DEFAULT_LOCALE): string {
  let formatter = formatters.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE_INFO[locale].intl, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
      // "1.900 €" rather than "1900 €" in Spanish: prices read as prices at every size.
      useGrouping: "always",
    });
    formatters.set(locale, formatter);
  }
  return formatter.format(amount);
}

const FROM: Record<Locale, string> = { es: "Desde", en: "From" };

export function formatPlanPrice(pricing: PlanPricing, locale: Locale = DEFAULT_LOCALE): string {
  return pricing.kind === "from"
    ? `${FROM[locale]} ${formatEuro(pricing.amount, locale)}`
    : pricing.label;
}
