/**
 * Answer values for every diagnosis question (SPEC-004). Single source of truth for
 * the answer types, the validation schema and the question labels.
 */
export const DIAGNOSIS_OPTIONS = {
  websiteStatus: ["none", "outdated", "basic", "modern"],
  sellsOnline: ["yes", "planned", "no"],
  webLeads: ["regular", "occasional", "none"],
  automationLevel: ["none", "basic", "advanced"],
  repetitiveWorkload: ["high", "medium", "low"],
  aiAdoption: ["none", "interested", "exploring", "using"],
  chatbotInterest: ["yes", "maybe", "no"],
  seoStatus: ["none", "occasional", "active"],
  visibilityGoal: ["priority", "interested", "not-now"],
  companySize: ["solo", "micro", "small", "medium", "large"],
  mainGoal: ["presence", "leads", "sales", "efficiency", "ai", "growth"],
} as const;

export type DiagnosisQuestionId = keyof typeof DIAGNOSIS_OPTIONS;

export type DiagnosisAnswers = {
  -readonly [K in DiagnosisQuestionId]: (typeof DIAGNOSIS_OPTIONS)[K][number];
};

export const DIAGNOSIS_QUESTION_IDS = Object.keys(DIAGNOSIS_OPTIONS) as DiagnosisQuestionId[];
