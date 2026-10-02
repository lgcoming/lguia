/** Content model for services and plans (SPEC-003). Serializable: served as-is by the API. */

export const SERVICE_CATEGORY_IDS = [
  "desarrollo-web",
  "automatizaciones",
  "chatbots-ia",
  "seo-geo",
] as const;

export type ServiceCategoryId = (typeof SERVICE_CATEGORY_IDS)[number];

/** Icons are keys, not components, so the data stays JSON-serializable. */
export type CategoryIconKey = "web" | "automation" | "ai" | "search";

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export const PLAN_IDS = [
  "starter-local",
  "web-pro",
  "ia-starter",
  "automation-pack",
  "growth-web-ia",
  "custom-enterprise",
] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  icon: CategoryIconKey;
  headline: string;
  summary: string;
  description: string;
  outcomes: string[];
  services: ServiceItem[];
  faqs: Faq[];
  relatedPlanIds: PlanId[];
}

export type PlanPricing =
  { kind: "from"; amount: number; currency: "EUR" } | { kind: "custom"; label: string };

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  idealFor: string;
  pricing: PlanPricing;
  timeline: string;
  features: string[];
  categories: ServiceCategoryId[];
  featured: boolean;
  highlight?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}
