import type { MetadataRoute } from "next";

import { LOCALES } from "@/i18n/config";
import { allRoutes, routeHref, type PageId, type RouteRef } from "@/i18n/routes";
import { languageAlternates } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

function priority(route: RouteRef): number {
  if ("service" in route) return 0.8;
  const priorities: Record<PageId, number> = {
    home: 1,
    diagnosis: 0.9,
    services: 0.9,
    pricing: 0.8,
    contact: 0.7,
    prototype: 0.8,
    legal: 0.2,
    privacy: 0.2,
    cookies: 0.2,
  };
  return priorities[route.page];
}

/**
 * Public, indexable routes in every language (SPEC-007, SPEC-009). Each URL lists its hreflang
 * alternates, itself included, so the annotations are reciprocal. Admin and API are excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().flatMap((route) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(route)).map(([lang, path]) => [lang, absoluteUrl(path)]),
    );
    return LOCALES.map((locale) => ({
      url: absoluteUrl(routeHref(locale, route)),
      lastModified: siteConfig.contentUpdated,
      changeFrequency: "monthly" as const,
      priority: priority(route),
      alternates: { languages },
    }));
  });
}
