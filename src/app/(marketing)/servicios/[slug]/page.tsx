import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCTA } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { PageHero } from "@/components/marketing/page-hero";
import { PlanCard } from "@/components/marketing/plan-card";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { ServiceCard } from "@/components/marketing/service-card";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import { processSteps } from "@/data/process";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { categoryHref } from "@/features/catalog/routes";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";
import { SERVICE_CATEGORY_IDS } from "@/types/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_CATEGORY_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCatalogRepository().getServiceCategory(slug);
  if (!category) return {};

  return createPageMetadata({
    title: category.seoTitle,
    description: category.summary,
    path: categoryHref(category.id),
  });
}

export default async function ServiceCategoryPage({ params }: PageProps<"/servicios/[slug]">) {
  const { slug } = await params;
  const catalog = getCatalogRepository();
  const category = await catalog.getServiceCategory(slug);
  if (!category) notFound();

  const [relatedPlans, allCategories] = await Promise.all([
    catalog.getPlans(category.relatedPlanIds),
    catalog.listServiceCategories(),
  ]);
  const otherCategories = allCategories.filter((other) => other.id !== category.id);
  const breadcrumbs = [
    { href: "/", label: "Inicio" },
    { href: "/servicios", label: "Servicios" },
    { href: categoryHref(category.id), label: category.name },
  ];

  return (
    <>
      <JsonLd data={serviceSchema(category)} />
      <JsonLd
        data={breadcrumbSchema(breadcrumbs.map((item) => ({ name: item.label, path: item.href })))}
      />
      <JsonLd data={faqSchema(category.faqs)} />
      <PageHero title={category.headline} intro={category.description} breadcrumbs={breadcrumbs}>
        <ButtonLink href="/diagnostico-digital" size="lg">
          Haz tu diagnóstico digital
        </ButtonLink>
        <ButtonLink href="/contacto" variant="secondary" size="lg">
          Pedir propuesta
        </ButtonLink>
      </PageHero>

      <Section labelledBy="incluye-titulo">
        <SectionHeader id="incluye-titulo" title="Qué incluye" />
        <RevealList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((service) => (
            <RevealItem key={service.id} className="rounded-card border border-line bg-paper p-6">
              <h3 className="text-h4">{service.name}</h3>
              <p className="mt-2 text-ink-soft">{service.description}</p>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      <Section tone="mist" labelledBy="consigues-titulo">
        <SectionHeader id="consigues-titulo" title="Qué consigue tu negocio" />
        <ul className="grid gap-x-10 gap-y-5 md:grid-cols-2">
          {category.outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-3 text-lead">
              <Check aria-hidden="true" className="mt-1.5 size-5 shrink-0 text-pine-700" />
              {outcome}
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="proceso-titulo">
        <SectionHeader
          id="proceso-titulo"
          title="Cómo lo hacemos"
          intro="El mismo proceso por fases en todos nuestros proyectos, para que siempre sepas qué viene después."
        />
        <ProcessSteps steps={processSteps} />
      </Section>

      <Section tone="mist" labelledBy="planes-titulo">
        <SectionHeader
          id="planes-titulo"
          title="Planes relacionados"
          intro="Precios orientativos sin IVA. El presupuesto final se cierra tras el diagnóstico."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {relatedPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Section>

      <Section labelledBy="faq-titulo">
        <SectionHeader id="faq-titulo" title="Preguntas frecuentes" />
        <FaqList faqs={category.faqs} />
      </Section>

      <Section tone="mist" labelledBy="otros-titulo">
        <SectionHeader id="otros-titulo" title="Otros servicios" />
        <div className="grid gap-6 md:grid-cols-3">
          {otherCategories.map((other) => (
            <ServiceCard key={other.id} category={other} />
          ))}
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
