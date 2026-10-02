import type { PlanId, PlanPricing, ServiceCategoryId } from "@/types/catalog";

/** Maturity areas shown in the result (higher score = more mature). */
export type DiagnosisArea = "web" | "automation" | "ai" | "visibility";

/** Opportunity categories used for recommendations (higher need = bigger opportunity). */
export type NeedCategory = "web" | "automation" | "ai" | "seo";

export type MaturityLevelId = "initial" | "developing" | "advanced";

export interface DiagnosisAssessment {
  areas: Record<DiagnosisArea, number>;
  score: number;
  level: MaturityLevelId;
  needs: Record<NeedCategory, number>;
}

export interface PlanRecommendation {
  planId: PlanId;
  reasons: string[];
}

export interface ServiceRecommendation {
  serviceId: string;
  categoryId: ServiceCategoryId;
  reason: string;
}

export interface DiagnosisResult {
  score: number;
  level: { id: MaturityLevelId; label: string; summary: string };
  areas: { id: DiagnosisArea; label: string; score: number }[];
  recommendedPlan: {
    id: PlanId;
    name: string;
    tagline: string;
    pricing: PlanPricing;
    features: string[];
    href: string;
  };
  recommendedServices: {
    id: string;
    name: string;
    description: string;
    reason: string;
    category: { id: ServiceCategoryId; name: string; href: string };
  }[];
  reasons: string[];
  nextSteps: string[];
}
