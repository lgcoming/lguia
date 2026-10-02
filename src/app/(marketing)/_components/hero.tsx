import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout-primitives";
import { RouteStop } from "@/components/ui/route";

export interface DiagnosisPreviewData {
  caption: string;
  score: number;
  levelLabel: string;
  areas: { id: string; label: string; score: number }[];
  planName: string;
}

const reassurances = [
  "Gratis y sin compromiso",
  "11 preguntas, unos 3 minutos",
  "Resultado al momento",
];

/**
 * A real diagnosis result for an example business, drawn with HTML and CSS.
 * CSS-only animation: no JavaScript, and the H1 (LCP) is never animated.
 */
function DiagnosisPreview({ data }: { data: DiagnosisPreviewData }) {
  return (
    <figure
      aria-label="Ejemplo de resultado del diagnóstico digital"
      className="animate-fade-up rounded-panel border border-line bg-paper p-6 shadow-lift sm:p-8"
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold">Diagnóstico digital</span>
        <Badge>{data.caption}</Badge>
      </figcaption>

      <div className="mt-6 flex items-end gap-4">
        <p className="leading-none">
          <span className="text-[3.5rem] font-bold tracking-tight tabular sm:text-[4rem]">
            {data.score}
          </span>
          <span className="ml-1 text-ink-soft">/100</span>
        </p>
        <Badge tone="brand" className="mb-2">
          {data.levelLabel}
        </Badge>
      </div>

      <ul className="mt-6 space-y-4">
        {data.areas.map((area, index) => (
          <li key={area.id}>
            <div className="flex items-baseline justify-between text-sm">
              <span>{area.label}</span>
              <span className="font-semibold tabular">{area.score}</span>
            </div>
            <div aria-hidden="true" className="mt-1.5 h-2 overflow-hidden rounded-full bg-mist">
              <div
                className="h-full origin-left animate-bar-grow rounded-full bg-pine-700"
                style={{ width: `${area.score}%`, animationDelay: `${0.35 + index * 0.12}s` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-line pt-6">
        <div aria-hidden="true" className="flex items-center">
          <RouteStop state="done" size="xs" />
          <div
            className="h-0.5 flex-1 origin-left animate-bar-grow bg-pine-100"
            style={{ animationDelay: "0.9s" }}
          />
          <RouteStop state="current" size="sm" />
        </div>
        <div className="mt-3 flex justify-between gap-4 text-sm">
          <p>
            <span className="block text-ink-soft">Hoy</span>
            <span className="font-semibold tabular">{data.score} puntos</span>
          </p>
          <p className="text-right">
            <span className="block text-ink-soft">Plan recomendado</span>
            <span className="font-semibold">{data.planName}</span>
          </p>
        </div>
      </div>
    </figure>
  );
}

export function Hero({ preview }: { preview: DiagnosisPreviewData }) {
  return (
    <section aria-labelledby="hero-titulo" className="border-b border-line">
      <Container className="grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:py-24">
        <div className="min-w-0">
          <h1
            id="hero-titulo"
            className="text-[1.875rem] leading-[1.08] max-[399px]:hyphens-auto min-[400px]:text-[2.375rem] min-[400px]:leading-[1.06] sm:text-h1 sm:leading-[1.06] lg:text-[3rem] lg:leading-[1.05]"
          >
            Webs, automatizaciones e IA que resuelven problemas reales de tu negocio
          </h1>
          <p className="mt-6 max-w-xl text-lead text-ink-soft">
            Ayudamos a pymes y negocios locales a conseguir más clientes desde su web, ahorrar horas
            en tareas repetitivas y usar la inteligencia artificial solo donde aporta valor.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/diagnostico-digital" size="lg">
              Haz tu diagnóstico digital
            </ButtonLink>
            <ButtonLink href="/servicios" variant="secondary" size="lg">
              Ver servicios
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            {reassurances.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check aria-hidden="true" className="size-4 text-pine-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[36px] bg-mist p-3 sm:p-5">
          <DiagnosisPreview data={preview} />
        </div>
      </Container>
    </section>
  );
}
