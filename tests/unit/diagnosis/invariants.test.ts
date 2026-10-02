import { describe, expect, it } from "vitest";

import { plans } from "@/data/plans";
import { serviceCategories } from "@/data/services";
import { diagnose, evaluateDiagnosis } from "@/features/diagnosis/model/diagnose";
import {
  DIAGNOSIS_OPTIONS,
  DIAGNOSIS_QUESTION_IDS,
  type DiagnosisAnswers,
} from "@/features/diagnosis/model/options";

/** Every combination of answers for the given questions, others fixed by `base`. */
function* combinations(
  base: Partial<DiagnosisAnswers>,
  index = 0,
  current: Partial<DiagnosisAnswers> = {},
): Generator<DiagnosisAnswers> {
  if (index === DIAGNOSIS_QUESTION_IDS.length) {
    yield current as DiagnosisAnswers;
    return;
  }
  const id = DIAGNOSIS_QUESTION_IDS[index];
  const values = id in base ? [base[id]] : DIAGNOSIS_OPTIONS[id];
  for (const value of values) {
    yield* combinations(base, index + 1, { ...current, [id]: value });
  }
}

describe("diagnosis invariants", () => {
  it("hold for every business with a modern website (262,440 combinations)", () => {
    let count = 0;
    for (const answers of combinations({ websiteStatus: "modern" })) {
      const { assessment, plan, services, nextSteps } = evaluateDiagnosis(answers);
      count++;

      if (
        plan.planId === "starter-local" ||
        assessment.score < 0 ||
        assessment.score > 100 ||
        plan.reasons.length < 2 ||
        plan.reasons.length > 3 ||
        services.length < 2 ||
        services.length > 4 ||
        new Set(services.map((s) => s.serviceId)).size !== services.length ||
        nextSteps.length !== 3
      ) {
        throw new Error(`Invariant broken for ${JSON.stringify(answers)}`);
      }
    }
    expect(count).toBe(262_440);
  });

  it("only recommends plans and services that exist in the catalog", () => {
    const catalog = { plans, categories: serviceCategories };
    const seenPlans = new Set<string>();
    const seenServices = new Set<string>();

    // Every website status × every company size × every goal × every AI/automation answer.
    for (const answers of combinations({
      sellsOnline: "no",
      webLeads: "occasional",
      chatbotInterest: "maybe",
      visibilityGoal: "interested",
    })) {
      const result = diagnose(answers, catalog);
      seenPlans.add(result.recommendedPlan.id);
      result.recommendedServices.forEach((service) => seenServices.add(service.id));
    }

    // Each of the six plans is reachable.
    expect([...seenPlans].sort()).toEqual(plans.map((plan) => plan.id).sort());
    expect(seenServices.size).toBeGreaterThan(5);
  });
});
