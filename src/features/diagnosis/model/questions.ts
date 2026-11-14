import {
  DIAGNOSIS_OPTIONS,
  type DiagnosisAnswers,
  type DiagnosisQuestionId,
} from "@/features/diagnosis/model/options";

export interface DiagnosisOption<V extends string = string> {
  value: V;
  label: string;
}

export interface DiagnosisQuestion<K extends DiagnosisQuestionId = DiagnosisQuestionId> {
  id: K;
  label: string;
  options: DiagnosisOption<DiagnosisAnswers[K]>[];
}

export type DiagnosisStepId = "web" | "processes" | "ai" | "visibility" | "company";

export interface DiagnosisStep {
  id: DiagnosisStepId;
  title: string;
  description: string;
  questions: DiagnosisQuestion[];
}

/** Which questions each step asks, in order. Wording lives in content/<locale>.ts (SPEC-009). */
export const DIAGNOSIS_STEP_STRUCTURE: { id: DiagnosisStepId; questions: DiagnosisQuestionId[] }[] =
  [
    { id: "web", questions: ["websiteStatus", "sellsOnline", "webLeads"] },
    { id: "processes", questions: ["automationLevel", "repetitiveWorkload"] },
    { id: "ai", questions: ["aiAdoption", "chatbotInterest"] },
    { id: "visibility", questions: ["seoStatus", "visibilityGoal"] },
    { id: "company", questions: ["companySize", "mainGoal"] },
  ];

export const DIAGNOSIS_QUESTION_COUNT = DIAGNOSIS_STEP_STRUCTURE.reduce(
  (total, step) => total + step.questions.length,
  0,
);

interface StepCopy {
  steps: Record<DiagnosisStepId, { title: string; description: string }>;
  /** Full records, so adding an option value without a label fails to compile. */
  questions: {
    [K in DiagnosisQuestionId]: { label: string; options: Record<DiagnosisAnswers[K], string> };
  };
}

function buildQuestion<K extends DiagnosisQuestionId>(id: K, copy: StepCopy): DiagnosisQuestion<K> {
  const values = DIAGNOSIS_OPTIONS[id] as readonly string[] as readonly DiagnosisAnswers[K][];
  const { label, options } = copy.questions[id];
  return { id, label, options: values.map((value) => ({ value, label: options[value] })) };
}

/** The questionnaire in one language: structure from this file, wording from the content. */
export function buildDiagnosisSteps(copy: StepCopy): DiagnosisStep[] {
  return DIAGNOSIS_STEP_STRUCTURE.map((step) => ({
    id: step.id,
    ...copy.steps[step.id],
    questions: step.questions.map((id) => buildQuestion(id, copy)),
  }));
}
