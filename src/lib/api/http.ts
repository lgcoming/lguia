import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import type { ApiErrorBody, ApiErrorCode, ApiIssue, ApiSuccessBody } from "@/lib/api/types";

/* Server-side helpers that keep every Route Handler response in the SPEC-006 shape. */

export function jsonData<T>(data: T, init?: ResponseInit): Response {
  return Response.json({ data } satisfies ApiSuccessBody<T>, init);
}

function jsonError(
  status: number,
  code: ApiErrorCode,
  message: string,
  issues?: ApiIssue[],
): Response {
  const body: ApiErrorBody = { error: { code, message, ...(issues ? { issues } : {}) } };
  return Response.json(body, { status });
}

const MESSAGES: Record<Locale, Record<ApiErrorCode, string>> = {
  es: {
    INVALID_JSON: "El cuerpo de la petición no es un JSON válido.",
    VALIDATION_ERROR: "Revisa los campos marcados.",
    NOT_FOUND: "Recurso no encontrado.",
    INTERNAL_ERROR: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
  },
  en: {
    INVALID_JSON: "The request body is not valid JSON.",
    VALIDATION_ERROR: "Check the highlighted fields.",
    NOT_FOUND: "Resource not found.",
    INTERNAL_ERROR: "An unexpected error occurred. Try again.",
  },
};

export const apiErrors = {
  invalidJson: (locale: Locale = DEFAULT_LOCALE) =>
    jsonError(400, "INVALID_JSON", MESSAGES[locale].INVALID_JSON),
  validation: (issues: ApiIssue[], locale: Locale = DEFAULT_LOCALE) =>
    jsonError(400, "VALIDATION_ERROR", MESSAGES[locale].VALIDATION_ERROR, issues),
  notFound: (locale: Locale = DEFAULT_LOCALE) =>
    jsonError(404, "NOT_FOUND", MESSAGES[locale].NOT_FOUND),
  internal: (locale: Locale = DEFAULT_LOCALE) =>
    jsonError(500, "INTERNAL_ERROR", MESSAGES[locale].INTERNAL_ERROR),
};

export async function readJsonBody(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false }> {
  try {
    return { ok: true, value: await request.json() };
  } catch {
    return { ok: false };
  }
}
