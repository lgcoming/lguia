import type { z } from "zod";

import type { ApiIssue } from "@/lib/api/types";

/** Flattens Zod issues into the API issue format (`path` joined with "."). */
export function toApiIssues(error: z.ZodError): ApiIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
  }));
}

/** First message per field, keyed by the top-level field name. */
export function issuesToFieldErrors(issues: ApiIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const field = issue.path.split(".")[0] || "form";
    errors[field] ??= issue.message;
  }
  return errors;
}
