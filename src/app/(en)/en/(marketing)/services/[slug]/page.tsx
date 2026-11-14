import type { Metadata } from "next";

import { serviceSlugs } from "@/i18n/routes";
import {
  ServiceCategoryView,
  serviceCategoryMetadata,
} from "@/views/services/service-category-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs("en").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/en/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return serviceCategoryMetadata("en", slug);
}

export default async function Page({ params }: PageProps<"/en/services/[slug]">) {
  const { slug } = await params;
  return <ServiceCategoryView locale="en" slug={slug} />;
}
