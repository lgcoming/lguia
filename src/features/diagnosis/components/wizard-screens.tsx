"use client";

import * as m from "motion/react-m";
import { Check, CircleAlert, Clock, ListChecks, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFocusOnMount } from "@/lib/use-focus-on-mount";

const outcomes = [
  "Tu nivel de madurez digital, de 0 a 100, por áreas",
  "El plan que mejor encaja con tu negocio y por qué",
  "Los servicios y los próximos pasos que te recomendamos",
];

export function WizardIntro({
  questionCount,
  onStart,
}: {
  questionCount: number;
  onStart: () => void;
}) {
  return (
    <div>
      <h2 className="text-heading-sm">Descubre qué mejorar primero en tu negocio</h2>
      <p className="mt-3 text-pewter">
        Responde {questionCount} preguntas sobre tu web, tus procesos, la inteligencia artificial y
        tu visibilidad en buscadores. Al terminar verás:
      </p>
      <ul className="mt-6 space-y-3">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex gap-3">
            <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-obsidian" />
            {outcome}
          </li>
        ))}
      </ul>
      <dl className="mt-8 grid gap-4 rounded-control bg-fog-white p-5 text-footnote sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <ListChecks aria-hidden="true" className="size-5 text-obsidian" />
          <dt className="sr-only">Pasos</dt>
          <dd>5 pasos cortos</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock aria-hidden="true" className="size-5 text-obsidian" />
          <dt className="sr-only">Duración</dt>
          <dd>Unos 3 minutos</dd>
        </div>
        <div className="flex items-center gap-2">
          <Lock aria-hidden="true" className="size-5 text-obsidian" />
          <dt className="sr-only">Registro</dt>
          <dd>Sin registro</dd>
        </div>
      </dl>
      <p className="mt-6 text-footnote text-pewter">
        Tus respuestas solo se usan para calcular el resultado y no se guardan. Si quieres que te
        contactemos, te pediremos tus datos al final.
      </p>
      <Button size="lg" onClick={onStart} className="mt-8">
        Empezar diagnóstico
      </Button>
    </div>
  );
}

export function WizardCalculating() {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div className="py-6">
      <h2 ref={headingRef} tabIndex={-1} className="text-heading-sm outline-none">
        Analizando tus respuestas…
      </h2>
      <p className="mt-2 text-pewter">
        Calculamos tu puntuación y el plan que mejor encaja con tu negocio.
      </p>
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
}: {
  message: string;
  onRetry: () => void;
  onReview: () => void;
}) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div>
      <CircleAlert aria-hidden="true" className="size-8 text-danger" />
      <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-heading-sm outline-none">
        No hemos podido calcular tu diagnóstico
      </h2>
      <p className="mt-3 text-pewter">{message} Tus respuestas siguen guardadas.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={onRetry}>
          Reintentar
        </Button>
        <Button size="lg" variant="secondary" onClick={onReview}>
          Revisar respuestas
        </Button>
      </div>
    </div>
  );
}
