import { diagnosisContentEs } from "@/features/diagnosis/content/es";
import type {
  DiagnosisEngineCopy,
  RecommendableServiceId,
  RuleReasonKey,
  SignalReasonKey,
} from "@/features/diagnosis/content/types";
import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import type {
  DiagnosisAssessment,
  NeedCategory,
  PlanRecommendation,
  ServiceRecommendation,
} from "@/features/diagnosis/model/types";
import { format } from "@/i18n/config";
import type { PlanId, ServiceCategoryId } from "@/types/catalog";

/*
 * Recommendation rules from SPEC-004. Order of the tables below is significant. Rules only name
 * the key of a reason; the wording comes from the `copy` of the requested language (SPEC-009).
 */

/** Spanish is the default language of the engine, as it is of the site. */
const DEFAULT_COPY: DiagnosisEngineCopy = diagnosisContentEs.engine;

export const STRONG_NEED = 60;
const LOW_NEED = 40;
const MIN_SERVICE_NEED = 30;
const MAX_SERVICES = 4;
const MIN_SERVICES = 2;

/** Fixed tie-break order: web > automation > ai > seo. */
const CATEGORY_ORDER: NeedCategory[] = ["web", "automation", "ai", "seo"];

export const NEED_TO_SERVICE_CATEGORY: Record<NeedCategory, ServiceCategoryId> = {
  web: "desarrollo-web",
  automation: "automatizaciones",
  ai: "chatbots-ia",
  seo: "seo-geo",
};

const GOAL_CATEGORY: Partial<Record<DiagnosisAnswers["mainGoal"], NeedCategory>> = {
  presence: "web",
  leads: "web",
  sales: "web",
  efficiency: "automation",
  ai: "ai",
};

const PLAN_COVERAGE: Record<PlanId, NeedCategory[]> = {
  "starter-local": ["web", "seo"],
  "web-pro": ["web", "seo"],
  "ia-starter": ["ai"],
  "automation-pack": ["automation"],
  "growth-web-ia": ["web", "automation", "ai", "seo"],
  "custom-enterprise": ["web", "automation", "ai", "seo"],
};

interface SignalRule {
  key: SignalReasonKey;
  category: NeedCategory;
  applies: (answers: DiagnosisAnswers) => boolean;
}

const SIGNAL_REASONS: SignalRule[] = [
  { key: "noWebsite", category: "web", applies: (a) => a.websiteStatus === "none" },
  { key: "outdatedWebsite", category: "web", applies: (a) => a.websiteStatus === "outdated" },
  {
    key: "noWebLeads",
    category: "web",
    applies: (a) => a.websiteStatus !== "none" && a.webLeads === "none",
  },
  { key: "plansToSell", category: "web", applies: (a) => a.sellsOnline === "planned" },
  {
    key: "highRepetitive",
    category: "automation",
    applies: (a) => a.repetitiveWorkload === "high",
  },
  { key: "noAutomation", category: "automation", applies: (a) => a.automationLevel === "none" },
  { key: "wantsChatbot", category: "ai", applies: (a) => a.chatbotInterest === "yes" },
  { key: "aiInterested", category: "ai", applies: (a) => a.aiAdoption === "interested" },
  { key: "aiExploring", category: "ai", applies: (a) => a.aiAdoption === "exploring" },
  { key: "aiUsing", category: "ai", applies: (a) => a.aiAdoption === "using" },
  {
    key: "noSeo",
    category: "seo",
    applies: (a) => a.seoStatus === "none" && a.visibilityGoal !== "not-now",
  },
];

/** Stable sort by need, highest first. Equal needs keep the original (spec) order. */
function byNeedDesc<T extends { category: NeedCategory }>(
  items: T[],
  needs: Record<NeedCategory, number>,
): T[] {
  return [...items].sort((a, b) => needs[b.category] - needs[a.category]);
}

export function getPrimaryCategory(
  answers: DiagnosisAnswers,
  needs: Record<NeedCategory, number>,
): NeedCategory {
  const goalCategory = GOAL_CATEGORY[answers.mainGoal];
  const tieRank = (category: NeedCategory) =>
    category === goalCategory ? -1 : CATEGORY_ORDER.indexOf(category);

  return [...CATEGORY_ORDER].sort((a, b) => needs[b] - needs[a] || tieRank(a) - tieRank(b))[0];
}

function isSmallBusiness(answers: DiagnosisAnswers): boolean {
  return answers.companySize === "solo" || answers.companySize === "micro";
}

function hasWeakWebsite(answers: DiagnosisAnswers): boolean {
  return answers.websiteStatus === "none" || answers.websiteStatus === "outdated";
}

function planForPrimaryCategory(
  primary: NeedCategory,
  answers: DiagnosisAnswers,
): { planId: PlanId; reason: RuleReasonKey } {
  switch (primary) {
    case "web":
      return isSmallBusiness(answers) &&
        hasWeakWebsite(answers) &&
        answers.sellsOnline === "no" &&
        answers.mainGoal !== "sales"
        ? { planId: "starter-local", reason: "webStarter" }
        : { planId: "web-pro", reason: "webPro" };
    case "seo":
      return isSmallBusiness(answers) && hasWeakWebsite(answers)
        ? { planId: "starter-local", reason: "seoStarter" }
        : { planId: "web-pro", reason: "seoPro" };
    case "automation":
      return { planId: "automation-pack", reason: "automation" };
    case "ai":
      return { planId: "ia-starter", reason: "ai" };
  }
}

