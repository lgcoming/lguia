import type { ApiErrorBody, ApiSuccessBody } from "@/lib/api/types";

export type ApiResult<T> =
  { ok: true; data: T } | { ok: false; status: number; error: ApiErrorBody["error"] | null };

/** POSTs JSON and normalizes the response. `status: 0` means the request never completed. */
export async function postJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, status: 0, error: null };
  }

  const json: unknown = await response.json().catch(() => null);
  if (response.ok) {
    return { ok: true, data: (json as ApiSuccessBody<T>).data };
  }
  const error = (json as ApiErrorBody | null)?.error ?? null;
  return { ok: false, status: response.status, error };
}
