"use client";

import { AnimatePresence, type Variants } from "motion/react";
import * as m from "motion/react-m";
import { useReducer, type ReactNode } from "react";

import { DiagnosisLeadForm } from "@/features/diagnosis/components/diagnosis-lead-form";
import { DiagnosisResultView } from "@/features/diagnosis/components/diagnosis-result";
import { QuestionStep } from "@/features/diagnosis/components/question-step";
import { WizardProgress } from "@/features/diagnosis/components/wizard-progress";
import {
  WizardCalculating,
  WizardError,
  WizardIntro,
} from "@/features/diagnosis/components/wizard-screens";
import { initialWizardState, wizardReducer } from "@/features/diagnosis/components/wizard-state";
import type { DiagnosisUiContent, DiagnosisUiStrings } from "@/features/diagnosis/content/types";
import type { DiagnosisAnswers, DiagnosisQuestionId } from "@/features/diagnosis/model/options";
import type { DiagnosisResult } from "@/features/diagnosis/model/types";
import { validateDiagnosisStep } from "@/features/diagnosis/model/validation";
import type { LeadFormContent } from "@/features/leads/content/types";
import type { Locale } from "@/i18n/config";
import { postJson } from "@/lib/api/client";

/** Keeps the "calculating" state on screen long enough to be perceived as a step. */
const MIN_CALCULATING_MS = 900;

const EASE = [0.22, 1, 0.36, 1] as const;

const viewVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASE } },
  exit: (direction: number) => ({ opacity: 0, x: direction * -24, transition: { duration: 0.15 } }),
};

function errorMessageFor(status: number, strings: DiagnosisUiStrings["error"]): string {
  if (status === 0) return strings.offline;
  if (status === 400) return strings.invalid;
  return strings.server;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface DiagnosisWizardProps {
  locale: Locale;
  /** Questionnaire and interface copy in the page's language, built on the server. */
  content: DiagnosisUiContent;
  /** Shared lead-form copy (labels, validation, notices). */
  leadContent: LeadFormContent;
}

export function DiagnosisWizard({ locale, content, leadContent }: DiagnosisWizardProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const { steps, ui } = content;
  const lastStepIndex = steps.length - 1;
  const step = steps[state.stepIndex];

  async function calculate() {
    dispatch({ type: "calculate" });
    const [response] = await Promise.all([
      postJson<DiagnosisResult>(`/api/diagnosis?locale=${locale}`, state.answers),
      wait(MIN_CALCULATING_MS),
    ]);
    if (response.ok) {
      dispatch({ type: "resolve", result: response.data });
    } else {
      dispatch({ type: "fail", message: errorMessageFor(response.status, ui.error) });
    }
  }

  function handleNext(): DiagnosisQuestionId[] {
    const errors = validateDiagnosisStep(step.id, state.answers, content.requiredMessage);
    const missing = Object.keys(errors) as DiagnosisQuestionId[];
    if (missing.length > 0) {
      dispatch({ type: "showErrors", errors });
      return missing;
    }
    if (state.stepIndex === lastStepIndex) {
      void calculate();
    } else {
      dispatch({ type: "goToStep", stepIndex: state.stepIndex + 1 });
    }
    return [];
  }

  let view: ReactNode;
  switch (state.phase) {
    case "intro":
      view = (
        <WizardIntro
          questionCount={content.questionCount}
          onStart={() => dispatch({ type: "start" })}
          strings={ui.intro}
        />
      );
      break;
    case "questions":
      view = (
        <QuestionStep
          step={step}
          stepNumber={state.stepIndex + 1}
          totalSteps={steps.length}
          answers={state.answers}
          errors={state.errors}
          onAnswer={(questionId, value) => dispatch({ type: "answer", questionId, value })}
          onPrevious={
            state.stepIndex > 0
              ? () => dispatch({ type: "goToStep", stepIndex: state.stepIndex - 1 })
              : undefined
          }
          onNext={handleNext}
          strings={ui}
        />
      );
      break;
    case "calculating":
      view = <WizardCalculating strings={ui.calculating} />;
      break;
    case "error":
      view = (
        <WizardError
          message={state.errorMessage ?? errorMessageFor(500, ui.error)}
          onRetry={() => void calculate()}
          onReview={() => dispatch({ type: "review" })}
          strings={ui.error}
        />
      );
      break;
    case "result":
      view = state.result ? (
        <DiagnosisResultView
          result={state.result}
          onReview={() => dispatch({ type: "goToStep", stepIndex: 0 })}
          strings={ui.result}
          locale={locale}
        >
          <DiagnosisLeadForm
            locale={locale}
            strings={ui.leadForm}
            leadContent={leadContent}
            // After the last step every answer is present and validated.
            answers={state.answers as DiagnosisAnswers}
            planName={state.result.recommendedPlan.name}
          />
        </DiagnosisResultView>
      ) : null;
      break;
  }

  const viewKey = state.phase === "questions" ? `step-${state.stepIndex}` : state.phase;

  return (
    <div className="rounded-tile bg-pure-white p-6 sm:p-10">
      {state.phase === "questions" ? (
        <WizardProgress steps={steps} currentIndex={state.stepIndex} label={ui.progress} />
      ) : null}
      <AnimatePresence mode="wait" initial={false} custom={state.direction}>
        <m.div
          key={viewKey}
          custom={state.direction}
          variants={viewVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {view}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
