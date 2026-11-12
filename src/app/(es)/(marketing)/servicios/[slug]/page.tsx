import type { Metadata } from "next";

import { serviceSlugs } from "@/i18n/routes";
import {
  ServiceCategoryView,
  serviceCategoryMetadata,
} from "@/views/services/service-category-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs("es").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return serviceCategoryMetadata("es", slug);
}

export default async function Page({ params }: PageProps<"/servicios/[slug]">) {
  const { slug } = await params;
  return <ServiceCategoryView locale="es" slug={slug} />;
}
