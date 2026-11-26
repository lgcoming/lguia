import { leadContentEn, prototypeContentEn } from "@/features/leads/content/en";
import { leadContentEs, prototypeContentEs } from "@/features/leads/content/es";
import type { LeadFormContent, PrototypeFormContent } from "@/features/leads/content/types";
import { createLeadSchemas, type LeadSchemas } from "@/features/leads/schema";
import type { Locale } from "@/i18n/config";

const CONTENT: Record<Locale, LeadFormContent> = { es: leadContentEs, en: leadContentEn };

/** Server-side: form copy in one language, passed to the client forms as props. */
export function getLeadContent(locale: Locale): LeadFormContent {
  return CONTENT[locale];
}

const PROTOTYPE_CONTENT: Record<Locale, PrototypeFormContent> = {
  es: prototypeContentEs,
  en: prototypeContentEn,
};

/** Server-side: copy of the free prototype form (SPEC-012). */
export function getPrototypeContent(locale: Locale): PrototypeFormContent {
  return PROTOTYPE_CONTENT[locale];
}

const schemas = new Map<Locale, LeadSchemas>();

/** Validation schemas whose messages are in the given language (API and tests). */
export function getLeadSchemas(locale: Locale): LeadSchemas {
  let localized = schemas.get(locale);
  if (!localized) {
    localized = createLeadSchemas(CONTENT[locale].validation);
    schemas.set(locale, localized);
  }
  return localized;
}
