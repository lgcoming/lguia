"use client";

import * as m from "motion/react-m";

import type { DiagnosisStep } from "@/features/diagnosis/model/questions";
import { format } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Five-segment progress bar, one segment per step (SPEC-004). Purely visual: the step heading
 * carries "Paso N de 5" for assistive technology.
 */
export function WizardProgress({
  steps,
  currentIndex,
  label,
}: {
  steps: DiagnosisStep[];
  currentIndex: number;
  /** Template with `{current}` and `{total}`. */
  label: string;
}) {
  return (
    <div aria-hidden="true" className="mb-10">
      <p className="text-footnote font-semibold text-pewter">
        {format(label, { current: currentIndex + 1, total: steps.length })}
      </p>
      <ol
        className="mt-3 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, index) => (
          <li key={step.id}>
            <div className="h-1 overflow-hidden rounded-full bg-ash-veil">
              <m.div
                className="h-full origin-left rounded-full bg-obsidian"
                initial={false}
                animate={{ scaleX: index <= currentIndex ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span
              className={cn(
                "mt-2 hidden text-caption md:block",
                index === currentIndex ? "font-semibold text-obsidian" : "text-pewter",
              )}
            >
              {step.title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
