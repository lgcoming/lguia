import type { ServiceCategoryId } from "@/types/catalog";

export function categoryHref(id: ServiceCategoryId): string {
  return `/servicios/${id}`;
}
