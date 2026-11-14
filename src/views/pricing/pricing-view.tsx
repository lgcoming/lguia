import { Info } from "lucide-react";
import type { Metadata } from "next";

import { DiagnosisCTA } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { PageHero } from "@/components/marketing/page-hero";
import { PlanCard } from "@/components/marketing/plan-card";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import { TextLink } from "@/components/ui/text-link";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/metadata";
import { faqSchema, plansSchema, webPageSchema } from "@/lib/structured-data";

export function pricingMetadata(locale: Locale): Metadata {
  const { pricingPage } = getDictionary(locale);
  return createPageMetadata({
    locale,
    route: { page: "pricing" },
    title: pricingPage.metaTitle,
    description: pricingPage.metaDescription,
  });
}

export async function PricingView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.pricingPage;
  const catalog = getCatalogRepository(locale);
  const [plans, planFaqs] = await Promise.all([catalog.listPlans(), catalog.listPlanFaqs()]);
  const planNames = new Map(plans.map((plan) => [plan.id, plan.name]));

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: { page: "pricing" },
          name: page.metaTitle,
          description: page.metaDescription,
        })}
      />
      <JsonLd data={plansSchema(plans, locale, page.metaTitle)} />
      <JsonLd data={faqSchema(planFaqs)} />
      <PageHero
        title={page.title}
        intro={page.intro}
        media={{ image: "/media/images/neural-circuit.jpg", position: "object-[60%_35%]" }}
      >
        <ButtonLink href={pageHref(locale, "diagnosis")} size="lg">
          {page.heroCta}
        </ButtonLink>
      </PageHero>

      <Section labelledBy="todos-planes-titulo">
        <h2 id="todos-planes-titulo" className="sr-only">
          {page.allPlans}
        </h2>
        <RevealList className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <RevealItem key={plan.id}>
              <PlanCard plan={plan} locale={locale} />
            </RevealItem>
          ))}
        </RevealList>
        <p className="mx-auto mt-10 flex max-w-3xl justify-center gap-2.5 text-footnote text-pewter">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {page.note}
        </p>
      </Section>

      <Section tone="white" width="text" labelledBy="encaja-titulo">
        <SectionHeader id="encaja-titulo" title={page.guideTitle} intro={page.guideIntro} />
        <ul className="space-y-3">
          {page.guide.map((item) => (
            <li
              key={item.plan}
              className="grid gap-2 rounded-tile bg-fog-white px-6 py-5 md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:px-8"
            >
              <p>{item.situation}</p>
              <TextLink href={`#${item.plan}`} className="font-semibold">
                {planNames.get(item.plan)}
              </TextLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section width="text" labelledBy="faq-planes-titulo">
        <SectionHeader id="faq-planes-titulo" title={page.faqTitle} />
        <FaqList faqs={planFaqs} />
      </Section>

      <DiagnosisCTA locale={locale} tone="white" />
    </>
  );
}
