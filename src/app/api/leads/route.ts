import { getLeadRepository } from "@/features/leads/lead-repository";
import { submitLead } from "@/features/leads/lead-service";
import { leadInputSchema } from "@/features/leads/schema";
import { isAdminEnabled } from "@/lib/admin-access";
import { apiErrors, jsonData, readJsonBody } from "@/lib/api/http";
import { toApiIssues } from "@/lib/validation";

/** POST /api/leads — validate, then hand over to the lead service (SPEC-006). */
export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (!body.ok) return apiErrors.invalidJson();

  const parsed = leadInputSchema.safeParse(body.value);
  if (!parsed.success) return apiErrors.validation(toApiIssues(parsed.error));

  try {
    const { receipt } = await submitLead(parsed.data);
    return jsonData(receipt, { status: 201 });
  } catch (error) {
    console.error("[POST /api/leads]", error);
    return apiErrors.internal();
  }
}

/** GET /api/leads — private data: 404 unless the admin gate is open (no auth yet). */
export async function GET() {
  if (!isAdminEnabled()) return apiErrors.notFound();
  const leads = await getLeadRepository().list();
  return jsonData(leads, { headers: { "Cache-Control": "no-store" } });
}
