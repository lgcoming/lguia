import { LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";
import { SERVICE_CATEGORY_IDS, type PlanId, type ServiceCategoryId } from "@/types/catalog";

/*
 * Public URLs per language (SPEC-009). Path segments and service slugs are translated, so every
 * link, canonical, hreflang and sitemap entry is built here. The route folders under
 * src/app/(es) and src/app/(en)/en must use exactly these segments (a unit test checks it).
 */

export const PAGE_IDS = ["home", "services", "pricing", "diagnosis", "contact"] as const;

export type PageId = (typeof PAGE_IDS)[number];

const PAGE_SEGMENTS: Record<Locale, Record<PageId, string>> = {
  es: {
    home: "",
    services: "servicios",
    pricing: "planes",
    diagnosis: "diagnostico-digital",
    contact: "contacto",
  },
  en: {
    home: "",
    services: "services",
    pricing: "pricing",
    diagnosis: "digital-assessment",
    contact: "contact",
  },
};

/** Slugs carry the head search term of each language; ids stay stable for the business logic. */
const SERVICE_SLUGS: Record<Locale, Record<ServiceCategoryId, string>> = {
  es: {
    "desarrollo-web": "desarrollo-web-a-medida",
    automatizaciones: "automatizacion-con-ia",
    "chatbots-ia": "agentes-de-ia",
    "seo-geo": "seo-geo",
  },
  en: {
    "desarrollo-web": "custom-web-development",
    automatizaciones: "ai-automation",
    "chatbots-ia": "ai-agents",
    "seo-geo": "seo-geo",
  },
};

/** A public page regardless of language: one of the fixed pages or a service category page. */
export type RouteRef = { page: PageId } | { service: ServiceCategoryId };

export function pageSegment(locale: Locale, page: PageId): string {
  return PAGE_SEGMENTS[locale][page];
}

export function pageHref(locale: Locale, page: PageId): string {
  const { prefix } = LOCALE_INFO[locale];
  const segment = PAGE_SEGMENTS[locale][page];
  return segment ? `${prefix}/${segment}` : prefix || "/";
}

export function serviceSlug(locale: Locale, id: ServiceCategoryId): string {
  return SERVICE_SLUGS[locale][id];
}

export function serviceSlugs(locale: Locale): string[] {
  return SERVICE_CATEGORY_IDS.map((id) => SERVICE_SLUGS[locale][id]);
}

export function serviceIdFromSlug(locale: Locale, slug: string): ServiceCategoryId | undefined {
  return SERVICE_CATEGORY_IDS.find((id) => SERVICE_SLUGS[locale][id] === slug);
}

export function serviceHref(locale: Locale, id: ServiceCategoryId): string {
  return `${pageHref(locale, "services")}/${SERVICE_SLUGS[locale][id]}`;
}

export function planHref(locale: Locale, id: PlanId): string {
  return `${pageHref(locale, "pricing")}#${id}`;
}

export function routeHref(locale: Locale, route: RouteRef): string {
  return "page" in route ? pageHref(locale, route.page) : serviceHref(locale, route.service);
}

/** The same page in every language, for hreflang and the sitemap. */
export function alternateHrefs(route: RouteRef): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((locale) => [locale, routeHref(locale, route)])) as Record<
    Locale,
    string
  >;
}

/** Every indexable route, in sitemap order. */
export function allRoutes(): RouteRef[] {
  return [
    { page: "home" },
    { page: "diagnosis" },
    { page: "services" },
    ...SERVICE_CATEGORY_IDS.map((service) => ({ service })),
    { page: "pricing" },
    { page: "contact" },
  ];
}

function localeOfPath(pathname: string): Locale {
  const match = LOCALES.find((locale) => {
    const { prefix } = LOCALE_INFO[locale];
    return prefix !== "" && (pathname === prefix || pathname.startsWith(`${prefix}/`));
  });
  return match ?? "es";
}

/** Resolves a public pathname to its language and page. Unknown paths only yield the language. */
export function matchPath(pathname: string): { locale: Locale; route?: RouteRef } {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const locale = localeOfPath(clean);
  const rest = clean.slice(LOCALE_INFO[locale].prefix.length).split("/").filter(Boolean);

  if (rest.length === 0) return { locale, route: { page: "home" } };

  const page = PAGE_IDS.find((id) => id !== "home" && PAGE_SEGMENTS[locale][id] === rest[0]);
  if (page && rest.length === 1) return { locale, route: { page } };
  if (page === "services" && rest.length === 2) {
    const service = serviceIdFromSlug(locale, rest[1]);
    if (service) return { locale, route: { service } };
  }
  return { locale };
}

/** The equivalent URL in another language (language switcher). Falls back to that language's home. */
export function localizedPath(pathname: string, target: Locale): string {
  const { route } = matchPath(pathname);
  return routeHref(target, route ?? { page: "home" });
}
