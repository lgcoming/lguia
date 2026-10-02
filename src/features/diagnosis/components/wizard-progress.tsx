"use client";

import { m } from "motion/react";

import { RouteStop } from "@/components/ui/route";
import type { DiagnosisStep } from "@/features/diagnosis/model/questions";
import { cn } from "@/lib/utils";

/**
 * The questionnaire drawn as a route with one stop per step. Purely visual: the
 * step heading carries "Paso N de 5" for assistive technology.
 */
export function WizardProgress({
  steps,
  currentIndex,
}: {
  steps: DiagnosisStep[];
  currentIndex: number;
}) {
  const progress = currentIndex / (steps.length - 1);
  // Each stop sits in the centre of an equal column, so the line runs from the
  // centre of the first column to the centre of the last one.
  const inset = `${50 / steps.length}%`;

  return (
    <div aria-hidden="true" className="mb-10">
      <p className="text-sm font-semibold text-ink-soft">
        Paso {currentIndex + 1} de {steps.length}
      </p>
      <div className="relative mt-4">
        <div className="absolute top-[17px] h-0.5 bg-line" style={{ left: inset, right: inset }} />
        <m.div
          className="absolute top-[17px] h-0.5 origin-left bg-pine-700"
          style={{ left: inset, right: inset }}
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        <ol
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, index) => (
            <li key={step.id} className="flex flex-col items-center gap-2 text-center">
              <RouteStop
                state={
                  index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming"
                }
              >
                {index + 1}
              </RouteStop>
              <span
                className={cn(
                  "hidden px-1 text-xs leading-tight md:block",
                  index === currentIndex ? "font-semibold text-ink" : "text-ink-soft",
                )}
              >
                {step.title}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
