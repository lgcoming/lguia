import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { jsonData } from "@/lib/api/http";
import { localeFromRequest } from "@/lib/api/locale";

/** GET /api/services[?locale=es|en] — the service catalog in the requested language. */
export async function GET(request: Request) {
  const catalog = getCatalogRepository(localeFromRequest(request));
  return jsonData(await catalog.listServiceCategories(), {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
