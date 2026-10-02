import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DiagnosisCTA } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { PageHero } from "@/components/marketing/page-hero";
import { PlanCard } from "@/components/marketing/plan-card";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import { planFaqs } from "@/data/plans";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { createPageMetadata } from "@/lib/metadata";
import type { PlanId } from "@/types/catalog";

export const metadata: Metadata = createPageMetadata({
  title: "Planes y precios",
  description:
    "Planes de web, SEO, inteligencia artificial y automatización para pymes, con precios orientativos y presupuesto cerrado tras el diagnóstico.",
  path: "/planes",
});

const planGuide: { situation: string; planId: PlanId }[] = [
  {
    situation:
      "Eres autónomo o tienes un negocio local y todavía no tienes web, o la tuya se ha quedado anticuada.",
    planId: "starter-local",
  },
  {
    situation: "Tu empresa necesita una web corporativa completa que capte clientes y posicione.",
    planId: "web-pro",
  },
  {
    situation: "Recibes muchas consultas repetidas y quieres probar la IA con un caso concreto.",
    planId: "ia-starter",
  },
  {
    situation: "Tu equipo pierde horas copiando datos y respondiendo siempre lo mismo.",
    planId: "automation-pack",
  },
  {
    situation: "Quieres trabajar web, SEO, IA y automatización a la vez para crecer.",
    planId: "growth-web-ia",
  },
  {
    situation: "Tienes varios departamentos, sistemas propios o necesidades complejas.",
    planId: "custom-enterprise",
  },
];

export default async function PlansPage() {
  const plans = await getCatalogRepository().listPlans();
  const planNames = new Map(plans.map((plan) => [plan.id, plan.name]));

  return (
    <>
      <PageHero
        title="Planes pensados para cada etapa de tu negocio"
        intro="Elige un punto de partida. Todos los proyectos empiezan con un diagnóstico y terminan con un presupuesto cerrado, sin sorpresas."
      >
        <ButtonLink href="/diagnostico-digital" size="lg">
          Descubre qué plan te encaja
        </ButtonLink>
      </PageHero>

      <Section labelledBy="todos-planes-titulo">
        <h2 id="todos-planes-titulo" className="sr-only">
          Todos los planes
        </h2>
        <RevealList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <RevealItem key={plan.id}>
              <PlanCard plan={plan} />
            </RevealItem>
          ))}
        </RevealList>
        <p className="mt-8 flex max-w-3xl gap-3 text-ink-soft">
          <Info aria-hidden="true" className="mt-1 size-5 shrink-0 text-pine-700" />
          Precios orientativos sin IVA. El presupuesto final depende del alcance de cada proyecto y
          se cierra contigo tras el diagnóstico, antes de empezar.
        </p>
      </Section>

      <Section tone="mist" labelledBy="encaja-titulo">
        <SectionHeader
          id="encaja-titulo"
          title="¿Qué plan encaja contigo?"
          intro="Una guía rápida. Si sigues con dudas, el diagnóstico digital te recomienda un plan con sus motivos en unos 3 minutos."
        />
        <ul className="divide-y divide-line border-y border-line">
          {planGuide.map((item) => (
            <li
              key={item.planId}
              className="grid gap-2 py-5 md:grid-cols-[1fr_auto] md:items-center md:gap-8"
            >
              <p>{item.situation}</p>
              <Link
                href={`#${item.planId}`}
                className="inline-flex min-h-11 items-center font-semibold text-pine-700 underline-offset-4 hover:underline"
              >
                {planNames.get(item.planId)}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="faq-planes-titulo">
        <SectionHeader id="faq-planes-titulo" title="Preguntas frecuentes sobre los planes" />
        <FaqList faqs={planFaqs} />
      </Section>

      <DiagnosisCTA />
    </>
  );
}
