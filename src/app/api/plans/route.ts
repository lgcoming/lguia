import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { jsonData } from "@/lib/api/http";

export const dynamic = "force-static";

/** GET /api/plans — plans with indicative pricing, prerendered at build time. */
export async function GET() {
  return jsonData(await getCatalogRepository().listPlans());
}
