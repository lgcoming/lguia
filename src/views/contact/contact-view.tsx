import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/layout-primitives";
import { StepNumber } from "@/components/ui/step-number";
import { TextLink } from "@/components/ui/text-link";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { ContactForm } from "@/features/leads/components/contact-form";
import { getLeadContent } from "@/features/leads/content";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { webPageSchema } from "@/lib/structured-data";

export function contactMetadata(locale: Locale): Metadata {
  const { contactPage } = getDictionary(locale);
  return createPageMetadata({
    locale,
    route: { page: "contact" },
    title: contactPage.metaTitle,
    description: contactPage.metaDescription,
  });
}

export async function ContactView({ locale }: { locale: Locale }) {
  const page = getDictionary(locale).contactPage;
  const leadContent = getLeadContent(locale);
  const categories = await getCatalogRepository(locale).listServiceCategories();
  const interestOptions = [
    { value: "general", label: leadContent.interestGeneral },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: { page: "contact" },
          name: page.metaTitle,
          description: page.metaDescription,
          type: "ContactPage",
        })}
      />
      <PageHero title={page.title} intro={page.intro} />

      <Section labelledBy="formulario-titulo">
        <div className="grid items-start gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-tile bg-pure-white p-6 sm:p-10">
            <h2 id="formulario-titulo" className="mb-8 text-heading-sm">
              {page.formTitle}
            </h2>
            <ContactForm
              locale={locale}
              content={leadContent}
              interestOptions={interestOptions}
              diagnosisHref={pageHref(locale, "diagnosis")}
            />
          </div>

          <aside aria-labelledby="despues-titulo" className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-tile bg-pure-white p-6 md:p-8">
              <h2 id="despues-titulo" className="text-subheading font-semibold">
                {page.nextTitle}
              </h2>
              <ol className="mt-6 space-y-5">
                {page.nextSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <StepNumber value={index + 1} />
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="mt-0.5 text-footnote text-pewter">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-tile bg-pure-white p-6 md:p-8">
              <h2 className="font-semibold">{page.emailTitle}</h2>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-1 inline-flex min-h-11 items-center text-body text-sapphire underline-offset-4 hover:underline"
              >
                {siteConfig.email}
              </a>
              <h2 className="mt-5 font-semibold">{page.unsureTitle}</h2>
              <p className="mt-1 text-footnote text-pewter">{page.unsureText}</p>
              <TextLink href={pageHref(locale, "diagnosis")}>{page.unsureLink}</TextLink>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
