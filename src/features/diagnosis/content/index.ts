import { diagnosisContentEn } from "@/features/diagnosis/content/en";
import { diagnosisContentEs } from "@/features/diagnosis/content/es";
import type { DiagnosisContent, DiagnosisUiContent } from "@/features/diagnosis/content/types";
import {
  buildDiagnosisSteps,
  DIAGNOSIS_QUESTION_COUNT,
  type DiagnosisStep,
} from "@/features/diagnosis/model/questions";
import type { Locale } from "@/i18n/config";

const CONTENT: Record<Locale, DiagnosisContent> = {
  es: diagnosisContentEs,
  en: diagnosisContentEn,
};

/** Server-side: the full diagnosis copy in one language. Do not import from Client Components. */
export function getDiagnosisContent(locale: Locale): DiagnosisContent {
  return CONTENT[locale];
}

export function getDiagnosisSteps(locale: Locale): DiagnosisStep[] {
  return buildDiagnosisSteps(CONTENT[locale]);
}

/** What the client wizard needs, built on the server and passed down as props. */
export function getDiagnosisUiContent(locale: Locale): DiagnosisUiContent {
  const content = CONTENT[locale];
  return {
    steps: buildDiagnosisSteps(content),
    questionCount: DIAGNOSIS_QUESTION_COUNT,
    requiredMessage: content.requiredMessage,
    ui: content.ui,
  };
}
