import {
  getCatalogRepository,
  type CatalogRepository,
} from "@/features/catalog/catalog-repository";
import { diagnose } from "@/features/diagnosis/model/diagnose";
import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import type { DiagnosisResult } from "@/features/diagnosis/model/types";

/** Application service behind POST /api/diagnosis: loads the catalog and runs the engine. */
export async function runDiagnosis(
  answers: DiagnosisAnswers,
  catalog: CatalogRepository = getCatalogRepository(),
): Promise<DiagnosisResult> {
  const [plans, categories] = await Promise.all([
    catalog.listPlans(),
    catalog.listServiceCategories(),
  ]);
  return diagnose(answers, { plans, categories });
}
