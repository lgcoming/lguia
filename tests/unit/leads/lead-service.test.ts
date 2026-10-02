import { describe, expect, it } from "vitest";

import { createInMemoryLeadRepository } from "@/features/leads/lead-repository";
import { submitLead } from "@/features/leads/lead-service";
import { diagnosisLeadSchema, leadInputSchema } from "@/features/leads/schema";

import { INDUSTRIAL_SUPPLIER } from "../diagnosis/fixtures";

const NOW = new Date("2026-10-02T09:30:00.000Z");

function deps() {
  const repository = createInMemoryLeadRepository();
  return { repository, now: () => NOW, createId: () => "lead-1" };
}

const contact = leadInputSchema.parse({
  source: "contact",
  name: "Javier Ruiz",
  email: "javier@talleres.test",
  interest: "automatizaciones",
  message: "Queremos automatizar los presupuestos semanales.",
  consent: true,
});

describe("submitLead", () => {
  it("stores a contact lead with id, timestamp and status", async () => {
    const d = deps();
    const result = await submitLead(contact, d);

    expect(result).toEqual({
      stored: true,
      receipt: { id: "lead-1", receivedAt: "2026-10-02T09:30:00.000Z" },
    });
    expect(await d.repository.list()).toEqual([
      expect.objectContaining({
        id: "lead-1",
        createdAt: "2026-10-02T09:30:00.000Z",
        status: "new",
        source: "contact",
        interest: "automatizaciones",
        message: "Queremos automatizar los presupuestos semanales.",
      }),
    ]);
  });

  it("summarizes the diagnosis from the answers for diagnosis leads", async () => {
    const d = deps();
    const input = diagnosisLeadSchema.parse({
      source: "diagnosis",
      name: "Carmen Navarro",
      email: "carmen@suministros.test",
      consent: true,
      answers: INDUSTRIAL_SUPPLIER,
    });

    await submitLead(input, d);
    const [lead] = await d.repository.list();

    expect(lead.source).toBe("diagnosis");
    expect(lead.diagnosis).toEqual({
      answers: INDUSTRIAL_SUPPLIER,
      score: 46,
      level: "developing",
      recommendedPlanId: "automation-pack",
      recommendedServiceIds: [
        "reduccion-tareas",
        "clasificacion-leads",
        "chatbots",
        "asistentes-internos",
      ],
    });
  });

  it("returns a receipt but stores nothing when the honeypot is filled", async () => {
    const d = deps();
    const result = await submitLead({ ...contact, website: "spam" }, d);

    expect(result.stored).toBe(false);
    expect(result.receipt.id).toBe("lead-1");
    expect(await d.repository.list()).toEqual([]);
  });
});

describe("leadInputSchema", () => {
  it("accepts a diagnosis lead without a message", () => {
    const result = leadInputSchema.safeParse({
      source: "diagnosis",
      name: "Carmen",
      email: "carmen@suministros.test",
      message: "",
      consent: true,
      answers: INDUSTRIAL_SUPPLIER,
    });
    expect(result.success && result.data.message).toBeUndefined();
  });

  it("rejects incomplete diagnosis answers", () => {
    const { mainGoal: _omitted, ...incomplete } = INDUSTRIAL_SUPPLIER;
    const result = leadInputSchema.safeParse({
      source: "diagnosis",
      name: "Carmen",
      email: "carmen@suministros.test",
      consent: true,
      answers: incomplete,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["answers", "mainGoal"]);
  });
});
