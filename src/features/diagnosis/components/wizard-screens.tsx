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
      <h2 className="text-h3">Descubre qué mejorar primero en tu negocio</h2>
      <p className="mt-3 text-ink-soft">
        Responde {questionCount} preguntas sobre tu web, tus procesos, la inteligencia artificial y
        tu visibilidad en buscadores. Al terminar verás:
      </p>
      <ul className="mt-6 space-y-3">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex gap-3">
            <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-pine-700" />
            {outcome}
          </li>
        ))}
      </ul>
      <dl className="mt-8 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <ListChecks aria-hidden="true" className="size-5 text-pine-700" />
          <dt className="sr-only">Pasos</dt>
          <dd>5 pasos cortos</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock aria-hidden="true" className="size-5 text-pine-700" />
          <dt className="sr-only">Duración</dt>
          <dd>Unos 3 minutos</dd>
        </div>
        <div className="flex items-center gap-2">
          <Lock aria-hidden="true" className="size-5 text-pine-700" />
          <dt className="sr-only">Registro</dt>
          <dd>Sin registro</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm text-ink-soft">
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
      <h2 ref={headingRef} tabIndex={-1} className="text-h3 outline-none">
        Analizando tus respuestas…
      </h2>
      <p className="mt-2 text-ink-soft">
        Calculamos tu puntuación y el plan que mejor encaja con tu negocio.
      </p>
      <div aria-hidden="true" className="relative mt-10 h-5">
        <div className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-line" />
        {/* The track is one dot narrower than the line, so x: 100% lands the dot on the end. */}
        <m.div
          className="absolute inset-y-0 left-0 w-[calc(100%-1.25rem)]"
          animate={{ x: ["0%", "100%"] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <span className="block size-5 rounded-full bg-signal ring-4 ring-signal/30" />
        </m.div>
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
      <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-h3 outline-none">
        No hemos podido calcular tu diagnóstico
      </h2>
      <p className="mt-3 text-ink-soft">{message} Tus respuestas siguen guardadas.</p>
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
