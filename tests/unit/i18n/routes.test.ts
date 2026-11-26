import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { LOCALES } from "@/i18n/config";
import {
  allRoutes,
  alternateHrefs,
  localizedPath,
  matchPath,
  PAGE_IDS,
  pageHref,
  pageSegment,
  planHref,
  routeHref,
  serviceHref,
  serviceIdFromSlug,
  serviceSlugs,
} from "@/i18n/routes";
import { SERVICE_CATEGORY_IDS } from "@/types/catalog";

describe("localized routes", () => {
  it("keeps Spanish at the root and English under /en, with translated segments", () => {
    expect(pageHref("es", "home")).toBe("/");
    expect(pageHref("en", "home")).toBe("/en");
    expect(pageHref("es", "pricing")).toBe("/planes");
    expect(pageHref("en", "pricing")).toBe("/en/pricing");
    expect(pageHref("es", "diagnosis")).toBe("/diagnostico-digital");
    expect(pageHref("en", "diagnosis")).toBe("/en/digital-assessment");
    expect(serviceHref("es", "desarrollo-web")).toBe("/servicios/diseno-web-a-medida");
    expect(serviceHref("en", "desarrollo-web")).toBe("/en/services/custom-web-development");
    expect(planHref("en", "web-pro")).toBe("/en/pricing#web-pro");
  });

  it("round-trips every route through matchPath in every language", () => {
    for (const locale of LOCALES) {
      for (const route of allRoutes()) {
        expect(matchPath(routeHref(locale, route))).toEqual({ locale, route });
      }
    }
  });

  it("resolves service slugs only in their own language", () => {
    for (const locale of LOCALES) {
      expect(serviceSlugs(locale).map((slug) => serviceIdFromSlug(locale, slug))).toEqual([
        ...SERVICE_CATEGORY_IDS,
      ]);
    }
    expect(serviceIdFromSlug("en", "diseno-web-a-medida")).toBeUndefined();
    expect(serviceIdFromSlug("es", "custom-web-development")).toBeUndefined();
  });

  it("switches language keeping the page, and falls back to home for unknown paths", () => {
    expect(localizedPath("/servicios/chatbots-agentes-ia", "en")).toBe(
      "/en/services/ai-agents-chatbots",
    );
    expect(localizedPath("/en/services/ai-agents-chatbots", "es")).toBe(
      "/servicios/chatbots-agentes-ia",
    );
    expect(localizedPath("/planes/", "en")).toBe("/en/pricing");
    expect(localizedPath("/en", "es")).toBe("/");
    expect(localizedPath("/admin/leads", "en")).toBe("/en");
    expect(localizedPath("/en/does-not-exist", "es")).toBe("/");
    expect(matchPath("/english-course").locale).toBe("es");
  });

  it("lists every language for every route (hreflang reciprocity)", () => {
    for (const route of allRoutes()) {
      const hrefs = alternateHrefs(route);
      expect(Object.keys(hrefs).sort()).toEqual([...LOCALES].sort());
      expect(new Set(Object.values(hrefs)).size).toBe(LOCALES.length);
    }
  });

  it("has a route folder for every page of every language", () => {
    const base = { es: "src/app/(es)/(marketing)", en: "src/app/(en)/en/(marketing)" };
    for (const locale of LOCALES) {
      for (const page of PAGE_IDS) {
        const file = join(process.cwd(), base[locale], pageSegment(locale, page), "page.tsx");
        expect(existsSync(file), file).toBe(true);
      }
      const detail = join(
        process.cwd(),
        base[locale],
        pageSegment(locale, "services"),
        "[slug]",
        "page.tsx",
      );
      expect(existsSync(detail), detail).toBe(true);
    }
  });
});
