import { getLeadSchemas } from "@/features/leads/content";
import { getLeadRepository } from "@/features/leads/lead-repository";
import { submitLead } from "@/features/leads/lead-service";
import { isAdminEnabled } from "@/lib/admin-access";
import { apiErrors, jsonData, readJsonBody } from "@/lib/api/http";
import { localeFromRequest } from "@/lib/api/locale";
import { toApiIssues } from "@/lib/validation";

/**
 * POST /api/leads[?locale=es|en] — validate, then hand over to the lead service (SPEC-006).
 * The locale selects the language of validation messages and is stored with the lead.
 */
export async function POST(request: Request) {
  const locale = localeFromRequest(request);
  const body = await readJsonBody(request);
  if (!body.ok) return apiErrors.invalidJson(locale);

  const parsed = getLeadSchemas(locale).leadInputSchema.safeParse(body.value);
  if (!parsed.success) return apiErrors.validation(toApiIssues(parsed.error), locale);

  try {
    const { receipt } = await submitLead(parsed.data, { locale });
    return jsonData(receipt, { status: 201 });
  } catch (error) {
    console.error("[POST /api/leads]", error);
    return apiErrors.internal(locale);
  }
}

/** GET /api/leads — private data: 404 unless the admin gate is open (no auth yet). */
export async function GET() {
  if (!isAdminEnabled()) return apiErrors.notFound();
  const leads = await getLeadRepository().list();
  return jsonData(leads, { headers: { "Cache-Control": "no-store" } });
}
