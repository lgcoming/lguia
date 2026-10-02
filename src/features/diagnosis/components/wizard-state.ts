import type { DiagnosisAnswers, DiagnosisQuestionId } from "@/features/diagnosis/model/options";
import type { DiagnosisResult } from "@/features/diagnosis/model/types";

/** UI state of the wizard only. Scoring and recommendations live in the model (SPEC-004). */

export type WizardPhase = "intro" | "questions" | "calculating" | "result" | "error";

export interface WizardState {
  phase: WizardPhase;
  stepIndex: number;
  /** 1 = forward, -1 = backward. Drives the slide direction of step transitions. */
  direction: 1 | -1;
  answers: Partial<DiagnosisAnswers>;
  errors: Partial<Record<DiagnosisQuestionId, string>>;
  result: DiagnosisResult | null;
  errorMessage: string | null;
}

export type WizardAction =
  | { type: "start" }
  | { type: "answer"; questionId: DiagnosisQuestionId; value: string }
  | { type: "showErrors"; errors: Partial<Record<DiagnosisQuestionId, string>> }
  | { type: "goToStep"; stepIndex: number }
  | { type: "calculate" }
  | { type: "resolve"; result: DiagnosisResult }
  | { type: "fail"; message: string }
  | { type: "review" };

export const initialWizardState: WizardState = {
  phase: "intro",
  stepIndex: 0,
  direction: 1,
  answers: {},
  errors: {},
  result: null,
  errorMessage: null,
};

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "start":
      return { ...state, phase: "questions", stepIndex: 0, direction: 1 };
    case "answer": {
      const { [action.questionId]: _cleared, ...errors } = state.errors;
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
        errors,
      };
    }
    case "showErrors":
      return { ...state, errors: action.errors };
    case "goToStep":
      return {
        ...state,
        phase: "questions",
        direction: action.stepIndex >= state.stepIndex ? 1 : -1,
        stepIndex: action.stepIndex,
        errors: {},
      };
    case "calculate":
      return { ...state, phase: "calculating", errorMessage: null };
    case "resolve":
      return { ...state, phase: "result", result: action.result };
    case "fail":
      return { ...state, phase: "error", errorMessage: action.message };
    case "review":
      return { ...state, phase: "questions", direction: -1, errors: {} };
  }
}
