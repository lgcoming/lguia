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

export const apiErrors = {
  invalidJson: () =>
    jsonError(400, "INVALID_JSON", "El cuerpo de la petición no es un JSON válido."),
  validation: (issues: ApiIssue[]) =>
    jsonError(400, "VALIDATION_ERROR", "Revisa los campos marcados.", issues),
  notFound: () => jsonError(404, "NOT_FOUND", "Recurso no encontrado."),
  internal: () =>
    jsonError(500, "INTERNAL_ERROR", "Ha ocurrido un error inesperado. Inténtalo de nuevo."),
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
