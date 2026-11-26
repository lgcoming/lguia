import type { Metadata } from "next";

import { LOCALE_INFO, LOCALES, X_DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternateHrefs, routeHref, type RouteRef } from "@/i18n/routes";
import { getSiteUrl, siteConfig } from "@/lib/site";

/** The generated Open Graph image of each language (app/opengraph-image.tsx, app/og-en.png). */
const OG_IMAGE: Record<Locale, string> = { es: "/opengraph-image", en: "/og-en.png" };

export function ogImagePath(locale: Locale): string {
  return OG_IMAGE[locale];
}

function sharedImage(locale: Locale) {
  return {
    url: ogImagePath(locale),
    width: 1200,
    height: 630,
    alt: getDictionary(locale).meta.ogAlt,
  };
}

/**
 * hreflang set of a page: one entry per language plus x-default (SPEC-009). Every language
 * version lists the same set, itself included, which is what makes the annotations valid.
 */
export function languageAlternates(route: RouteRef): Record<string, string> {
  const hrefs = alternateHrefs(route);
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [LOCALE_INFO[locale].lang, hrefs[locale]])),
    "x-default": hrefs[X_DEFAULT_LOCALE],
  };
}

/** Metadata shared by every page of one language: goes in that language's root layout. */
export function rootMetadata(locale: Locale): Metadata {
  const { meta } = getDictionary(locale);
  return {
    metadataBase: getSiteUrl(),
    title: { default: meta.homeTitle, template: `%s | ${siteConfig.name}` },
    description: meta.description,
    applicationName: siteConfig.name,
    // Allow full snippets and large image previews in Search and Discover.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: LOCALE_INFO[locale].openGraph,
      siteName: siteConfig.name,
    },
    twitter: { card: "summary_large_image" },
  };
}

interface PageMetadataOptions {
  locale: Locale;
  route: RouteRef;
  title: string;
  description: string;
  /** Use the title as-is, without the "| lguia" template (home page). */
  absoluteTitle?: boolean;
}

/**
 * Consistent metadata for public pages (SPEC-007, SPEC-009): title, description,
 * self-referencing canonical, hreflang alternates, Open Graph and Twitter card. A page-level
 * `openGraph` object replaces the parent one entirely (including the file-based image), so
 * shared fields are repeated here.
 */
export function createPageMetadata({
  locale,
  route,
  title,
  description,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const path = routeHref(locale, route);
  const image = sharedImage(locale);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path, languages: languageAlternates(route) },
    openGraph: {
      type: "website",
      locale: LOCALE_INFO[locale].openGraph,
      alternateLocale: LOCALES.filter((other) => other !== locale).map(
        (other) => LOCALE_INFO[other].openGraph,
      ),
      siteName: siteConfig.name,
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
