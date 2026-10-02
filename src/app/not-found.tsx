import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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
      <main id="contenido" className="bg-mist">
        <Container className="py-20 md:py-28">
          <p className="font-semibold text-pine-700">Error 404</p>
          <h1 className="mt-3 max-w-2xl text-h1">No encontramos esta página</h1>
          <p className="mt-4 max-w-xl text-lead text-ink-soft">
            Puede que la dirección haya cambiado o que el enlace no sea correcto. Estas páginas te
            pueden ayudar:
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
