import { describe, expect, it } from "vitest";

import { CATALOG } from "@/data/catalog";
import { LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/lib/site";

/*
 * Search snippets (SPEC-013): titles fit in Google's ~60 characters including the brand suffix,
 * descriptions fit in ~160 and are long enough to be used as written.
 */

const SUFFIX = ` | ${siteConfig.name}`;
const TITLE_MAX = 60;
const DESCRIPTION = { min: 110, max: 160 };

function snippets(locale: Locale) {
  const t = getDictionary(locale);
  const pages = [
    t.servicesPage,
    t.pricingPage,
    t.diagnosisPage,
    t.contactPage,
    t.prototypePage,
  ].map((page) => ({ title: page.metaTitle + SUFFIX, description: page.metaDescription }));
  const services = CATALOG[locale].serviceCategories.map((category) => ({
    title: category.seoTitle + SUFFIX,
    description: category.seoDescription,
  }));
  return [{ title: t.meta.homeTitle, description: t.meta.description }, ...pages, ...services];
}

describe.each(LOCALES)("search snippets (%s)", (locale) => {
  it("titles are unique and fit in the result", () => {
    const titles = snippets(locale).map((snippet) => snippet.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const title of titles) expect(title.length, title).toBeLessThanOrEqual(TITLE_MAX);
  });

  it("descriptions are unique and between 110 and 160 characters", () => {
    const descriptions = snippets(locale).map((snippet) => snippet.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const description of descriptions) {
      expect(description.length, description).toBeGreaterThanOrEqual(DESCRIPTION.min);
      expect(description.length, description).toBeLessThanOrEqual(DESCRIPTION.max);
    }
  });

  it("every service H1 starts with the search term its page targets", () => {
    for (const category of CATALOG[locale].serviceCategories) {
      expect(category.headline.toLowerCase(), category.headline).toContain(
        category.topic.split(" ")[0].toLowerCase(),
      );
    }
  });
});
