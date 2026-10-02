import { plans } from "@/data/plans";
import { serviceCategories } from "@/data/services";
import type { Plan, PlanId, ServiceCategory } from "@/types/catalog";

/**
 * Read access to services and plans. Async on purpose: a CMS or database
 * implementation can replace the static one without changing callers.
 */
export interface CatalogRepository {
  listServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategory(id: string): Promise<ServiceCategory | undefined>;
  listPlans(): Promise<Plan[]>;
  getPlans(ids: readonly PlanId[]): Promise<Plan[]>;
}

const staticCatalogRepository: CatalogRepository = {
  async listServiceCategories() {
    return serviceCategories;
  },
  async getServiceCategory(id) {
    return serviceCategories.find((category) => category.id === id);
  },
  async listPlans() {
    return plans;
  },
  async getPlans(ids) {
    return plans.filter((plan) => ids.includes(plan.id));
  },
};

export function getCatalogRepository(): CatalogRepository {
  return staticCatalogRepository;
}
