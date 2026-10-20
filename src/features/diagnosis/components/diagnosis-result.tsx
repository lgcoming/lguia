"use client";

import { Check } from "lucide-react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { StepNumber } from "@/components/ui/step-number";
import { TextLink } from "@/components/ui/text-link";
import { formatPlanPrice } from "@/features/catalog/format";
import type { DiagnosisResult } from "@/features/diagnosis/model/types";
import { useFocusOnMount } from "@/lib/use-focus-on-mount";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const block: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

function ScoreRing({ score }: { score: number }) {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(reduceMotion ? score : 0);
  const rounded = useTransform(count, (value) => Math.round(value));

  useEffect(() => {
    if (reduceMotion) {
      count.set(score);
      return;
    }
    const controls = animate(count, score, { duration: 0.9, ease: EASE });
    return () => controls.stop();
  }, [count, reduceMotion, score]);

  return (
    <div className="relative size-36 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-ash-veil" />
        <m.circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className="stroke-obsidian"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <m.span className="text-[2.5rem] leading-none font-semibold tracking-[-0.03em] tabular">
          {rounded}
        </m.span>
        <span className="mt-1 text-caption text-pewter">de 100</span>
      </div>
    </div>
  );
}

function AreaBars({ areas }: { areas: DiagnosisResult["areas"] }) {
  const reduceMotion = useReducedMotion();
  return (
    <ul className="mt-6 space-y-4">
      {areas.map((area, index) => (
        <li key={area.id}>
          <div className="flex items-baseline justify-between gap-4 text-footnote">
            <span>{area.label}</span>
            <span className="font-semibold tabular">
              {area.score}
              <span className="sr-only"> de 100</span>
            </span>
          </div>
          <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-ash-veil">
            <m.div
              className="h-full origin-left rounded-full bg-obsidian"
              style={{ width: `${area.score}%` }}
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3 + index * 0.1, ease: EASE }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

interface DiagnosisResultViewProps {
  result: DiagnosisResult;
  onReview: () => void;
  /** Lead capture rendered after the recommendations. */
  children?: ReactNode;
}

export function DiagnosisResultView({ result, onReview, children }: DiagnosisResultViewProps) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const plan = result.recommendedPlan;

  return (
    <m.div variants={container} initial="hidden" animate="visible">
      <m.div variants={block}>
        <h2 ref={headingRef} tabIndex={-1} className="text-heading-sm outline-none">
          Tu diagnóstico digital
        </h2>
        <p className="mt-2 text-pewter">Basado en tus respuestas de hoy.</p>
      </m.div>

      <m.section
        variants={block}
        aria-labelledby="resultado-puntuacion"
        className="mt-8 grid gap-8 rounded-tile bg-fog-white p-6 sm:grid-cols-[auto_1fr] sm:items-start md:p-8"
      >
        <h3 id="resultado-puntuacion" className="sr-only">
          Tu puntuación: {result.score} de 100, nivel {result.level.label}
        </h3>
        <ScoreRing score={result.score} />
        <div>
          <p className="flex flex-wrap items-center gap-3">
            <span className="font-semibold">Nivel de madurez digital</span>
            <Badge tone="strong">{result.level.label}</Badge>
          </p>
          <p className="mt-2 text-footnote text-pewter">{result.level.summary}</p>
          <AreaBars areas={result.areas} />
        </div>
      </m.section>

      {/* The recommendation is the answer the user came for: the one dark tile on the page. */}
      <m.section
        variants={block}
        aria-labelledby="resultado-plan"
        className="surface-dark mt-4 rounded-tile bg-obsidian p-6 text-pure-white md:p-8"
      >
        <p className="text-footnote font-semibold text-ash-veil">Plan recomendado</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 id="resultado-plan" className="text-heading-sm">
            {plan.name}
          </h3>
          <p className="font-semibold tabular">
            {formatPlanPrice(plan.pricing)}
            {plan.pricing.kind === "from" ? (
              <span className="text-footnote font-normal text-ash-veil"> sin IVA</span>
            ) : null}
          </p>
        </div>
        <p className="mt-2 text-footnote text-ash-veil">{plan.tagline}</p>

        <h4 className="mt-6 font-semibold">Por qué te lo recomendamos</h4>
        <ul className="mt-3 space-y-3">
          {result.reasons.map((reason) => (
            <li key={reason} className="flex gap-3 text-footnote">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky-signal" />
              {reason}
            </li>
          ))}
        </ul>
        <ButtonLink href={plan.href} variant="on-dark" className="mt-7">
          Ver qué incluye {plan.name}
        </ButtonLink>
      </m.section>

      <m.section variants={block} aria-labelledby="resultado-servicios" className="mt-10">
        <h3 id="resultado-servicios" className="text-subheading font-semibold">
          Servicios recomendados
        </h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {result.recommendedServices.map((service) => (
            <li key={service.id} className="flex flex-col rounded-tile bg-fog-white p-6">
              <h4 className="font-semibold">{service.name}</h4>
              <p className="mt-1 text-footnote text-pewter">{service.reason}</p>
              <div className="mt-auto pt-2">
                <TextLink href={service.category.href} size="footnote">
                  Más sobre {service.category.name}
                </TextLink>
              </div>
            </li>
          ))}
        </ul>
      </m.section>

      <m.section variants={block} aria-labelledby="resultado-pasos" className="mt-10">
        <h3 id="resultado-pasos" className="text-subheading font-semibold">
          Próximos pasos
        </h3>
        <ol className="mt-5 space-y-4">
          {result.nextSteps.map((step, index) => (
            <li key={step} className="flex gap-4">
              <StepNumber value={index + 1} />
              <p className="pt-1.5">{step}</p>
            </li>
          ))}
        </ol>
      </m.section>

      {children ? (
        <m.div variants={block} className="mt-10">
          {children}
        </m.div>
      ) : null}

      <m.div variants={block} className="mt-8 border-t border-pale-mist pt-6">
        <Button variant="plain" onClick={onReview} className="-ml-5">
          Cambiar mis respuestas
        </Button>
      </m.div>
    </m.div>
  );
}
