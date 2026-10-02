import type { Metadata } from "next";

import { CategoryIcon } from "@/components/marketing/category-icon";
import { ContactCTA, DiagnosisCTA } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/layout-primitives";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { categoryHref } from "@/features/catalog/routes";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Servicios digitales para pymes",
  description:
    "Desarrollo web, automatizaciones, IA para empresas y SEO + GEO. Cuatro áreas que se complementan para que tu negocio consiga clientes y ahorre tiempo.",
  path: "/servicios",
});

export default async function ServicesPage() {
  const categories = await getCatalogRepository().listServiceCategories();

  return (
    <>
      <PageHero
        title="Servicios digitales para pymes y negocios locales"
        intro="Una web que capta clientes, automatizaciones que ahorran tiempo, inteligencia artificial aplicada con criterio y visibilidad en buscadores. Puedes empezar por una y sumar las demás cuando tenga sentido."
      >
        <ButtonLink href="/diagnostico-digital" size="lg">
          Haz tu diagnóstico digital
        </ButtonLink>
        <ButtonLink href="/contacto" variant="secondary" size="lg">
          Pedir propuesta
        </ButtonLink>
      </PageHero>

      {categories.map((category, index) => (
        <Section
          key={category.id}
          id={category.id}
          labelledBy={`${category.id}-titulo`}
          tone={index % 2 === 0 ? "paper" : "mist"}
          className="scroll-mt-18"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                <CategoryIcon icon={category.icon} className="size-6" />
              </span>
              <h2
                id={`${category.id}-titulo`}
                className="mt-6 text-[1.75rem] leading-tight md:text-h2"
              >
                {category.name}
              </h2>
              <p className="mt-4 text-lead text-ink-soft">{category.description}</p>
              <ButtonLink href={categoryHref(category.id)} variant="secondary" className="mt-8">
                Más sobre {category.name}
              </ButtonLink>
            </div>
            <ul className="grid content-start gap-x-8 sm:grid-cols-2">
              {category.services.map((service) => (
                <li key={service.id} className="border-t border-line py-5">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="mt-1 text-base text-ink-soft">{service.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ))}

      <DiagnosisCTA />
      <ContactCTA />
    </>
  );
}
