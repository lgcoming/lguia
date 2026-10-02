import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { jsonData } from "@/lib/api/http";

export const dynamic = "force-static";

/** GET /api/services — the service catalog, prerendered at build time. */
export async function GET() {
  return jsonData(await getCatalogRepository().listServiceCategories());
}
