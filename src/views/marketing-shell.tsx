import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { StickyCta } from "@/components/layout/sticky-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";
import { siteGraph } from "@/lib/structured-data";

/** Chrome of every public page in one language: skip link, header, main, footer, site JSON-LD. */
export async function MarketingShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const t = getDictionary(locale);
  const categories = await getCatalogRepository(locale).listServiceCategories();

  return (
    <>
      <JsonLd data={siteGraph(locale, categories)} />
      <SkipLink label={t.common.skipLink} />
      <SiteHeader locale={locale} />
      <main id="contenido" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter locale={locale} />
      <StickyCta
        href={pageHref(locale, "diagnosis")}
        text={t.stickyCta.text}
        button={t.stickyCta.button}
        hideOn={[
          pageHref(locale, "diagnosis"),
          pageHref(locale, "contact"),
          pageHref(locale, "prototype"),
        ]}
      />
    </>
  );
}
