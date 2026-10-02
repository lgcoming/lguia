import { afterEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "@/app/api/leads/route";
import type { Lead } from "@/features/leads/types";

import { jsonRequest, VALID_ANSWERS } from "./helpers";

const contactLead = {
  source: "contact",
  name: "Marta López",
  email: "marta@integracion-contacto.test",
  company: "Clínica Sonrisa",
  phone: "+34 612 345 678",
  interest: "chatbots-ia",
  message: "Queremos un asistente que responda las dudas de los pacientes.",
  consent: true,
};

const diagnosisLead = {
  source: "diagnosis",
  name: "Carmen Navarro",
  email: "carmen@integracion-diagnostico.test",
  consent: true,
  answers: VALID_ANSWERS,
};

async function postLead(body: unknown) {
  const response = await POST(jsonRequest("/api/leads", body));
  return { status: response.status, json: await response.json() };
}

async function listLeads(): Promise<Lead[]> {
  const response = await GET();
  expect(response.status).toBe(200);
  return (await response.json()).data;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/leads", () => {
  it("stores a valid contact lead and returns a receipt", async () => {
    const { status, json } = await postLead(contactLead);

    expect(status).toBe(201);
    expect(json.data.id).toEqual(expect.any(String));
    expect(new Date(json.data.receivedAt).toString()).not.toBe("Invalid Date");

    const stored = (await listLeads()).find((lead) => lead.id === json.data.id);
    expect(stored).toMatchObject({
      source: "contact",
      status: "new",
      name: "Marta López",
      email: "marta@integracion-contacto.test",
      interest: "chatbots-ia",
    });
  });

  it("stores diagnosis leads with the plan computed on the server", async () => {
    const { status, json } = await postLead({
      ...diagnosisLead,
      // A tampered client result must be ignored.
      diagnosis: { score: 100, recommendedPlanId: "custom-enterprise" },
    });

    expect(status).toBe(201);
    const stored = (await listLeads()).find((lead) => lead.id === json.data.id);
    expect(stored?.diagnosis).toMatchObject({
      score: 46,
      level: "developing",
      recommendedPlanId: "automation-pack",
      answers: VALID_ANSWERS,
    });
    expect(stored?.diagnosis?.recommendedServiceIds).toHaveLength(4);
  });

  it("rejects missing required fields with one issue per field", async () => {
    const { status, json } = await postLead({ source: "contact", interest: "general" });

    expect(status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
    expect(json.error.issues.map((issue: { path: string }) => issue.path).sort()).toEqual([
      "consent",
      "email",
      "message",
      "name",
    ]);
  });

  it("rejects an invalid email and a missing consent", async () => {
    const { status, json } = await postLead({ ...contactLead, email: "marta@", consent: false });
    expect(status).toBe(400);
    expect(json.error.issues).toEqual([
      { path: "email", message: "Introduce un email válido, por ejemplo nombre@empresa.com." },
      { path: "consent", message: "Necesitamos tu consentimiento para poder responderte." },
    ]);
  });

  it("requires the diagnosis answers for diagnosis leads", async () => {
    const { answers: _omitted, ...withoutAnswers } = diagnosisLead;
    const { status, json } = await postLead(withoutAnswers);
    expect(status).toBe(400);
    expect(json.error.issues[0].path).toBe("answers");
  });

  it("rejects unknown sources and non-JSON bodies", async () => {
    expect((await postLead({ ...contactLead, source: "newsletter" })).status).toBe(400);

    const invalidJson = await postLead("name=Marta");
    expect(invalidJson.status).toBe(400);
    expect(invalidJson.json.error.code).toBe("INVALID_JSON");
  });

  it("answers bots that fill the honeypot like anyone else, without storing them", async () => {
    const { status, json } = await postLead({
      ...contactLead,
      email: "bot@integracion-honeypot.test",
      website: "http://spam.example",
    });

    expect(status).toBe(201);
    expect(json.data.id).toEqual(expect.any(String));
    const emails = (await listLeads()).map((lead) => lead.email);
    expect(emails).not.toContain("bot@integracion-honeypot.test");
  });
});

describe("GET /api/leads", () => {
  it("lists leads newest first outside production", async () => {
    const leads = await listLeads();
    const dates = leads.map((lead) => lead.createdAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("is not available in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = await GET();
    expect(response.status).toBe(404);
    expect((await response.json()).error.code).toBe("NOT_FOUND");
  });

  it("can be enabled explicitly for a demo deployment", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ENABLE_DEMO_ADMIN", "true");
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
