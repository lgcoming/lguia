"use client";

import { AnimatePresence, m, type Variants } from "motion/react";
import { useReducer, type ReactNode } from "react";

import { DiagnosisResultView } from "@/features/diagnosis/components/diagnosis-result";
import { QuestionStep } from "@/features/diagnosis/components/question-step";
import { WizardProgress } from "@/features/diagnosis/components/wizard-progress";
import {
  WizardCalculating,
  WizardError,
  WizardIntro,
} from "@/features/diagnosis/components/wizard-screens";
import { initialWizardState, wizardReducer } from "@/features/diagnosis/components/wizard-state";
import type { DiagnosisQuestionId } from "@/features/diagnosis/model/options";
import { DIAGNOSIS_QUESTION_COUNT, DIAGNOSIS_STEPS } from "@/features/diagnosis/model/questions";
import type { DiagnosisResult } from "@/features/diagnosis/model/types";
import { validateDiagnosisStep } from "@/features/diagnosis/model/validation";
import { postJson } from "@/lib/api/client";

/** Keeps the "calculating" state on screen long enough to be perceived as a step. */
const MIN_CALCULATING_MS = 900;

const EASE = [0.22, 1, 0.36, 1] as const;

const viewVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASE } },
  exit: (direction: number) => ({ opacity: 0, x: direction * -24, transition: { duration: 0.15 } }),
};

function errorMessageFor(status: number): string {
  if (status === 0) return "Parece que no hay conexión a internet.";
  if (status === 400) return "Alguna respuesta no es válida.";
  return "Ha habido un problema en nuestro servidor.";
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function DiagnosisWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const lastStepIndex = DIAGNOSIS_STEPS.length - 1;
  const step = DIAGNOSIS_STEPS[state.stepIndex];

  async function calculate() {
    dispatch({ type: "calculate" });
    const [response] = await Promise.all([
      postJson<DiagnosisResult>("/api/diagnosis", state.answers),
      wait(MIN_CALCULATING_MS),
    ]);
    if (response.ok) {
      dispatch({ type: "resolve", result: response.data });
    } else {
      dispatch({ type: "fail", message: errorMessageFor(response.status) });
    }
  }

  function handleNext(): DiagnosisQuestionId[] {
    const errors = validateDiagnosisStep(step.id, state.answers);
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
          questionCount={DIAGNOSIS_QUESTION_COUNT}
          onStart={() => dispatch({ type: "start" })}
        />
      );
      break;
    case "questions":
      view = (
        <QuestionStep
          step={step}
          stepNumber={state.stepIndex + 1}
          totalSteps={DIAGNOSIS_STEPS.length}
          answers={state.answers}
          errors={state.errors}
          onAnswer={(questionId, value) => dispatch({ type: "answer", questionId, value })}
          onPrevious={
            state.stepIndex > 0
              ? () => dispatch({ type: "goToStep", stepIndex: state.stepIndex - 1 })
              : undefined
          }
          onNext={handleNext}
        />
      );
      break;
    case "calculating":
      view = <WizardCalculating />;
      break;
    case "error":
      view = (
        <WizardError
          message={state.errorMessage ?? errorMessageFor(500)}
          onRetry={() => void calculate()}
          onReview={() => dispatch({ type: "review" })}
        />
      );
      break;
    case "result":
      view = state.result ? (
        <DiagnosisResultView
          result={state.result}
          onReview={() => dispatch({ type: "goToStep", stepIndex: 0 })}
        />
      ) : null;
      break;
  }

  const viewKey = state.phase === "questions" ? `step-${state.stepIndex}` : state.phase;

  return (
    <div className="rounded-panel border border-line bg-paper p-6 shadow-lift sm:p-10">
      {state.phase === "questions" ? (
        <WizardProgress steps={DIAGNOSIS_STEPS} currentIndex={state.stepIndex} />
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
