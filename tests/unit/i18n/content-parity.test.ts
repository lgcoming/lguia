import { describe, expect, it } from "vitest";

import { CATALOG } from "@/data/catalog";
import { getDiagnosisContent } from "@/features/diagnosis/content";
import { getLeadContent, getPrototypeContent } from "@/features/leads/content";
import { LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/** Structure of an object without its text: keys, array lengths and non-string values. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, inner]) => [key, shape(inner)]),
    );
  }
  return typeof value === "string" ? "text" : value;
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();

/** Amounts written next to a euro sign, in either language's format ("1.900 €", "€1,900"). */
function euroAmounts(text: string): number[] {
  const matches = [
    ...text.matchAll(/(\d{1,3}(?:[.,]\d{3})*)\s?€/g),
    ...text.matchAll(/€\s?(\d{1,3}(?:[.,]\d{3})*)/g),
  ];
  return matches.map((match) => Number(match[1].replace(/[.,]/g, "")));
}

describe("content parity between languages", () => {
  it("catalog: same ids, structure, prices and flags", () => {
    const structure = (locale: Locale) => ({
      categories: CATALOG[locale].serviceCategories.map((category) => ({
        id: category.id,
        icon: category.icon,
        services: category.services.map((service) => service.id),
        relatedPlanIds: category.relatedPlanIds,
        problems: category.problems.length,
        outcomes: category.outcomes.length,
        faqs: category.faqs.length,
      })),
      plans: CATALOG[locale].plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        pricing: plan.pricing.kind === "from" ? plan.pricing : plan.pricing.kind,
        categories: plan.categories,
        featured: plan.featured,
        highlighted: Boolean(plan.highlight),
        features: plan.features.length,
      })),
      planFaqs: CATALOG[locale].planFaqs.length,
      processSteps: CATALOG[locale].processSteps.length,
    });
    expect(structure("en")).toEqual(structure("es"));
  });

  it("dictionaries, diagnosis copy and form copy have the same shape", () => {
    expect(shape(getDictionary("en"))).toEqual(shape(getDictionary("es")));
    expect(shape(getDiagnosisContent("en"))).toEqual(shape(getDiagnosisContent("es")));
    expect(shape(getLeadContent("en"))).toEqual(shape(getLeadContent("es")));
    expect(shape(getPrototypeContent("en"))).toEqual(shape(getPrototypeContent("es")));
  });

  it("translations keep the same placeholders", () => {
    const sources = [getDictionary, getDiagnosisContent, getLeadContent, getPrototypeContent];
    for (const source of sources) {
      const es = strings(source("es"));
      const en = strings(source("en"));
      expect(en.map(placeholders)).toEqual(es.map(placeholders));
    }
  });

  it.each(LOCALES)("no text is empty and the brand is always lowercase (%s)", (locale) => {
    const all = [
      ...strings(CATALOG[locale]),
      ...strings(getDictionary(locale)),
      ...strings(getDiagnosisContent(locale)),
      ...strings(getLeadContent(locale)),
      ...strings(getPrototypeContent(locale)),
    ];
    for (const text of all) {
      expect(text.trim()).not.toBe("");
      expect(text).not.toMatch(/LGuIA|LGUIA|Lguia|LGuia/);
    }
  });

  it.each(LOCALES)("every price quoted in copy is a real plan price (%s)", (locale) => {
    const prices = new Set(
      CATALOG[locale].plans.flatMap((plan) =>
        plan.pricing.kind === "from" ? [plan.pricing.amount] : [],
      ),
    );
    const copy = [
      ...strings(CATALOG[locale].serviceCategories),
      ...strings(CATALOG[locale].planFaqs),
      ...strings(getDictionary(locale)),
    ];
    const quoted = copy.flatMap(euroAmounts);
    expect(quoted.length).toBeGreaterThan(8);
    for (const amount of quoted) expect(prices.has(amount), `${amount} €`).toBe(true);
  });

  it("English copy carries no Spanish characters", () => {
    const english = [
      ...strings(CATALOG.en),
      ...strings(getDictionary("en")),
      ...strings(getDiagnosisContent("en")),
      ...strings(getLeadContent("en")),
      ...strings(getPrototypeContent("en")),
    ];
    for (const text of english) expect(text, text).not.toMatch(/[áéíóúñ¿¡]/);
  });
});
