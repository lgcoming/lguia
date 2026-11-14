import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import type { MaturityLevelId } from "@/features/diagnosis/model/types";
import type { LeadInterest } from "@/features/leads/schema";
import type { Locale } from "@/i18n/config";
import type { PlanId } from "@/types/catalog";

export type LeadSource = "contact" | "diagnosis";

/** Only "new" exists until PATCH /api/leads/:id adds a workflow (SPEC-005). */
export type LeadStatus = "new";

export interface LeadDiagnosisSummary {
  answers: DiagnosisAnswers;
  score: number;
  level: MaturityLevelId;
  recommendedPlanId: PlanId;
  recommendedServiceIds: string[];
}

export interface Lead {
  id: string;
  createdAt: string;
  status: LeadStatus;
  source: LeadSource;
  /** Language of the page the lead was sent from: the language to reply in. */
  locale: Locale;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  interest?: LeadInterest;
  message?: string;
  diagnosis?: LeadDiagnosisSummary;
}
