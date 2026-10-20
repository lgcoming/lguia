import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BrandWatermark } from "@/components/media/brand-watermark";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout-primitives";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { categoryHref } from "@/features/catalog/routes";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default async function NotFound() {
  const categories = await getCatalogRepository().listServiceCategories();
  const serviceLinks = categories.map((category) => ({
    href: categoryHref(category.id),
    label: category.name,
  }));

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="relative isolate overflow-hidden bg-pure-white">
        <BrandWatermark className="top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" />
        <Container width="text" className="py-24 text-center md:py-36">
          <p className="text-subheading font-semibold text-pewter">Error 404</p>
          <h1 className="mt-3 text-[2.5rem] leading-[1.08] tracking-[-0.02em] md:text-display">
            No encontramos esta página
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-body text-pewter md:text-subheading">
            Puede que la dirección haya cambiado o que el enlace no sea correcto. Estas páginas te
            pueden ayudar:
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" size="lg">
              Ir al inicio
            </ButtonLink>
            <ButtonLink href="/servicios" variant="secondary" size="lg">
              Ver servicios
            </ButtonLink>
            <ButtonLink href="/diagnostico-digital" variant="secondary" size="lg">
              Hacer el diagnóstico
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter serviceLinks={serviceLinks} />
    </>
  );
}
