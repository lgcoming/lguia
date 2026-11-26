import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { CATALOG } from "@/data/catalog";
import { LOCALES } from "@/i18n/config";
import { allRoutes } from "@/i18n/routes";
import { createPageMetadata, languageAlternates } from "@/lib/metadata";
import { plansSchema, serviceSchema, siteGraph } from "@/lib/structured-data";

describe("international metadata", () => {
  it("gives every page a self-referencing canonical and the full hreflang set", () => {
    const es = createPageMetadata({
      locale: "es",
      route: { service: "chatbots-ia" },
      title: "t",
      description: "d",
    });
    const en = createPageMetadata({
      locale: "en",
      route: { service: "chatbots-ia" },
      title: "t",
      description: "d",
    });

    expect(es.alternates?.canonical).toBe("/servicios/chatbots-agentes-ia");
    expect(en.alternates?.canonical).toBe("/en/services/ai-agents-chatbots");
    // Reciprocal: both versions list the same alternates, themselves included.
    expect(es.alternates?.languages).toEqual(en.alternates?.languages);
    expect(es.alternates?.languages).toEqual({
      es: "/servicios/chatbots-agentes-ia",
      en: "/en/services/ai-agents-chatbots",
      "x-default": "/en/services/ai-agents-chatbots",
    });
    expect(es.openGraph).toMatchObject({ locale: "es_ES", alternateLocale: ["en_US"] });
    expect(en.openGraph).toMatchObject({ locale: "en_US", alternateLocale: ["es_ES"] });
  });

  it("points x-default at the English version of every route", () => {
    for (const route of allRoutes()) {
      const alternates = languageAlternates(route);
      expect(alternates["x-default"]).toBe(alternates.en);
    }
  });

  it("lists every route in every language in the sitemap, with reciprocal alternates", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(allRoutes().length * LOCALES.length);
    const urls = new Set(entries.map((entry) => entry.url));
    expect(urls.size).toBe(entries.length);
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {};
      expect(Object.keys(languages).sort()).toEqual(["en", "es", "x-default"]);
      expect(Object.values(languages)).toContain(entry.url);
      for (const url of Object.values(languages)) expect(urls.has(url as string)).toBe(true);
    }
  });
});

describe("structured data", () => {
  it("describes the organisation once, with a real logo and both languages", () => {
    const graph = siteGraph("en", CATALOG.en.serviceCategories)["@graph"];
    const organization = graph[0] as Record<string, unknown>;
    expect(organization["@type"]).toEqual(["Organization", "ProfessionalService"]);
    expect(organization.name).toBe("lguia");
    expect((organization.logo as { url: string }).url).toMatch(/\/brand\/lguia-mark\.png$/);
    expect(organization.knowsLanguage).toEqual(["es", "en"]);
    expect(organization.address).toEqual({ "@type": "PostalAddress", addressCountry: "ES" });
    // Same entity in both languages.
    expect(siteGraph("es", CATALOG.es.serviceCategories)["@graph"][0]["@id"]).toBe(
      organization["@id"],
    );
  });

  it("prices in structured data come from the plans shown on the page", () => {
    const category = CATALOG.en.serviceCategories[0];
    const related = CATALOG.en.plans.filter((plan) => category.relatedPlanIds.includes(plan.id));
    const service = serviceSchema(category, "en", related) as Record<string, unknown>;
    expect(service.offers).toMatchObject({ priceCurrency: "EUR", lowPrice: 590 });
    expect(service.url).toMatch(/\/en\/services\/custom-web-development$/);

    const catalog = plansSchema(CATALOG.es.plans, "es", "Planes");
    expect(catalog.itemListElement).toHaveLength(6);
    expect(catalog.itemListElement[0]).toMatchObject({
      name: "Starter Local",
      priceSpecification: { minPrice: 590, priceCurrency: "EUR", valueAddedTaxIncluded: false },
    });
    expect(catalog.itemListElement[5]).not.toHaveProperty("priceSpecification");
  });
});
