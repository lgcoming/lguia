import type { Locale } from "@/i18n/config";
import { postJson } from "@/lib/api/client";
import { issuesToFieldErrors } from "@/lib/validation";

export interface LeadReceipt {
  id: string;
  receivedAt: string;
}

export type SubmitLeadOutcome =
  | { ok: true; receipt: LeadReceipt }
  | { ok: false; fieldErrors: Record<string, string> }
  | { ok: false; message: string };

/**
 * Sends a lead to POST /api/leads and translates failures into form-friendly outcomes.
 * `messages` are the network and server error texts in the form's language.
 */
export async function submitLeadRequest(
  payload: unknown,
  locale: Locale,
  messages: { network: string; server: string },
): Promise<SubmitLeadOutcome> {
  const result = await postJson<LeadReceipt>(`/api/leads?locale=${locale}`, payload);
  if (result.ok) return { ok: true, receipt: result.data };

  if (result.error?.code === "VALIDATION_ERROR" && result.error.issues) {
    return { ok: false, fieldErrors: issuesToFieldErrors(result.error.issues) };
  }
  return { ok: false, message: result.status === 0 ? messages.network : messages.server };
}
