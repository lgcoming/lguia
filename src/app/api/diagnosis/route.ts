import { getDiagnosisContent } from "@/features/diagnosis/content";
import { runDiagnosis } from "@/features/diagnosis/diagnosis-service";
import { validateDiagnosis } from "@/features/diagnosis/model/validation";
import { apiErrors, jsonData, readJsonBody } from "@/lib/api/http";
import { localeFromRequest } from "@/lib/api/locale";

/**
 * POST /api/diagnosis[?locale=es|en] — stateless: computes a DiagnosisResult in the requested
 * language, stores nothing (SPEC-006).
 */
export async function POST(request: Request) {
  const locale = localeFromRequest(request);
  const body = await readJsonBody(request);
  if (!body.ok) return apiErrors.invalidJson(locale);

  const validation = validateDiagnosis(body.value, getDiagnosisContent(locale).requiredMessage);
  if (!validation.success) return apiErrors.validation(validation.issues, locale);

  try {
    return jsonData(await runDiagnosis(validation.data, locale));
  } catch (error) {
    console.error("[POST /api/diagnosis]", error);
    return apiErrors.internal(locale);
  }
}
