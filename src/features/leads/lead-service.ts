import {
  getLeadRepository,
  summarizeDiagnosis,
  type LeadRepository,
} from "@/features/leads/lead-repository";
import type { LeadInput } from "@/features/leads/schema";
import type { Lead } from "@/features/leads/types";

export interface LeadReceipt {
  id: string;
  receivedAt: string;
}

export interface SubmitLeadDeps {
  repository?: LeadRepository;
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
    repository = getLeadRepository(),
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
    name: input.name,
    email: input.email,
    company: input.company,
    phone: input.phone,
    message: input.message,
  };

  const lead: Lead =
    input.source === "contact"
      ? { ...base, source: "contact", interest: input.interest }
      : { ...base, source: "diagnosis", diagnosis: summarizeDiagnosis(input.answers) };

  await repository.create(lead);
  return { stored: true, receipt };
}
