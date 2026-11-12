"use client";

import * as m from "motion/react-m";
import { Check, CircleAlert, Clock, ListChecks, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DiagnosisUiStrings } from "@/features/diagnosis/content/types";
import { format } from "@/i18n/config";
import { useFocusOnMount } from "@/lib/use-focus-on-mount";

export function WizardIntro({
  questionCount,
  onStart,
  strings,
}: {
  questionCount: number;
  onStart: () => void;
  strings: DiagnosisUiStrings["intro"];
}) {
  return (
    <div>
      <h2 className="text-heading-sm">{strings.title}</h2>
      <p className="mt-3 text-pewter">{format(strings.text, { count: questionCount })}</p>
      <ul className="mt-6 space-y-3">
        {strings.outcomes.map((outcome) => (
          <li key={outcome} className="flex gap-3">
            <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-obsidian" />
            {outcome}
          </li>
        ))}
      </ul>
      <dl className="mt-8 grid gap-4 rounded-control bg-fog-white p-5 text-footnote sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <ListChecks aria-hidden="true" className="size-5 text-obsidian" />
          <dt className="sr-only">{strings.factLabels.steps}</dt>
          <dd>{strings.facts.steps}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock aria-hidden="true" className="size-5 text-obsidian" />
          <dt className="sr-only">{strings.factLabels.time}</dt>
          <dd>{strings.facts.time}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Lock aria-hidden="true" className="size-5 text-obsidian" />
          <dt className="sr-only">{strings.factLabels.signup}</dt>
          <dd>{strings.facts.signup}</dd>
        </div>
      </dl>
      <p className="mt-6 text-footnote text-pewter">{strings.privacy}</p>
      <Button size="lg" onClick={onStart} className="mt-8">
        {strings.start}
      </Button>
    </div>
  );
}

export function WizardCalculating({ strings }: { strings: DiagnosisUiStrings["calculating"] }) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div className="py-6">
      <h2 ref={headingRef} tabIndex={-1} className="text-heading-sm outline-none">
        {strings.title}
      </h2>
      <p className="mt-2 text-pewter">{strings.text}</p>
      {/* Indeterminate bar: a segment sweeps the track (transform only). */}
      <div aria-hidden="true" className="mt-10 h-1 overflow-hidden rounded-full bg-ash-veil">
        <m.div
          className="h-full w-1/3 rounded-full bg-obsidian"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export function WizardError({
  message,
  onRetry,
  onReview,
  strings,
}: {
  message: string;
  onRetry: () => void;
  onReview: () => void;
  strings: DiagnosisUiStrings["error"];
}) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div>
      <CircleAlert aria-hidden="true" className="size-8 text-danger" />
      <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-heading-sm outline-none">
        {strings.title}
      </h2>
      <p className="mt-3 text-pewter">
        {message} {strings.answersKept}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={onRetry}>
          {strings.retry}
        </Button>
        <Button size="lg" variant="secondary" onClick={onReview}>
          {strings.review}
        </Button>
      </div>
    </div>
  );
}
