import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { categoryHref } from "@/features/catalog/routes";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const categories = await getCatalogRepository().listServiceCategories();
  const serviceLinks = categories.map((category) => ({
    href: categoryHref(category.id),
    label: category.name,
  }));

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter serviceLinks={serviceLinks} />
    </>
  );
}
