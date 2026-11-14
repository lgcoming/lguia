import type { Metadata } from "next";
import Image from "next/image";

import { CategoryIcon } from "@/components/marketing/category-icon";
import { categoryMedia } from "@/components/marketing/category-media";
import { ContactCTA, DiagnosisCTA } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { ServicesBento } from "@/components/marketing/service-tile";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import { TextLink } from "@/components/ui/text-link";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { format, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref, serviceHref } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/metadata";
import { webPageSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export function servicesMetadata(locale: Locale): Metadata {
  const { servicesPage } = getDictionary(locale);
  return createPageMetadata({
    locale,
    route: { page: "services" },
    title: servicesPage.metaTitle,
    description: servicesPage.metaDescription,
  });
}

export async function ServicesView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.servicesPage;
  const categories = await getCatalogRepository(locale).listServiceCategories();

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: { page: "services" },
          name: page.metaTitle,
          description: page.metaDescription,
          type: "CollectionPage",
        })}
      />
      <PageHero title={page.title} intro={page.intro}>
        <ButtonLink href={pageHref(locale, "diagnosis")} size="lg">
          {t.common.diagnosisCta}
        </ButtonLink>
        <ButtonLink href={pageHref(locale, "contact")} variant="secondary" size="lg">
          {t.common.proposalCta}
        </ButtonLink>
      </PageHero>

      <Section labelledBy="areas-titulo">
        <SectionHeader id="areas-titulo" title={page.areasTitle} intro={page.areasIntro} />
        <ServicesBento categories={categories} locale={locale} />
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
                  <TextLink href={serviceHref(locale, category.id)}>
                    {format(page.more, { name: category.name })}
                  </TextLink>
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

      <DiagnosisCTA locale={locale} tone={categories.length % 2 === 0 ? "white" : "canvas"} />
      <ContactCTA locale={locale} />
    </>
  );
}
