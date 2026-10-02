import { evaluateDiagnosis } from "@/features/diagnosis/model/diagnose";
import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import type { Lead, LeadDiagnosisSummary } from "@/features/leads/types";
import { isAdminEnabled } from "@/lib/admin-access";

/** Persistence port for leads. Swap the implementation for a database without touching callers. */
export interface LeadRepository {
  create(lead: Lead): Promise<Lead>;
  /** Newest first. */
  list(): Promise<Lead[]>;
}

export function createInMemoryLeadRepository(seed: Lead[] = []): LeadRepository {
  const leads = new Map(seed.map((lead) => [lead.id, lead]));
  return {
    async create(lead) {
      leads.set(lead.id, lead);
      return lead;
    },
    async list() {
      return [...leads.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
  };
}

export function summarizeDiagnosis(answers: DiagnosisAnswers): LeadDiagnosisSummary {
  const { assessment, plan, services } = evaluateDiagnosis(answers);
  return {
    answers,
    score: assessment.score,
    level: assessment.level,
    recommendedPlanId: plan.planId,
    recommendedServiceIds: services.map((service) => service.serviceId),
  };
}

const daysAgo = (days: number, hour: number) => {
  const date = new Date(Date.now() - days * 86_400_000);
  date.setUTCHours(hour, 15, 0, 0);
  return date.toISOString();
};

/** Clearly fictional sample leads (reserved .example domains) so the demo admin view is not empty. */
function demoLeads(): Lead[] {
  return [
    {
      id: "demo-1",
      createdAt: daysAgo(1, 9),
      status: "new",
      source: "diagnosis",
      name: "Laura Martín",
      email: "laura@clinica-demo.example",
      company: "Clínica dental (demo)",
      diagnosis: summarizeDiagnosis({
        websiteStatus: "basic",
        sellsOnline: "no",
        webLeads: "occasional",
        automationLevel: "basic",
        repetitiveWorkload: "high",
        aiAdoption: "interested",
        chatbotInterest: "yes",
        seoStatus: "occasional",
        visibilityGoal: "interested",
        companySize: "micro",
        mainGoal: "leads",
      }),
    },
    {
      id: "demo-2",
      createdAt: daysAgo(2, 11),
      status: "new",
      source: "contact",
      name: "Javier Ruiz",
      email: "javier@talleres-demo.example",
      company: "Talleres (demo)",
      phone: "+34 600 000 000",
      interest: "automatizaciones",
      message: "Queremos automatizar los presupuestos que enviamos por email cada semana.",
    },
    {
      id: "demo-3",
      createdAt: daysAgo(4, 16),
      status: "new",
      source: "diagnosis",
      name: "Ana Torres",
      email: "ana@panaderia-demo.example",
      company: "Panadería (demo)",
      message: "Nos gustaría tener web antes de Navidad.",
      diagnosis: summarizeDiagnosis({
        websiteStatus: "none",
        sellsOnline: "no",
        webLeads: "none",
        automationLevel: "none",
        repetitiveWorkload: "low",
        aiAdoption: "none",
        chatbotInterest: "no",
        seoStatus: "none",
        visibilityGoal: "interested",
        companySize: "solo",
        mainGoal: "presence",
      }),
    },
  ];
}

/*
 * The process-wide store lives on globalThis so it survives dev hot reloads and is shared by
 * route handlers and Server Components. It is a mock database, not request state; on
 * serverless platforms it is per instance and resets on cold starts (see MEMORY.md).
 */
const globalForLeads = globalThis as typeof globalThis & { __lguiaLeadRepository?: LeadRepository };

export function getLeadRepository(): LeadRepository {
  globalForLeads.__lguiaLeadRepository ??= createInMemoryLeadRepository(
    isAdminEnabled() ? demoLeads() : [],
  );
  return globalForLeads.__lguiaLeadRepository;
}
