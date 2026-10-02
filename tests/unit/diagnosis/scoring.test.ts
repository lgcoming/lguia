import { describe, expect, it } from "vitest";

import {
  calculateAreaScores,
  calculateDiagnosis,
  getMaturityLevel,
} from "@/features/diagnosis/model/scoring";

import {
  HIGHEST_ANSWERS,
  INDUSTRIAL_SUPPLIER,
  LOCAL_BAKERY,
  LOWEST_ANSWERS,
  makeAnswers,
  MATURE_COMPANY,
} from "./fixtures";

describe("calculateDiagnosis — score", () => {
  it("scores 0 for the least mature answers", () => {
    const result = calculateDiagnosis(LOWEST_ANSWERS);
    expect(result.areas).toEqual({ web: 0, automation: 0, ai: 0, visibility: 0 });
    expect(result.score).toBe(0);
    expect(result.level).toBe("initial");
  });

  it("scores 100 for the most mature answers", () => {
    const result = calculateDiagnosis(HIGHEST_ANSWERS);
    expect(result.areas).toEqual({ web: 100, automation: 100, ai: 100, visibility: 100 });
    expect(result.score).toBe(100);
    expect(result.level).toBe("advanced");
  });

  it("weights areas 35/25/20/20 (web, automation, visibility, ai)", () => {
    // web 57, automation 30, ai 50, visibility 45 → 19.95 + 7.5 + 9 + 10 = 46.45
    const result = calculateDiagnosis(INDUSTRIAL_SUPPLIER);
    expect(result.areas).toEqual({ web: 57, automation: 30, ai: 50, visibility: 45 });
    expect(result.score).toBe(46);
    expect(result.level).toBe("developing");
  });

  it("caps visibility at 20 when there is no website", () => {
    const answers = makeAnswers({ websiteStatus: "none", seoStatus: "active" });
    expect(calculateAreaScores(answers).visibility).toBe(20);
  });

  it("does not cap visibility when a website exists", () => {
    const answers = makeAnswers({ websiteStatus: "outdated", seoStatus: "active" });
    expect(calculateAreaScores(answers).visibility).toBe(100);
  });
});

describe("getMaturityLevel", () => {
  it.each([
    [0, "initial"],
    [34, "initial"],
    [35, "developing"],
    [64, "developing"],
    [65, "advanced"],
    [100, "advanced"],
  ] as const)("maps %i to %s", (score, level) => {
    expect(getMaturityLevel(score)).toBe(level);
  });
});

describe("calculateDiagnosis — needs", () => {
  it("translates gaps, goals and interests into opportunities", () => {
    expect(calculateDiagnosis(LOCAL_BAKERY).needs).toEqual({
      web: 100, // no website (+80) and goal "presence" (+20)
      automation: 48, // automation maturity 40 → 60 × 0.8
      ai: 5, // not a priority, no chatbot interest
      seo: 70, // visibility 0 × factor 0.7
    });
  });

  it("adds goal boosts and clamps to 100", () => {
    const needs = calculateDiagnosis(
      makeAnswers({ aiAdoption: "interested", chatbotInterest: "yes", mainGoal: "ai" }),
    ).needs;
    expect(needs.ai).toBe(100); // 55 + 30 + 20 = 105 → 100
  });

  it("keeps needs low for a mature company", () => {
    expect(calculateDiagnosis(MATURE_COMPANY).needs).toEqual({
      web: 10,
      automation: 0,
      ai: 5,
      seo: 15,
    });
  });
});
