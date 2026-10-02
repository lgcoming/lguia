/** Builds the Request a Route Handler receives in production. */
export function jsonRequest(path: string, body: unknown, init: RequestInit = {}): Request {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
    ...init,
  });
}

export const VALID_ANSWERS = {
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
} as const;
