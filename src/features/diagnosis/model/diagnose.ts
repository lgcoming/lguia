import { categoryHref } from "@/features/catalog/routes";
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
import type { Plan, ServiceCategory } from "@/types/catalog";

export const AREA_LABELS: Record<DiagnosisArea, string> = {
  web: "Presencia web",
  automation: "Automatización",
  ai: "Inteligencia artificial",
  visibility: "Visibilidad en buscadores",
};

const AREA_ORDER: DiagnosisArea[] = ["web", "automation", "ai", "visibility"];

export const MATURITY_LEVELS: Record<MaturityLevelId, { label: string; summary: string }> = {
  initial: {
    label: "Inicial",
    summary:
      "Tu negocio tiene mucho margen de mejora digital. Con pocos cambios bien elegidos se nota la diferencia.",
  },
  developing: {
    label: "En desarrollo",
    summary:
      "Tienes una base digital, pero hay áreas concretas donde estás dejando pasar oportunidades.",
  },
  advanced: {
    label: "Avanzado",
    summary:
      "Tu negocio está bien digitalizado. El siguiente paso es optimizar y sacar más partido a lo que ya tienes.",
  },
};

export interface DiagnosisEvaluation {
  assessment: DiagnosisAssessment;
  plan: PlanRecommendation;
  services: ServiceRecommendation[];
  nextSteps: string[];
}

/** The full deterministic pipeline, without catalog data. */
export function evaluateDiagnosis(answers: DiagnosisAnswers): DiagnosisEvaluation {
  const assessment = calculateDiagnosis(answers);
  const plan = recommendPlan(answers, assessment);
  return {
    assessment,
    plan,
    services: getRecommendedServices(answers, assessment),
    nextSteps: buildNextSteps(plan.planId),
  };
}

export interface DiagnosisCatalog {
  plans: Plan[];
  categories: ServiceCategory[];
}

/** Evaluates the answers and resolves names, prices and links from the catalog. */
export function diagnose(answers: DiagnosisAnswers, catalog: DiagnosisCatalog): DiagnosisResult {
  const { assessment, plan, services, nextSteps } = evaluateDiagnosis(answers);

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
      category: { id: category.id, name: category.name, href: categoryHref(category.id) },
    };
  });

  return {
    score: assessment.score,
    level: { id: assessment.level, ...MATURITY_LEVELS[assessment.level] },
    areas: AREA_ORDER.map((id) => ({ id, label: AREA_LABELS[id], score: assessment.areas[id] })),
    recommendedPlan: {
      id: recommendedPlan.id,
      name: recommendedPlan.name,
      tagline: recommendedPlan.tagline,
      pricing: recommendedPlan.pricing,
      features: recommendedPlan.features,
      href: `/planes#${recommendedPlan.id}`,
    },
    recommendedServices,
    reasons: plan.reasons,
    nextSteps,
  };
}
