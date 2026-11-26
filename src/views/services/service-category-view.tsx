import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categoryMedia } from "@/components/marketing/category-media";
import { ContactCTA } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { PageHero } from "@/components/marketing/page-hero";
import { PlanCard } from "@/components/marketing/plan-card";
import { PrototypeOffer } from "@/components/marketing/prototype-offer";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { ServiceTile } from "@/components/marketing/service-tile";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { formatEuro } from "@/features/catalog/format";
import { format, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref, serviceHref, serviceIdFromSlug } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";
import type { Plan } from "@/types/catalog";

async function findCategory(locale: Locale, slug: string) {
  const id = serviceIdFromSlug(locale, slug);
  return id ? getCatalogRepository(locale).getServiceCategory(id) : undefined;
}

export async function serviceCategoryMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const category = await findCategory(locale, slug);
  if (!category) return {};
  return createPageMetadata({
    locale,
    route: { service: category.id },
    title: category.seoTitle,
    description: category.seoDescription,
  });
}

/** Cheapest related plan with a public price: the "from" figure and timeline of the service. */
function entryPlan(plans: Plan[]): Plan | undefined {
  return plans
    .filter((plan) => plan.pricing.kind === "from")
    .sort((a, b) =>
      a.pricing.kind === "from" && b.pricing.kind === "from"
        ? a.pricing.amount - b.pricing.amount
        : 0,
    )[0];
}

export async function ServiceCategoryView({ locale, slug }: { locale: Locale; slug: string }) {
  const t = getDictionary(locale);
  const page = t.servicePage;
  const catalog = getCatalogRepository(locale);
  const category = await findCategory(locale, slug);
  if (!category) notFound();

  const [relatedPlans, allCategories, processSteps] = await Promise.all([
    catalog.getPlans(category.relatedPlanIds),
    catalog.listServiceCategories(),
    catalog.listProcessSteps(),
  ]);
  const otherCategories = allCategories.filter((other) => other.id !== category.id);
  const entry = entryPlan(relatedPlans);
  const breadcrumbs = [
    { href: pageHref(locale, "home"), label: t.common.home },
    { href: pageHref(locale, "services"), label: page.services },
    { href: serviceHref(locale, category.id), label: category.name },
  ];
  const facts = [
    {
      label: page.facts.from,
      value:
        entry?.pricing.kind === "from"
          ? formatEuro(entry.pricing.amount, locale)
          : page.facts.customQuote,
    },
    ...(entry ? [{ label: page.facts.timeline, value: entry.timeline }] : []),
    { label: page.facts.quote, value: page.facts.quoteValue },
  ];

  // H2s name the page's search term ("Precios de diseño web a medida"), not a generic label.
  const topic = { topic: category.topic };

  return (
    <>
      <JsonLd data={serviceSchema(category, locale, relatedPlans)} />
      <JsonLd
        data={breadcrumbSchema(breadcrumbs.map((item) => ({ name: item.label, path: item.href })))}
      />
      <JsonLd data={faqSchema(category.faqs)} />
      <PageHero
        title={category.headline}
        intro={category.description}
        breadcrumbs={breadcrumbs}
        breadcrumbsLabel={t.common.breadcrumbs}
        media={{
          image: categoryMedia[category.id].image,
          position: categoryMedia[category.id].position,
        }}
      >
        <ButtonLink href={pageHref(locale, "contact")} size="lg" className="w-full sm:w-auto">
          {t.common.proposalCta}
        </ButtonLink>
        <ButtonLink
          href={pageHref(locale, "diagnosis")}
          variant="glass"
          size="lg"
          className="w-full sm:w-auto"
        >
          {t.common.diagnosisCta}
        </ButtonLink>
      </PageHero>

      {/* Answer-first block: a quotable definition of the service with price and timeline. */}
      <Section tone="white" width="text" labelledBy="resumen-titulo">
        <h2 id="resumen-titulo" className="text-subheading font-semibold text-pewter">
          {page.answerTitle}
        </h2>
        <p className="mt-4 text-[1.375rem] leading-[1.4] tracking-[-0.01em] md:text-heading-sm md:leading-[1.35]">
          {category.answer}
        </p>
        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-tile bg-fog-white p-6">
              <dt className="text-footnote text-pewter">{fact.label}</dt>
              <dd className="mt-1 text-subheading font-semibold tabular">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {category.id === "desarrollo-web" ? <PrototypeOffer locale={locale} /> : null}

      <Section labelledBy="problemas-titulo">
        <SectionHeader id="problemas-titulo" title={format(page.problemsTitle, topic)} />
        <RevealList className="grid gap-4 lg:grid-cols-3">
          {category.problems.map((problem) => (
            <RevealItem key={problem.pain} className="rounded-tile bg-pure-white p-7 md:p-8">
              <h3 className="text-subheading font-semibold">{problem.pain}</h3>
              <p className="mt-3 text-footnote text-pewter">{problem.solution}</p>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      <Section tone="white" labelledBy="incluye-titulo">
        <SectionHeader id="incluye-titulo" title={format(page.includesTitle, topic)} />
        <RevealList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((service) => (
            <RevealItem key={service.id} className="rounded-tile bg-fog-white p-7 md:p-8">
              <h3 className="text-subheading font-semibold">{service.name}</h3>
              <p className="mt-2 text-footnote text-pewter">{service.description}</p>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      <Section labelledBy="consigues-titulo">
        <SectionHeader id="consigues-titulo" title={page.outcomesTitle} />
        <ul className="grid gap-4 md:grid-cols-2">
          {category.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-4 rounded-tile bg-pure-white p-6">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-obsidian text-pure-white">
                <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
              </span>
              <span className="pt-0.5 text-body">{outcome}</span>
            </li>
          ))}
        </ul>
        {/* Mid-page call to action: the page asks for the contact once the value is clear. */}
        <div className="surface-dark mt-12 flex flex-col items-center gap-5 rounded-tile bg-obsidian px-6 py-10 text-center text-pure-white md:px-12">
          <div>
            <p className="text-heading-sm">{page.midCta.title}</p>
            <p className="mx-auto mt-2 max-w-xl text-body text-ash-veil">{page.midCta.text}</p>
          </div>
          <ButtonLink href={pageHref(locale, "contact")} size="lg">
            {t.common.proposalCta}
          </ButtonLink>
        </div>
      </Section>

      <Section tone="white" labelledBy="planes-titulo">
        <SectionHeader
          id="planes-titulo"
          title={format(page.plansTitle, topic)}
          intro={page.plansIntro}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {relatedPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} locale={locale} tone="canvas" />
          ))}
        </div>
      </Section>

      <Section labelledBy="proceso-titulo">
        <SectionHeader id="proceso-titulo" title={page.processTitle} intro={page.processIntro} />
        <ProcessSteps steps={processSteps} />
      </Section>

      <Section tone="white" width="text" labelledBy="faq-titulo">
        <SectionHeader id="faq-titulo" title={format(page.faqTitle, topic)} />
        <FaqList faqs={category.faqs} tone="canvas" />
      </Section>

      <Section labelledBy="otros-titulo">
        <SectionHeader id="otros-titulo" title={page.othersTitle} />
        <ul className="grid gap-4 md:grid-cols-3">
          {otherCategories.map((other) => (
            <li key={other.id} className="flex">
              <ServiceTile
                category={other}
                locale={locale}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </Section>

      <ContactCTA locale={locale} />
    </>
  );
}
