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

const NETWORK_ERROR =
  "No hemos podido conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.";
const SERVER_ERROR =
  "No hemos podido enviar tus datos por un problema de nuestro lado. Inténtalo de nuevo en unos minutos.";

/** Sends a lead to POST /api/leads and translates failures into form-friendly outcomes. */
export async function submitLeadRequest(payload: unknown): Promise<SubmitLeadOutcome> {
  const result = await postJson<LeadReceipt>("/api/leads", payload);
  if (result.ok) return { ok: true, receipt: result.data };

  if (result.error?.code === "VALIDATION_ERROR" && result.error.issues) {
    return { ok: false, fieldErrors: issuesToFieldErrors(result.error.issues) };
  }
  return { ok: false, message: result.status === 0 ? NETWORK_ERROR : SERVER_ERROR };
}
