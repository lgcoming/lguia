import {
  getLeadRepository,
  summarizeDiagnosis,
  type LeadRepository,
} from "@/features/leads/lead-repository";
import {
  noopLeadNotifier,
  type LeadAttachment,
  type LeadNotifier,
} from "@/features/leads/lead-notifier";
import type { LeadInput } from "@/features/leads/schema";
import type { Lead } from "@/features/leads/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export interface LeadReceipt {
  id: string;
  receivedAt: string;
}

export interface SubmitLeadDeps {
  /** Language of the form that sent the lead. */
  locale?: Locale;
  repository?: LeadRepository;
  /** Tells the team; a failure fails the submission so the visitor can use email instead. */
  notifier?: LeadNotifier;
  now?: () => Date;
  createId?: () => string;
}

export interface SubmitLeadResult {
  stored: boolean;
  receipt: LeadReceipt;
}

/**
 * Turns validated input into a stored lead (SPEC-005). Honeypot submissions get an
 * identical receipt but are not stored, so bots learn nothing from the response.
 */
export async function submitLead(
  input: LeadInput,
  {
    locale = DEFAULT_LOCALE,
    repository = getLeadRepository(),
    notifier = noopLeadNotifier,
    now = () => new Date(),
    createId = () => crypto.randomUUID(),
  }: SubmitLeadDeps = {},
): Promise<SubmitLeadResult> {
  const receipt: LeadReceipt = { id: createId(), receivedAt: now().toISOString() };
  if (input.website) return { stored: false, receipt };

  const base = {
    id: receipt.id,
    createdAt: receipt.receivedAt,
    status: "new" as const,
    locale,
    name: input.name,
    email: input.email,
    company: input.company,
    phone: input.phone,
    message: input.message,
  };

  const attachments: LeadAttachment[] = [];
  let lead: Lead;
  if (input.source === "contact") {
    lead = { ...base, source: "contact", interest: input.interest };
  } else if (input.source === "diagnosis") {
    lead = { ...base, source: "diagnosis", diagnosis: summarizeDiagnosis(input.answers) };
  } else {
    const { logo } = input;
    if (logo) attachments.push({ filename: logo.name, type: logo.type, data: logo.data });
    lead = {
      ...base,
      source: "prototype",
      prototype: {
        projectType: input.projectType,
        currentSite: input.currentSite,
        business: input.business,
        goal: input.goal,
        styles: input.styles,
        palette: input.palette,
        colors: input.palette === "custom" ? input.colors : [],
        tone: input.tone,
        sections: input.sections,
        references: input.references,
        logoName: logo?.name,
      },
    };
  }

  await repository.create(lead);
  await notifier.notify(lead, attachments);
  return { stored: true, receipt };
}
