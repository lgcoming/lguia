"use client";

import { ChevronLeft } from "lucide-react";
import { useRef, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/form";
import type { DiagnosisAnswers, DiagnosisQuestionId } from "@/features/diagnosis/model/options";
import type { DiagnosisQuestion, DiagnosisStep } from "@/features/diagnosis/model/questions";
import { cn } from "@/lib/utils";
import { useFocusOnMount } from "@/lib/use-focus-on-mount";

interface QuestionStepProps {
  step: DiagnosisStep;
  stepNumber: number;
  totalSteps: number;
  answers: Partial<DiagnosisAnswers>;
  errors: Partial<Record<DiagnosisQuestionId, string>>;
  onAnswer: (questionId: DiagnosisQuestionId, value: string) => void;
  onPrevious?: () => void;
  /** Returns the ids of unanswered questions, or an empty list when the step is complete. */
  onNext: () => DiagnosisQuestionId[];
}

function QuestionFieldset({
  question,
  value,
  error,
  onAnswer,
}: {
  question: DiagnosisQuestion;
  value: string | undefined;
  error?: string;
  onAnswer: (questionId: DiagnosisQuestionId, value: string) => void;
}) {
  const errorId = `${question.id}-error`;

  // The error is linked to the group (aria-invalid is not valid on radios) and is read
  // when focus moves to the first option.
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-subheading font-semibold">{question.label}</legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-control border bg-pure-white px-4 py-3 text-body transition-[border-color,box-shadow] duration-200 ease-out",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-iris-blue",
                // Apple's selection affordance: a 2px blue outline (border + 1px ring, no layout shift).
                checked
                  ? "border-iris-blue ring-1 ring-iris-blue"
                  : error
                    ? "border-danger hover:border-obsidian"
                    : "border-silver hover:border-obsidian",
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={checked}
                onChange={() => onAnswer(question.id, option.value)}
                className="size-5 shrink-0 cursor-pointer accent-iris-blue focus-visible:outline-none"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </fieldset>
  );
}

export function QuestionStep({
  step,
  stepNumber,
  totalSteps,
  answers,
  errors,
  onAnswer,
  onPrevious,
  onNext,
}: QuestionStepProps) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const formRef = useRef<HTMLFormElement>(null);
  const isLast = stepNumber === totalSteps;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = onNext();
    if (missing.length > 0) {
      formRef.current?.querySelector<HTMLInputElement>(`input[name="${missing[0]}"]`)?.focus();
    }
  }

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit}>
      <h2 ref={headingRef} tabIndex={-1} className="text-heading-sm outline-none">
        <span className="sr-only">
          Paso {stepNumber} de {totalSteps}:
        </span>{" "}
        {step.title}
      </h2>
      <p className="mt-2 text-pewter">{step.description}</p>

      <div className="mt-8 space-y-10">
        {step.questions.map((question) => (
          <QuestionFieldset
            key={question.id}
            question={question}
            value={answers[question.id]}
            error={errors[question.id]}
            onAnswer={onAnswer}
          />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-pale-mist pt-6">
        {onPrevious ? (
          <Button variant="plain" onClick={onPrevious} className="-ml-4">
            <ChevronLeft aria-hidden="true" className="size-4" />
            Anterior
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg">
          {isLast ? "Ver mi diagnóstico" : "Siguiente"}
        </Button>
      </div>
    </form>
  );
}
