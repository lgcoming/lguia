import { formatEuro } from "@/features/catalog/format";
import { LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref, planHref, routeHref, serviceHref, type RouteRef } from "@/i18n/routes";
import { absoluteUrl, getSiteUrl, siteConfig } from "@/lib/site";
import type { Faq, Plan, ServiceCategory } from "@/types/catalog";

/*
 * Schema.org builders (SPEC-007, SPEC-009). Only describe content that is visible on the page:
 * no ratings, reviews, street addresses or figures that the page does not show. The same
 * entities (@id) are referenced from every language so engines see one organisation, not two.
 */

const organizationId = () => `${getSiteUrl().origin}/#organization`;
const websiteId = () => `${getSiteUrl().origin}/#website`;

/** lguia works remotely from Spain for clients anywhere: the country is the only location shown. */
const AREA_SERVED = [{ "@type": "Country", name: "Spain" }, "Worldwide"];

const LANGUAGE_NAMES: Record<Locale, string> = { es: "Spanish", en: "English" };

/**
 * The organisation and the website, emitted on every page. ProfessionalService is the specific
 * type for an agency; it inherits from LocalBusiness, whose `address` is given at country
 * level only because there is no public office.
 */
export function siteGraph(locale: Locale, categories: ServiceCategory[], plans: Plan[] = []) {
  const low = lowestPrice(plans);
  const high = highestPrice(plans);
  const { meta } = getDictionary(locale);
  const logo = absoluteUrl("/brand/lguia-mark.png");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": organizationId(),
        name: siteConfig.name,
        // One entity, one URL: the same in every language.
        url: absoluteUrl("/"),
        logo: { "@type": "ImageObject", url: logo, width: 512, height: 512 },
        image: logo,
        email: siteConfig.email,
        founder: { "@type": "Person", name: siteConfig.owner },
        description: meta.description,
        address: { "@type": "PostalAddress", addressCountry: siteConfig.country },
        areaServed: AREA_SERVED,
        knowsLanguage: LOCALES.map((code) => LOCALE_INFO[code].lang),
        // Service names plus the search terms each page targets.
        knowsAbout: [...new Set(categories.flatMap((category) => [category.name, category.topic]))],
        ...(low && high
          ? { priceRange: `${formatEuro(low, locale)} – ${formatEuro(high, locale)}` }
          : {}),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: siteConfig.email,
          url: absoluteUrl(pageHref(locale, "contact")),
          availableLanguage: LOCALES.map((code) => LANGUAGE_NAMES[code]),
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: getDictionary(locale).footer.services,
          itemListElement: categories.map((category) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: category.name,
              description: category.summary,
              url: absoluteUrl(serviceHref(locale, category.id)),
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId(),
        name: siteConfig.name,
        url: absoluteUrl("/"),
        inLanguage: LOCALES.map((code) => LOCALE_INFO[code].lang),
        publisher: { "@id": organizationId() },
      },
    ],
  };
}

type WebPageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

/** The page itself: ties its language version to the site and the organisation. */
export function webPageSchema(options: {
  locale: Locale;
  route: RouteRef;
  name: string;
  description: string;
  type?: WebPageType;
}) {
  const { locale, route, name, description, type = "WebPage" } = options;
  const url = absoluteUrl(routeHref(locale, route));
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: LOCALE_INFO[locale].lang,
    isPartOf: { "@id": websiteId() },
    about: { "@id": organizationId() },
    dateModified: siteConfig.contentUpdated,
  };
}

function lowestPrice(plans: Plan[]): number | undefined {
  const amounts = plans.flatMap((plan) =>
    plan.pricing.kind === "from" ? [plan.pricing.amount] : [],
  );
  return amounts.length > 0 ? Math.min(...amounts) : undefined;
}

function highestPrice(plans: Plan[]): number | undefined {
  const amounts = plans.flatMap((plan) =>
    plan.pricing.kind === "from" ? [plan.pricing.amount] : [],
  );
  return amounts.length > 0 ? Math.max(...amounts) : undefined;
}

/** A service page. Prices come from the related plans shown on the same page. */
export function serviceSchema(category: ServiceCategory, locale: Locale, relatedPlans: Plan[]) {
  const from = lowestPrice(relatedPlans);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: category.name,
    serviceType: category.name,
    description: category.answer,
    url: absoluteUrl(serviceHref(locale, category.id)),
    inLanguage: LOCALE_INFO[locale].lang,
    provider: { "@id": organizationId() },
    areaServed: AREA_SERVED,
    ...(from === undefined
      ? {}
      : {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: from,
            highPrice: highestPrice(relatedPlans),
          },
        }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: category.name,
      itemListElement: category.services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.name, description: service.description },
      })),
    },
  };
}

/** The pricing page: every plan as an offer with its indicative starting price. */
export function plansSchema(plans: Plan[], locale: Locale, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name,
    url: absoluteUrl(pageHref(locale, "pricing")),
    inLanguage: LOCALE_INFO[locale].lang,
    itemListElement: plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      description: plan.tagline,
      url: absoluteUrl(planHref(locale, plan.id)),
      itemOffered: { "@type": "Service", name: plan.name, description: plan.idealFor },
      seller: { "@id": organizationId() },
      ...(plan.pricing.kind === "from"
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: plan.pricing.currency,
              minPrice: plan.pricing.amount,
              valueAddedTaxIncluded: false,
            },
          }
        : {}),
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
