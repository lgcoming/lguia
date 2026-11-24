import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/layout-primitives";
import { StepNumber } from "@/components/ui/step-number";
import { PrototypeForm } from "@/features/leads/components/prototype-form";
import { getLeadContent, getPrototypeContent } from "@/features/leads/content";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/lib/metadata";
import { webPageSchema } from "@/lib/structured-data";

export function prototypeMetadata(locale: Locale): Metadata {
  const page = getDictionary(locale).prototypePage;
  return createPageMetadata({
    locale,
    route: { page: "prototype" },
    title: page.metaTitle,
    description: page.metaDescription,
  });
}

/** Free website prototype request (SPEC-012): the offer next to a guided brief. */
export function PrototypeView({ locale }: { locale: Locale }) {
  const page = getDictionary(locale).prototypePage;

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: { page: "prototype" },
          name: page.metaTitle,
          description: page.metaDescription,
        })}
      />
      <PageHero title={page.title} intro={page.intro} />

      <Section labelledBy="prototipo-formulario">
        <div className="grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-tile bg-pure-white p-4 sm:p-8">
            <h2 id="prototipo-formulario" className="mb-6 px-1 text-heading-sm sm:px-0">
              {page.formTitle}
            </h2>
            <PrototypeForm
              locale={locale}
              content={getLeadContent(locale)}
              prototype={getPrototypeContent(locale)}
            />
          </div>

          <aside aria-labelledby="prototipo-recibes" className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-tile bg-pure-white p-6 md:p-8">
              <h2 id="prototipo-recibes" className="text-subheading font-semibold">
                {page.includesTitle}
              </h2>
              <ol className="mt-6 space-y-5">
                {page.includes.map((item, index) => (
                  <li key={item.title} className="flex gap-4">
                    <StepNumber value={index + 1} />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-0.5 text-footnote text-pewter">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-tile bg-pure-white p-6 md:p-8">
              <h2 className="font-semibold">{page.noteTitle}</h2>
              <p className="mt-1 text-footnote text-pewter">{page.note}</p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
