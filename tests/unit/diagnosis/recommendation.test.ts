import { describe, expect, it } from "vitest";

import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import {
  buildNextSteps,
  getPrimaryCategory,
  getRecommendedServices,
  recommendPlan,
} from "@/features/diagnosis/model/recommendation";
import { calculateDiagnosis } from "@/features/diagnosis/model/scoring";

import {
  AI_CURIOUS_FIRM,
  INDUSTRIAL_SUPPLIER,
  LOCAL_BAKERY,
  makeAnswers,
  MATURE_COMPANY,
  SHOP_GOING_ONLINE,
} from "./fixtures";

function planFor(answers: DiagnosisAnswers) {
  return recommendPlan(answers, calculateDiagnosis(answers));
}

function servicesFor(answers: DiagnosisAnswers) {
  return getRecommendedServices(answers, calculateDiagnosis(answers)).map((s) => s.serviceId);
}

describe("recommendPlan", () => {
  it("recommends Starter Local to a self-employed business without a website", () => {
    const plan = planFor(LOCAL_BAKERY);
    expect(plan.planId).toBe("starter-local");
    expect(plan.reasons).toEqual([
      "Para un negocio de tu tamaño, una web profesional con SEO local es la base con mejor retorno.",
      "Todavía no tienes web, y es lo primero que consultan tus clientes antes de contactar.",
      "No trabajas el SEO y quieres ganar visibilidad en buscadores y asistentes de IA.",
    ]);
  });

  it("recommends Automation Pack when automation is the biggest opportunity", () => {
    const plan = planFor(INDUSTRIAL_SUPPLIER);
    expect(plan.planId).toBe("automation-pack");
    expect(plan.reasons).toEqual([
      "Tu mayor oportunidad está en automatizar procesos: es donde más tiempo puedes recuperar.",
      "Tu equipo dedica muchas horas a tareas repetitivas que se pueden automatizar.",
    ]);
  });

  it("recommends IA Starter when AI is the biggest opportunity", () => {
    expect(planFor(AI_CURIOUS_FIRM).planId).toBe("ia-starter");
  });

  it("recommends Growth Web + IA when three or more areas have strong needs", () => {
    const plan = planFor(SHOP_GOING_ONLINE);
    expect(plan.planId).toBe("growth-web-ia");
    expect(plan.reasons[0]).toMatch(/plan conjunto/);
    expect(plan.reasons).toHaveLength(3);
  });

  it("recommends Growth Web + IA with only two strong needs when the goal is growth", () => {
    // needs: web 77, automation 50, ai 85, seo 49
    const answers = makeAnswers({
      websiteStatus: "outdated",
      webLeads: "none",
      aiAdoption: "exploring",
      mainGoal: "growth",
    });
    const needs = calculateDiagnosis(answers).needs;
    expect([needs.web, needs.automation, needs.ai, needs.seo].filter((n) => n >= 60)).toHaveLength(
      2,
    );
    expect(planFor(answers).planId).toBe("growth-web-ia");
    expect(planFor({ ...answers, mainGoal: "leads" }).planId).not.toBe("growth-web-ia");
  });

  it("always recommends Custom Enterprise to companies with 250+ people", () => {
    expect(planFor({ ...LOCAL_BAKERY, companySize: "large" }).planId).toBe("custom-enterprise");
    expect(planFor({ ...MATURE_COMPANY, companySize: "large" }).planId).toBe("custom-enterprise");
  });

  it("recommends Custom Enterprise to medium companies with three strong needs", () => {
    const answers = { ...SHOP_GOING_ONLINE, companySize: "medium" as const };
    expect(planFor(answers).planId).toBe("custom-enterprise");
    expect(planFor(answers).reasons[0]).toMatch(/equipo grande/);
  });

  it("recommends Web Pro instead of Starter Local when the business plans to sell online", () => {
    const answers = {
      ...LOCAL_BAKERY,
      sellsOnline: "planned" as const,
      visibilityGoal: "not-now" as const,
    };
    expect(planFor(answers).planId).toBe("web-pro");
  });

  it("explains a solid base and still gives two reasons to mature companies", () => {
    const plan = planFor(MATURE_COMPANY);
    expect(plan.planId).toBe("web-pro");
    expect(plan.reasons).toEqual([
      "Tu base digital es sólida: el mayor margen de mejora está en la visibilidad en buscadores.",
      "Cuidar la base técnica y los contenidos mantiene tu visibilidad frente a la competencia.",
    ]);
  });
});

describe("getPrimaryCategory", () => {
  const tied = { web: 50, automation: 50, ai: 10, seo: 10 };

  it("picks the highest need", () => {
    expect(getPrimaryCategory(makeAnswers(), { web: 20, automation: 30, ai: 80, seo: 79 })).toBe(
      "ai",
    );
  });

  it("breaks ties with the category linked to the main goal", () => {
    expect(getPrimaryCategory(makeAnswers({ mainGoal: "efficiency" }), tied)).toBe("automation");
  });

  it("falls back to the fixed order web > automation > ai > seo", () => {
    expect(getPrimaryCategory(makeAnswers({ mainGoal: "growth" }), tied)).toBe("web");
    expect(
      getPrimaryCategory(makeAnswers({ mainGoal: "growth" }), {
        web: 0,
        automation: 0,
        ai: 40,
        seo: 40,
      }),
    ).toBe("ai");
  });
});

describe("getRecommendedServices", () => {
  it("orders services by the need of their category", () => {
    expect(servicesFor(LOCAL_BAKERY)).toEqual(["web-corporativa", "seo-tecnico", "geo"]);
  });

  it("returns at most four services, highest needs first", () => {
    expect(servicesFor(INDUSTRIAL_SUPPLIER)).toEqual([
      "reduccion-tareas",
      "clasificacion-leads",
      "chatbots",
      "asistentes-internos",
    ]);
  });

  it("ignores candidates whose category need is below 30", () => {
    // Rule 3 (landing pages) matches, but a modern website leaves a web need of only 24.
    const answers = { ...MATURE_COMPANY, webLeads: "occasional" as const };
    expect(calculateDiagnosis(answers).needs.web).toBe(24);
    expect(servicesFor(answers)).not.toContain("landing-pages");
  });

  it("falls back to flagship services so there are always at least two", () => {
    expect(servicesFor(MATURE_COMPANY)).toEqual(["seo-tecnico", "optimizacion-rendimiento"]);
  });

  it("explains every recommendation and maps it to its catalog category", () => {
    const services = getRecommendedServices(
      SHOP_GOING_ONLINE,
      calculateDiagnosis(SHOP_GOING_ONLINE),
    );
    expect(services.length).toBeGreaterThanOrEqual(2);
    for (const service of services) {
      expect(service.reason.length).toBeGreaterThan(20);
      expect(["desarrollo-web", "automatizaciones", "chatbots-ia", "seo-geo"]).toContain(
        service.categoryId,
      );
    }
  });
});

describe("buildNextSteps", () => {
  it("returns three steps with plan-specific preparation", () => {
    const steps = buildNextSteps("automation-pack");
    expect(steps).toHaveLength(3);
    expect(steps[1]).toMatch(/tres tareas repetitivas/);
    expect(buildNextSteps("ia-starter")[1]).toMatch(/preguntas que más se repiten/);
  });
});
