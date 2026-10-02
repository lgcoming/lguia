import { categoryHref } from "@/features/catalog/routes";
import { absoluteUrl, getSiteUrl, siteConfig } from "@/lib/site";
import type { Faq, ServiceCategory } from "@/types/catalog";

/*
 * Schema.org builders (SPEC-007). Only describe content that is visible on the page:
 * no ratings, reviews, addresses or prices that the page does not show.
 */

const organizationId = () => `${getSiteUrl().origin}/#organization`;

const areaServed = { "@type": "Country", name: siteConfig.areaServed };

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // Organization rather than LocalBusiness: LGuIA works remotely and has no public address.
        "@type": "Organization",
        "@id": organizationId(),
        name: siteConfig.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon.svg"),
        email: siteConfig.email,
        description: siteConfig.description,
        areaServed,
      },
      {
        "@type": "WebSite",
        "@id": `${getSiteUrl().origin}/#website`,
        name: siteConfig.name,
        url: absoluteUrl("/"),
        inLanguage: "es-ES",
        publisher: { "@id": organizationId() },
      },
    ],
  };
}

export function serviceSchema(category: ServiceCategory) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: category.name,
    serviceType: category.name,
    description: category.description,
    url: absoluteUrl(categoryHref(category.id)),
    provider: { "@id": organizationId() },
    areaServed,
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
