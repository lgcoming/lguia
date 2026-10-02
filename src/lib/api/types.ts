/** Shared API contract shapes (SPEC-006), used by route handlers and browser clients. */

export type ApiErrorCode = "INVALID_JSON" | "VALIDATION_ERROR" | "NOT_FOUND" | "INTERNAL_ERROR";

export interface ApiIssue {
  path: string;
  message: string;
}

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    issues?: ApiIssue[];
  };
}

export interface ApiSuccessBody<T> {
  data: T;
}
