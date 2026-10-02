import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";

/** A mid-range business; scenarios override only what matters to them. */
export function makeAnswers(overrides: Partial<DiagnosisAnswers> = {}): DiagnosisAnswers {
  return {
    websiteStatus: "basic",
    sellsOnline: "no",
    webLeads: "occasional",
    automationLevel: "basic",
    repetitiveWorkload: "medium",
    aiAdoption: "exploring",
    chatbotInterest: "maybe",
    seoStatus: "occasional",
    visibilityGoal: "interested",
    companySize: "small",
    mainGoal: "leads",
    ...overrides,
  };
}

export const LOWEST_ANSWERS = makeAnswers({
  websiteStatus: "none",
  webLeads: "none",
  automationLevel: "none",
  repetitiveWorkload: "high",
  aiAdoption: "none",
  seoStatus: "none",
});

export const HIGHEST_ANSWERS = makeAnswers({
  websiteStatus: "modern",
  webLeads: "regular",
  automationLevel: "advanced",
  repetitiveWorkload: "low",
  aiAdoption: "using",
  seoStatus: "active",
});

/** Self-employed baker without a website who wants a professional image. */
export const LOCAL_BAKERY = makeAnswers({
  websiteStatus: "none",
  sellsOnline: "no",
  webLeads: "none",
  automationLevel: "none",
  repetitiveWorkload: "low",
  aiAdoption: "none",
  chatbotInterest: "no",
  seoStatus: "none",
  visibilityGoal: "interested",
  companySize: "solo",
  mainGoal: "presence",
});

/** Industrial supplier (50–249 people) drowning in manual work. */
export const INDUSTRIAL_SUPPLIER = makeAnswers({
  websiteStatus: "basic",
  sellsOnline: "no",
  webLeads: "occasional",
  automationLevel: "basic",
  repetitiveWorkload: "high",
  aiAdoption: "exploring",
  chatbotInterest: "maybe",
  seoStatus: "occasional",
  visibilityGoal: "interested",
  companySize: "medium",
  mainGoal: "efficiency",
});

/** Small shop with an outdated website that wants to start selling online. */
export const SHOP_GOING_ONLINE = makeAnswers({
  websiteStatus: "outdated",
  sellsOnline: "planned",
  webLeads: "occasional",
  automationLevel: "none",
  repetitiveWorkload: "medium",
  aiAdoption: "interested",
  chatbotInterest: "yes",
  seoStatus: "none",
  visibilityGoal: "priority",
  companySize: "micro",
  mainGoal: "sales",
});

/** Digitally mature company with very little left to fix. */
export const MATURE_COMPANY = makeAnswers({
  websiteStatus: "modern",
  sellsOnline: "yes",
  webLeads: "regular",
  automationLevel: "advanced",
  repetitiveWorkload: "low",
  aiAdoption: "none",
  chatbotInterest: "no",
  seoStatus: "active",
  visibilityGoal: "not-now",
  companySize: "small",
  mainGoal: "leads",
});

/** Services company that wants to start with AI and has a decent website. */
export const AI_CURIOUS_FIRM = makeAnswers({
  websiteStatus: "basic",
  sellsOnline: "no",
  webLeads: "occasional",
  automationLevel: "basic",
  repetitiveWorkload: "medium",
  aiAdoption: "interested",
  chatbotInterest: "yes",
  seoStatus: "occasional",
  visibilityGoal: "not-now",
  companySize: "small",
  mainGoal: "ai",
});
