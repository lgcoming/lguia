import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/diagnosis/route";

import { jsonRequest, VALID_ANSWERS } from "./helpers";

async function postDiagnosis(body: unknown) {
  const response = await POST(jsonRequest("/api/diagnosis", body));
  return { status: response.status, json: await response.json() };
}

describe("POST /api/diagnosis", () => {
  it("returns a complete, explained recommendation for valid answers", async () => {
    const { status, json } = await postDiagnosis(VALID_ANSWERS);

    expect(status).toBe(200);
    const result = json.data;
    expect(result.score).toBe(46);
    expect(result.level).toMatchObject({ id: "developing", label: "En desarrollo" });
    expect(result.areas.map((area: { id: string }) => area.id)).toEqual([
      "web",
      "automation",
      "ai",
      "visibility",
    ]);
    expect(result.recommendedPlan).toMatchObject({
      id: "automation-pack",
      name: "Automation Pack",
      href: "/planes#automation-pack",
      pricing: { kind: "from", amount: 950, currency: "EUR" },
    });
    expect(result.reasons.length).toBeGreaterThanOrEqual(2);
    expect(result.recommendedServices).toHaveLength(4);
    expect(result.recommendedServices[0]).toMatchObject({
      id: "reduccion-tareas",
      category: { id: "automatizaciones", href: "/servicios/automatizaciones" },
    });
    expect(result.nextSteps).toHaveLength(3);
  });

  it("ignores fields the client should not control", async () => {
    const tampered = await postDiagnosis({ ...VALID_ANSWERS, score: 100, planId: "growth-web-ia" });
    const clean = await postDiagnosis(VALID_ANSWERS);
    expect(tampered.json).toEqual(clean.json);
  });

  it("rejects a body that is not JSON", async () => {
    const { status, json } = await postDiagnosis("{ not json");
    expect(status).toBe(400);
    expect(json.error.code).toBe("INVALID_JSON");
  });

  it("lists every missing answer", async () => {
    const { status, json } = await postDiagnosis({ websiteStatus: "modern" });

    expect(status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
    expect(json.error.issues).toHaveLength(10);
    expect(json.error.issues[0]).toEqual({
      path: "sellsOnline",
      message: "Selecciona una opción para continuar.",
    });
  });

  it("rejects answers outside the allowed options", async () => {
    const { status, json } = await postDiagnosis({ ...VALID_ANSWERS, companySize: "enorme" });
    expect(status).toBe(400);
    expect(json.error.issues.map((issue: { path: string }) => issue.path)).toEqual(["companySize"]);
  });
});
