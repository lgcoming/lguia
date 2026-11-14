import * as z from "zod/mini";

import type { ApiIssue } from "@/lib/api/types";
import { toApiIssues } from "@/lib/validation";
import {
  DIAGNOSIS_OPTIONS,
  type DiagnosisAnswers,
  type DiagnosisQuestionId,
} from "@/features/diagnosis/model/options";
import {
  DIAGNOSIS_STEP_STRUCTURE,
  type DiagnosisStepId,
} from "@/features/diagnosis/model/questions";

/*
 * Validation is independent of language: callers pass the message to show (SPEC-009), so this
 * module can run in the browser without pulling any translated content into the bundle.
 */

export function createDiagnosisAnswersSchema(requiredMessage: string) {
  const answer = <T extends readonly [string, ...string[]]>(values: T) =>
    z.enum(values, { error: requiredMessage });

  return z.object({
    websiteStatus: answer(DIAGNOSIS_OPTIONS.websiteStatus),
    sellsOnline: answer(DIAGNOSIS_OPTIONS.sellsOnline),
    webLeads: answer(DIAGNOSIS_OPTIONS.webLeads),
    automationLevel: answer(DIAGNOSIS_OPTIONS.automationLevel),
    repetitiveWorkload: answer(DIAGNOSIS_OPTIONS.repetitiveWorkload),
    aiAdoption: answer(DIAGNOSIS_OPTIONS.aiAdoption),
    chatbotInterest: answer(DIAGNOSIS_OPTIONS.chatbotInterest),
    seoStatus: answer(DIAGNOSIS_OPTIONS.seoStatus),
    visibilityGoal: answer(DIAGNOSIS_OPTIONS.visibilityGoal),
    companySize: answer(DIAGNOSIS_OPTIONS.companySize),
    mainGoal: answer(DIAGNOSIS_OPTIONS.mainGoal),
  }) satisfies z.ZodMiniType<DiagnosisAnswers>;
}

export type DiagnosisValidationResult =
  { success: true; data: DiagnosisAnswers } | { success: false; issues: ApiIssue[] };

/** Validates untrusted input (API body). Unknown keys are dropped. */
export function validateDiagnosis(
  input: unknown,
  requiredMessage: string,
): DiagnosisValidationResult {
  const result = createDiagnosisAnswersSchema(requiredMessage).safeParse(input);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, issues: toApiIssues(result.error) };
}

function isValidAnswer(id: DiagnosisQuestionId, value: unknown): boolean {
  return (DIAGNOSIS_OPTIONS[id] as readonly unknown[]).includes(value);
}

/** Per-step check used by the wizard before moving forward. Returns an error per unanswered question. */
export function validateDiagnosisStep(
  stepId: DiagnosisStepId,
  answers: Partial<DiagnosisAnswers>,
  requiredMessage: string,
): Partial<Record<DiagnosisQuestionId, string>> {
  const step = DIAGNOSIS_STEP_STRUCTURE.find((candidate) => candidate.id === stepId);
  const errors: Partial<Record<DiagnosisQuestionId, string>> = {};
  for (const id of step?.questions ?? []) {
    if (!isValidAnswer(id, answers[id])) errors[id] = requiredMessage;
  }
  return errors;
}