export function recommendPlan(
  answers: DiagnosisAnswers,
  assessment: DiagnosisAssessment,
  copy: DiagnosisEngineCopy = DEFAULT_COPY,
): PlanRecommendation {
  const { needs } = assessment;
  const strongNeeds = CATEGORY_ORDER.filter((category) => needs[category] >= STRONG_NEED);

  let planId: PlanId;
  let ruleReason: string;

  if (answers.companySize === "large") {
    planId = "custom-enterprise";
    ruleReason = copy.ruleReasons.large;
  } else if (answers.companySize === "medium" && strongNeeds.length >= 3) {
    planId = "custom-enterprise";
    ruleReason = copy.ruleReasons.mediumComplex;
  } else if (
    strongNeeds.length >= 3 ||
    (answers.mainGoal === "growth" && strongNeeds.length >= 2)
  ) {
    planId = "growth-web-ia";
    ruleReason = copy.ruleReasons.growth;
  } else {
    const primary = getPrimaryCategory(answers, needs);
    const plan = planForPrimaryCategory(primary, answers);
    planId = plan.planId;
    ruleReason =
      needs[primary] < LOW_NEED
        ? format(copy.solidBaseReason, { area: copy.areaPhrases[primary] })
        : copy.ruleReasons[plan.reason];
  }

  const coverage = PLAN_COVERAGE[planId];
  const signalReasons = byNeedDesc(
    SIGNAL_REASONS.filter((rule) => coverage.includes(rule.category) && rule.applies(answers)),
    needs,
  )
    .slice(0, 2)
    .map((rule) => copy.signalReasons[rule.key]);

  const reasons = [ruleReason, ...signalReasons];
  if (reasons.length < 2) {
    reasons.push(copy.fallbackReasons[getPrimaryCategory(answers, needs)]);
  }
  return { planId, reasons };
}

interface ServiceRule {
  serviceId: RecommendableServiceId;
  category: NeedCategory;
  applies: (answers: DiagnosisAnswers) => boolean;
}

const SERVICE_RULES: ServiceRule[] = [
  {
    serviceId: "web-corporativa",
    category: "web",
    applies: (a) => a.websiteStatus === "none",
  },
  {
    serviceId: "rediseno-web",
    category: "web",
    applies: (a) => a.websiteStatus === "outdated",
  },
  {
    serviceId: "landing-pages",
    category: "web",
    applies: (a) =>
      (a.websiteStatus === "basic" || a.websiteStatus === "modern") && a.webLeads !== "regular",
  },
  {
    serviceId: "ecommerce",
    category: "web",
    applies: (a) =>
      a.sellsOnline === "planned" || (a.mainGoal === "sales" && a.sellsOnline !== "yes"),
  },
  {
    serviceId: "optimizacion-rendimiento",
    category: "web",
    applies: (a) => a.sellsOnline === "yes" && a.websiteStatus !== "modern",
  },
  {
    serviceId: "chatbots",
    category: "ai",
    applies: (a) => a.chatbotInterest === "yes" || a.chatbotInterest === "maybe",
  },
  {
    serviceId: "asistentes-internos",
    category: "ai",
    applies: (a) => a.aiAdoption !== "none" && a.companySize !== "solo",
  },
  {
    serviceId: "reduccion-tareas",
    category: "automation",
    applies: (a) => a.repetitiveWorkload === "high" || a.repetitiveWorkload === "medium",
  },
  {
    serviceId: "clasificacion-leads",
    category: "automation",
    applies: (a) =>
      (a.webLeads === "regular" || a.webLeads === "occasional") && a.automationLevel !== "advanced",
  },
  {
    serviceId: "integraciones-crm",
    category: "automation",
    applies: (a) =>
      a.automationLevel === "none" &&
      (a.companySize === "small" || a.companySize === "medium" || a.companySize === "large"),
  },
  {
    serviceId: "seo-tecnico",
    category: "seo",
    applies: (a) => a.seoStatus !== "active" && a.visibilityGoal !== "not-now",
  },
  {
    serviceId: "geo",
    category: "seo",
    applies: (a) => a.visibilityGoal === "priority" || a.visibilityGoal === "interested",
  },
];

const FLAGSHIP_SERVICES: Record<NeedCategory, RecommendableServiceId> = {
  web: "optimizacion-rendimiento",
  automation: "reduccion-tareas",
  ai: "chatbots",
  seo: "seo-tecnico",
};

export function getRecommendedServices(
  answers: DiagnosisAnswers,
  assessment: DiagnosisAssessment,
  copy: DiagnosisEngineCopy = DEFAULT_COPY,
): ServiceRecommendation[] {
  const { needs } = assessment;
  const candidates = SERVICE_RULES.filter(
    (rule) => rule.applies(answers) && needs[rule.category] >= MIN_SERVICE_NEED,
  );

  const selected = byNeedDesc(candidates, needs)
    .slice(0, MAX_SERVICES)
    .map((rule) => ({
      serviceId: rule.serviceId,
      category: rule.category,
      reason: copy.serviceReasons[rule.serviceId],
    }));

  // Very mature businesses may match few rules: fall back to the flagship of their top categories.
  for (const category of byNeedDesc(
    CATEGORY_ORDER.map((c) => ({ category: c })),
    needs,
  )) {
    if (selected.length >= MIN_SERVICES) break;
    const serviceId = FLAGSHIP_SERVICES[category.category];
    if (!selected.some((service) => service.serviceId === serviceId)) {
      selected.push({
        serviceId,
        category: category.category,
        reason: copy.flagshipReasons[category.category],
      });
    }
  }

  return selected.map(({ serviceId, category, reason }) => ({
    serviceId,
    categoryId: NEED_TO_SERVICE_CATEGORY[category],
    reason,
  }));
}

export function buildNextSteps(planId: PlanId, copy: DiagnosisEngineCopy = DEFAULT_COPY): string[] {
  const { first, preparation, last } = copy.nextSteps;
  return [first, preparation[planId], last];
}
