import { CATALOG } from "@/data/catalog";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import type { Faq, Plan, PlanId, ProcessStep, ServiceCategory } from "@/types/catalog";

/**
 * Read access to services and plans in one language. Async on purpose: a CMS or database
 * implementation can replace the static one without changing callers.
 */
export interface CatalogRepository {
  listServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategory(id: string): Promise<ServiceCategory | undefined>;
  listPlans(): Promise<Plan[]>;
  getPlans(ids: readonly PlanId[]): Promise<Plan[]>;
  listPlanFaqs(): Promise<Faq[]>;
  listProcessSteps(): Promise<ProcessStep[]>;
}

function createStaticCatalogRepository(locale: Locale): CatalogRepository {
  const content = CATALOG[locale];
  return {
    async listServiceCategories() {
      return content.serviceCategories;
    },
    async getServiceCategory(id) {
      return content.serviceCategories.find((category) => category.id === id);
    },
    async listPlans() {
      return content.plans;
    },
    async getPlans(ids) {
      return content.plans.filter((plan) => ids.includes(plan.id));
    },
    async listPlanFaqs() {
      return content.planFaqs;
    },
    async listProcessSteps() {
      return content.processSteps;
    },
  };
}

const repositories: Record<Locale, CatalogRepository> = {
  es: createStaticCatalogRepository("es"),
  en: createStaticCatalogRepository("en"),
};

export function getCatalogRepository(locale: Locale = DEFAULT_LOCALE): CatalogRepository {
  return repositories[locale];
}
