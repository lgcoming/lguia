import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import type { MaturityLevelId } from "@/features/diagnosis/model/types";
import type {
  PrototypeGoal,
  PrototypePalette,
  PrototypeProjectType,
  PrototypeSection,
  PrototypeStyle,
  PrototypeTone,
} from "@/features/leads/prototype-options";
import type { LeadInterest } from "@/features/leads/schema";
import type { Locale } from "@/i18n/config";
import type { PlanId } from "@/types/catalog";

export type LeadSource = "contact" | "diagnosis" | "prototype";

/** Only "new" exists until PATCH /api/leads/:id adds a workflow (SPEC-005). */
export type LeadStatus = "new";

export interface LeadDiagnosisSummary {
  answers: DiagnosisAnswers;
  score: number;
  level: MaturityLevelId;
  recommendedPlanId: PlanId;
  recommendedServiceIds: string[];
}

/** What the visitor wants the free prototype to look like (SPEC-012). The logo file is emailed, not stored. */
export interface LeadPrototypeBrief {
  projectType: PrototypeProjectType;
  currentSite?: string;
  business: string;
  goal: PrototypeGoal;
  styles: PrototypeStyle[];
  palette: PrototypePalette;
  colors: string[];
  tone: PrototypeTone;
  sections: PrototypeSection[];
  references?: string;
  logoName?: string;
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
  prototype?: LeadPrototypeBrief;
}
