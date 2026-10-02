import type { MetadataRoute } from "next";

import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { categoryHref } from "@/features/catalog/routes";
import { absoluteUrl } from "@/lib/site";

/** Public, indexable routes only (SPEC-007). Admin and API routes are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCatalogRepository().listServiceCategories();
  const lastModified = new Date();

  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/diagnostico-digital", priority: 0.9 },
    { path: "/servicios", priority: 0.9 },
    ...categories.map((category) => ({ path: categoryHref(category.id), priority: 0.8 })),
    { path: "/planes", priority: 0.8 },
    { path: "/contacto", priority: 0.7 },
  ];

  return pages.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
