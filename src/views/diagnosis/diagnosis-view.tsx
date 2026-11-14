import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/marketing/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, Section, SectionHeader } from "@/components/ui/layout-primitives";
import { StepNumber } from "@/components/ui/step-number";
import { DiagnosisWizard } from "@/features/diagnosis/components/diagnosis-wizard";
import { getDiagnosisSteps, getDiagnosisUiContent } from "@/features/diagnosis/content";
import { getLeadContent } from "@/features/leads/content";
import { splitAt, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/metadata";
import { webPageSchema } from "@/lib/structured-data";

export function diagnosisMetadata(locale: Locale): Metadata {
  const { diagnosisPage } = getDictionary(locale);
  return createPageMetadata({
    locale,
    route: { page: "diagnosis" },
    title: diagnosisPage.metaTitle,
    description: diagnosisPage.metaDescription,
  });
}

export function DiagnosisView({ locale }: { locale: Locale }) {
  const page = getDictionary(locale).diagnosisPage;
  const [before, after] = splitAt(page.noscript, "{link}");

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: { page: "diagnosis" },
          name: page.metaTitle,
          description: page.metaDescription,
        })}
      />
      <PageHero title={page.title} intro={page.intro} />
      <div className="bg-fog-white pt-10 pb-20 md:pt-14 md:pb-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <noscript>
              <p className="mb-6 rounded-tile bg-pure-white p-6">
                {before}
                <Link
                  href={pageHref(locale, "contact")}
                  className="text-sapphire underline underline-offset-4"
                >
                  {page.noscriptLink}
                </Link>
                {after}
              </p>
            </noscript>
            <DiagnosisWizard
              locale={locale}
              content={getDiagnosisUiContent(locale)}
              leadContent={getLeadContent(locale)}
            />
          </div>
        </Container>
      </div>

      {/* Server-rendered summary: the wizard is client-side, so this is what crawlers read. */}
      <Section tone="white" width="text" labelledBy="evalua-titulo">
        <SectionHeader id="evalua-titulo" title={page.coversTitle} intro={page.coversIntro} />
        <ol className="grid gap-3 sm:grid-cols-2">
          {getDiagnosisSteps(locale).map((step, index) => (
            <li key={step.id} className="flex gap-4 rounded-tile bg-fog-white p-6">
              <StepNumber value={index + 1} />
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="mt-1 text-footnote text-pewter">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
