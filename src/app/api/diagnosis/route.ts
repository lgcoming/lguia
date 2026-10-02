import { runDiagnosis } from "@/features/diagnosis/diagnosis-service";
import { validateDiagnosis } from "@/features/diagnosis/model/validation";
import { apiErrors, jsonData, readJsonBody } from "@/lib/api/http";

/** POST /api/diagnosis — stateless: computes a DiagnosisResult, stores nothing (SPEC-006). */
export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (!body.ok) return apiErrors.invalidJson();

  const validation = validateDiagnosis(body.value);
  if (!validation.success) return apiErrors.validation(validation.issues);

  try {
    return jsonData(await runDiagnosis(validation.data));
  } catch (error) {
    console.error("[POST /api/diagnosis]", error);
    return apiErrors.internal();
  }
}
