import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/layout-primitives";
import { format, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { webPageSchema } from "@/lib/structured-data";

export type LegalPageId = "legal" | "privacy" | "cookies";

export function legalMetadata(locale: Locale, page: LegalPageId): Metadata {
  const copy = getDictionary(locale).legal.pages[page];
  return createPageMetadata({
    locale,
    route: { page },
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

const fill = (text: string) =>
  format(text, { owner: siteConfig.owner, brand: siteConfig.name, email: siteConfig.email });

/** Legal notice, privacy and cookie policies: one readable column of headed sections. */
export function LegalView({ locale, page }: { locale: Locale; page: LegalPageId }) {
  const { legal } = getDictionary(locale);
  const copy = legal.pages[page];

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: { page },
          name: copy.metaTitle,
          description: copy.metaDescription,
        })}
      />
      <PageHero title={copy.title} intro={copy.intro} />
      <Section tone="white" width="text">
        <article className="mx-auto max-w-3xl">
          <p className="text-footnote text-pewter">
            {legal.updatedLabel}: {legal.updated}
          </p>
          {copy.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="text-heading-sm">{section.heading}</h2>
              <div className="mt-4 space-y-3 text-body text-slate">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{fill(paragraph)}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </Section>
    </>
  );
}
