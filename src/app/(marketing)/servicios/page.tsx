import type { Metadata } from "next";
import Image from "next/image";

import { CategoryIcon } from "@/components/marketing/category-icon";
import { categoryMedia } from "@/components/marketing/category-media";
import { ContactCTA, DiagnosisCTA } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { ServicesBento } from "@/components/marketing/service-tile";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import { TextLink } from "@/components/ui/text-link";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { categoryHref } from "@/features/catalog/routes";
import { createPageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

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

      <Section labelledBy="areas-titulo">
        <SectionHeader
          id="areas-titulo"
          title="Cuatro áreas, un mismo equipo"
          intro="Elige un área para ver en detalle qué incluye, cómo trabajamos y los planes relacionados."
        />
        <ServicesBento categories={categories} />
      </Section>

      {categories.map((category, index) => {
        const media = categoryMedia[category.id];
        const onWhite = index % 2 === 0;
        return (
          <Section
            key={category.id}
            id={category.id}
            labelledBy={`${category.id}-titulo`}
            tone={onWhite ? "white" : "canvas"}
            className="scroll-mt-(--header-height)"
          >
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
              <div className="lg:sticky lg:top-24">
                <div className="relative aspect-[16/10] overflow-hidden rounded-tile bg-carbon">
                  <Image
                    src={media.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className={cn("object-cover", media.position)}
                  />
                </div>
                <CategoryIcon icon={category.icon} className="mt-8 size-7 text-obsidian" />
                <h2
                  id={`${category.id}-titulo`}
                  className="mt-3 text-[2rem] leading-[1.1] tracking-[-0.01em] md:text-heading-lg"
                >
                  {category.name}
                </h2>
                <p className="mt-4 text-body text-pewter md:text-subheading">
                  {category.description}
                </p>
                <div className="mt-4">
                  <TextLink href={categoryHref(category.id)}>Más sobre {category.name}</TextLink>
                </div>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {category.services.map((service) => (
                  <li
                    key={service.id}
                    className={cn("rounded-tile p-6", onWhite ? "bg-fog-white" : "bg-pure-white")}
                  >
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="mt-2 text-footnote text-pewter">{service.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        );
      })}

      <DiagnosisCTA tone={categories.length % 2 === 0 ? "white" : "canvas"} />
      <ContactCTA />
    </>
  );
}
