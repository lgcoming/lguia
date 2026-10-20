import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categoryMedia } from "@/components/marketing/category-media";
import { ContactCTA } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { PageHero } from "@/components/marketing/page-hero";
import { PlanCard } from "@/components/marketing/plan-card";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { ServiceTile } from "@/components/marketing/service-tile";
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
      <PageHero
        title={category.headline}
        intro={category.description}
        breadcrumbs={breadcrumbs}
        media={{
          image: categoryMedia[category.id].image,
          position: categoryMedia[category.id].position,
        }}
      >
        <ButtonLink href="/diagnostico-digital" size="lg" className="w-full sm:w-auto">
          Haz tu diagnóstico digital
        </ButtonLink>
        <ButtonLink href="/contacto" variant="glass" size="lg" className="w-full sm:w-auto">
          Pedir propuesta
        </ButtonLink>
      </PageHero>

      <Section labelledBy="incluye-titulo">
        <SectionHeader id="incluye-titulo" title="Qué incluye" />
        <RevealList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((service) => (
            <RevealItem key={service.id} className="rounded-tile bg-pure-white p-7 md:p-8">
              <h3 className="text-subheading font-semibold">{service.name}</h3>
              <p className="mt-2 text-footnote text-pewter">{service.description}</p>
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      <Section tone="white" labelledBy="consigues-titulo">
        <SectionHeader id="consigues-titulo" title="Qué consigue tu negocio" />
        <ul className="grid gap-4 md:grid-cols-2">
          {category.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-4 rounded-tile bg-fog-white p-6">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-obsidian text-pure-white">
                <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
              </span>
              <span className="pt-0.5 text-body">{outcome}</span>
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

      <Section tone="white" labelledBy="planes-titulo">
        <SectionHeader
          id="planes-titulo"
          title="Planes relacionados"
          intro="Precios orientativos sin IVA. El presupuesto final se cierra tras el diagnóstico."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {relatedPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} tone="canvas" />
          ))}
        </div>
      </Section>

      <Section width="text" labelledBy="faq-titulo">
        <SectionHeader id="faq-titulo" title="Preguntas frecuentes" />
        <FaqList faqs={category.faqs} />
      </Section>

      <Section tone="white" labelledBy="otros-titulo">
        <SectionHeader id="otros-titulo" title="Otros servicios" />
        <ul className="grid gap-4 md:grid-cols-3">
          {otherCategories.map((other) => (
            <li key={other.id} className="flex">
              <ServiceTile
                category={other}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </Section>

      <ContactCTA />
    </>
  );
}
