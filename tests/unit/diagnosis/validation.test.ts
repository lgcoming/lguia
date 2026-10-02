import { describe, expect, it } from "vitest";

import { DIAGNOSIS_QUESTION_IDS } from "@/features/diagnosis/model/options";
import { DIAGNOSIS_QUESTION_COUNT, DIAGNOSIS_STEPS } from "@/features/diagnosis/model/questions";
import {
  DIAGNOSIS_REQUIRED_MESSAGE,
  validateDiagnosis,
  validateDiagnosisStep,
} from "@/features/diagnosis/model/validation";

import { makeAnswers } from "./fixtures";

describe("validateDiagnosis", () => {
  it("accepts a complete set of answers", () => {
    const answers = makeAnswers();
    expect(validateDiagnosis(answers)).toEqual({ success: true, data: answers });
  });

  it("drops unknown keys instead of trusting them", () => {
    const result = validateDiagnosis({ ...makeAnswers(), score: 100, isAdmin: true });
    expect(result.success && result.data).toEqual(makeAnswers());
  });

  it("reports one issue per missing answer", () => {
    const { websiteStatus, mainGoal, ...partial } = makeAnswers();
    const result = validateDiagnosis(partial);

    expect(result.success).toBe(false);
    expect(!result.success && result.issues).toEqual([
      { path: "websiteStatus", message: DIAGNOSIS_REQUIRED_MESSAGE },
      { path: "mainGoal", message: DIAGNOSIS_REQUIRED_MESSAGE },
    ]);
  });

  it("rejects values that are not one of the options", () => {
    const result = validateDiagnosis(makeAnswers({ companySize: "huge" as never }));
    expect(!result.success && result.issues.map((issue) => issue.path)).toEqual(["companySize"]);
  });

  it.each([null, undefined, "answers", 42, []])("rejects non-object input %j", (input) => {
    expect(validateDiagnosis(input).success).toBe(false);
  });
});

describe("validateDiagnosisStep", () => {
  it("returns no errors when every question of the step is answered", () => {
    expect(validateDiagnosisStep("web", makeAnswers())).toEqual({});
  });

  it("returns an error for each unanswered question of that step only", () => {
    expect(validateDiagnosisStep("web", { websiteStatus: "modern", companySize: "solo" })).toEqual({
      sellsOnline: DIAGNOSIS_REQUIRED_MESSAGE,
      webLeads: DIAGNOSIS_REQUIRED_MESSAGE,
    });
  });

  it("treats an invalid value as unanswered", () => {
    expect(
      validateDiagnosisStep("company", { companySize: "huge" as never, mainGoal: "growth" }),
    ).toEqual({ companySize: DIAGNOSIS_REQUIRED_MESSAGE });
  });
});

describe("question definitions", () => {
  it("ask every question exactly once across five steps", () => {
    const asked = DIAGNOSIS_STEPS.flatMap((step) => step.questions.map((q) => q.id));
    expect(DIAGNOSIS_STEPS).toHaveLength(5);
    expect(DIAGNOSIS_QUESTION_COUNT).toBe(11);
    expect([...asked].sort()).toEqual([...DIAGNOSIS_QUESTION_IDS].sort());
  });

  it("label every option", () => {
    for (const question of DIAGNOSIS_STEPS.flatMap((step) => step.questions)) {
      expect(question.options.length).toBeGreaterThanOrEqual(3);
      for (const option of question.options) expect(option.label.trim()).not.toBe("");
    }
  });
});
