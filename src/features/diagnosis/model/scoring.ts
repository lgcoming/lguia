import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import type {
  DiagnosisArea,
  DiagnosisAssessment,
  MaturityLevelId,
  NeedCategory,
} from "@/features/diagnosis/model/types";

/*
 * Scoring rules from SPEC-004. Weights are integers that sum to 100 so the
 * arithmetic stays exact before the final rounding.
 */

const WEBSITE: Record<DiagnosisAnswers["websiteStatus"], number> = {
  none: 0,
  outdated: 25,
  basic: 60,
  modern: 100,
};
const WEB_LEADS: Record<DiagnosisAnswers["webLeads"], number> = {
  none: 0,
  occasional: 50,
  regular: 100,
};
const AUTOMATION: Record<DiagnosisAnswers["automationLevel"], number> = {
  none: 0,
  basic: 50,
  advanced: 100,
};
const REPETITIVE: Record<DiagnosisAnswers["repetitiveWorkload"], number> = {
  high: 0,
  medium: 50,
  low: 100,
};
const AI_ADOPTION: Record<DiagnosisAnswers["aiAdoption"], number> = {
  none: 0,
  interested: 15,
  exploring: 50,
  using: 100,
};
const SEO: Record<DiagnosisAnswers["seoStatus"], number> = {
  none: 0,
  occasional: 45,
  active: 100,
};
const VISIBILITY_CAP_WITHOUT_WEBSITE = 20;

const AREA_WEIGHTS: Record<DiagnosisArea, number> = {
  web: 35,
  automation: 25,
  visibility: 20,
  ai: 20,
};

const GOAL_BOOSTS: Record<DiagnosisAnswers["mainGoal"], Partial<Record<NeedCategory, number>>> = {
  presence: { web: 20 },
  leads: { web: 10, seo: 15 },
  sales: { web: 20, seo: 5 },
  efficiency: { automation: 20 },
  ai: { ai: 20 },
  growth: { web: 10, automation: 10, ai: 10, seo: 10 },
};
const AI_BASE_NEED: Record<DiagnosisAnswers["aiAdoption"], number> = {
  none: 5,
  interested: 55,
  exploring: 60,
  using: 45,
};
const CHATBOT_NEED: Record<DiagnosisAnswers["chatbotInterest"], number> = {
  yes: 30,
  maybe: 15,
  no: 0,
};
const VISIBILITY_GOAL_FACTOR: Record<DiagnosisAnswers["visibilityGoal"], number> = {
  priority: 100,
  interested: 70,
  "not-now": 30,
};

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

export function calculateAreaScores(answers: DiagnosisAnswers): Record<DiagnosisArea, number> {
  const seo = SEO[answers.seoStatus];
  return {
    web: Math.round((65 * WEBSITE[answers.websiteStatus] + 35 * WEB_LEADS[answers.webLeads]) / 100),
    automation: Math.round(
      (60 * AUTOMATION[answers.automationLevel] + 40 * REPETITIVE[answers.repetitiveWorkload]) /
        100,
    ),
    ai: AI_ADOPTION[answers.aiAdoption],
    visibility:
      answers.websiteStatus === "none" ? Math.min(seo, VISIBILITY_CAP_WITHOUT_WEBSITE) : seo,
  };
}

export function calculateOverallScore(areas: Record<DiagnosisArea, number>): number {
  const weighted = (Object.keys(AREA_WEIGHTS) as DiagnosisArea[]).reduce(
    (total, area) => total + AREA_WEIGHTS[area] * areas[area],
    0,
  );
  return Math.round(weighted / 100);
}

export function getMaturityLevel(score: number): MaturityLevelId {
  if (score >= 65) return "advanced";
  if (score >= 35) return "developing";
  return "initial";
}

export function calculateNeeds(
  answers: DiagnosisAnswers,
  areas: Record<DiagnosisArea, number>,
): Record<NeedCategory, number> {
  const boost = GOAL_BOOSTS[answers.mainGoal];
  return {
    web: clamp(
      ((100 - areas.web) * 80) / 100 +
        (answers.sellsOnline === "planned" ? 20 : 0) +
        (boost.web ?? 0),
    ),
    automation: clamp(((100 - areas.automation) * 80) / 100 + (boost.automation ?? 0)),
    ai: clamp(
      AI_BASE_NEED[answers.aiAdoption] + CHATBOT_NEED[answers.chatbotInterest] + (boost.ai ?? 0),
    ),
    seo: clamp(
      ((100 - areas.visibility) * VISIBILITY_GOAL_FACTOR[answers.visibilityGoal]) / 100 +
        (boost.seo ?? 0),
    ),
  };
}

export function calculateDiagnosis(answers: DiagnosisAnswers): DiagnosisAssessment {
  const areas = calculateAreaScores(answers);
  const score = calculateOverallScore(areas);
  return {
    areas,
    score,
    level: getMaturityLevel(score),
    needs: calculateNeeds(answers, areas),
  };
}
