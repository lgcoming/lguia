import { planFaqs as planFaqsEn, plans as plansEn } from "@/data/en/plans";
import { processSteps as processStepsEn } from "@/data/en/process";
import { serviceCategories as serviceCategoriesEn } from "@/data/en/services";
import { planFaqs as planFaqsEs, plans as plansEs } from "@/data/es/plans";
import { processSteps as processStepsEs } from "@/data/es/process";
import { serviceCategories as serviceCategoriesEs } from "@/data/es/services";
import type { Locale } from "@/i18n/config";
import type { Faq, Plan, ProcessStep, ServiceCategory } from "@/types/catalog";

export interface CatalogContent {
  serviceCategories: ServiceCategory[];
  plans: Plan[];
  planFaqs: Faq[];
  processSteps: ProcessStep[];
}

/** Static content per language. The catalog repository is the only reader of services and plans. */
export const CATALOG: Record<Locale, CatalogContent> = {
  es: {
    serviceCategories: serviceCategoriesEs,
    plans: plansEs,
    planFaqs: planFaqsEs,
    processSteps: processStepsEs,
  },
  en: {
    serviceCategories: serviceCategoriesEn,
    plans: plansEn,
    planFaqs: planFaqsEn,
    processSteps: processStepsEn,
  },
};
