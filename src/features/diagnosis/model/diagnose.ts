import { getDiagnosisContent } from "@/features/diagnosis/content";
import { diagnosisContentEs } from "@/features/diagnosis/content/es";
import type { DiagnosisEngineCopy } from "@/features/diagnosis/content/types";
import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import {
  buildNextSteps,
  getRecommendedServices,
  recommendPlan,
} from "@/features/diagnosis/model/recommendation";
import { calculateDiagnosis } from "@/features/diagnosis/model/scoring";
import type {
  DiagnosisArea,
  DiagnosisAssessment,
  DiagnosisResult,
  MaturityLevelId,
  PlanRecommendation,
  ServiceRecommendation,
} from "@/features/diagnosis/model/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { planHref, serviceHref } from "@/i18n/routes";
import type { Plan, ServiceCategory } from "@/types/catalog";

const AREA_ORDER: DiagnosisArea[] = ["web", "automation", "ai", "visibility"];

/** Spanish labels, used by the internal admin view. */
export const MATURITY_LEVELS: Record<MaturityLevelId, { label: string; summary: string }> =
  diagnosisContentEs.engine.levels;

export interface DiagnosisEvaluation {
  assessment: DiagnosisAssessment;
  plan: PlanRecommendation;
  services: ServiceRecommendation[];
  nextSteps: string[];
}

/** The full deterministic pipeline, without catalog data. Scores and ids never depend on `copy`. */
export function evaluateDiagnosis(
  answers: DiagnosisAnswers,
  copy: DiagnosisEngineCopy = diagnosisContentEs.engine,
): DiagnosisEvaluation {
  const assessment = calculateDiagnosis(answers);
  const plan = recommendPlan(answers, assessment, copy);
  return {
    assessment,
    plan,
    services: getRecommendedServices(answers, assessment, copy),
    nextSteps: buildNextSteps(plan.planId, copy),
  };
}

export interface DiagnosisCatalog {
  plans: Plan[];
  categories: ServiceCategory[];
}

/**
 * Evaluates the answers and resolves names, prices and links from the catalog. The catalog and
 * `locale` must be in the same language: wording and URLs follow the locale (SPEC-009).
 */
export function diagnose(
  answers: DiagnosisAnswers,
  catalog: DiagnosisCatalog,
  locale: Locale = DEFAULT_LOCALE,
): DiagnosisResult {
  const copy = getDiagnosisContent(locale).engine;
  const { assessment, plan, services, nextSteps } = evaluateDiagnosis(answers, copy);

  const recommendedPlan = catalog.plans.find((candidate) => candidate.id === plan.planId);
  if (!recommendedPlan) {
    throw new Error(`Diagnosis recommended unknown plan "${plan.planId}"`);
  }

  const recommendedServices = services.map((recommendation) => {
    const category = catalog.categories.find((c) => c.id === recommendation.categoryId);
    const service = category?.services.find((s) => s.id === recommendation.serviceId);
    if (!category || !service) {
      throw new Error(`Diagnosis recommended unknown service "${recommendation.serviceId}"`);
    }
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      reason: recommendation.reason,
      category: { id: category.id, name: category.name, href: serviceHref(locale, category.id) },
    };
  });

  return {
    score: assessment.score,
    level: { id: assessment.level, ...copy.levels[assessment.level] },
    areas: AREA_ORDER.map((id) => ({ id, label: copy.areas[id], score: assessment.areas[id] })),
    recommendedPlan: {
      id: recommendedPlan.id,
      name: recommendedPlan.name,
      tagline: recommendedPlan.tagline,
      pricing: recommendedPlan.pricing,
      features: recommendedPlan.features,
      href: planHref(locale, recommendedPlan.id),
    },
    recommendedServices,
    reasons: plan.reasons,
    nextSteps,
  };
}
