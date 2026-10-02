import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/layout-primitives";
import { RouteStop } from "@/components/ui/route";
import { siteConfig } from "@/lib/site";

const diagnosisOutcomes = [
  { title: "Tu nivel de madurez digital", text: "Una puntuación de 0 a 100 por áreas." },
  { title: "El plan que mejor encaja", text: "Con los motivos, explicados sin tecnicismos." },
  { title: "Tus próximos pasos", text: "Qué hacer primero para notar resultados." },
];

export function DiagnosisCTA({ id = "cta-diagnostico" }: { id?: string }) {
  return (
    <Section tone="ink" labelledBy={`${id}-titulo`}>
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 id={`${id}-titulo`} className="text-[1.75rem] leading-tight md:text-h2">
            ¿No sabes por dónde empezar?
          </h2>
          <p className="mt-4 max-w-xl text-lead text-on-dark-soft">
            Responde 11 preguntas sobre tu negocio y descubre qué mejorar primero. Es gratis, se
            hace en unos 3 minutos y no necesitas registrarte para ver el resultado.
          </p>
          <ButtonLink href="/diagnostico-digital" variant="on-dark" size="lg" className="mt-8">
            Haz tu diagnóstico digital
          </ButtonLink>
        </div>
        <ol className="space-y-6" aria-label="Qué obtienes con el diagnóstico">
          {diagnosisOutcomes.map((outcome, index) => (
            <li key={outcome.title} className="relative flex gap-4">
              {index < diagnosisOutcomes.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-9 -bottom-6 left-[17px] w-0.5 bg-ink-raised"
                />
              ) : null}
              <RouteStop
                state={index === diagnosisOutcomes.length - 1 ? "current" : "upcoming"}
                tone="dark"
              >
                {index + 1}
              </RouteStop>
              <div>
                <p className="font-semibold text-paper">{outcome.title}</p>
                <p className="text-on-dark-soft">{outcome.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export function ContactCTA({ id = "cta-contacto" }: { id?: string }) {
  return (
    <Section labelledBy={`${id}-titulo`}>
      <div className="flex flex-col gap-8 rounded-panel border border-line p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div className="max-w-2xl">
          <h2 id={`${id}-titulo`} className="text-[1.75rem] leading-tight md:text-h2">
            ¿Prefieres contarnos tu proyecto?
          </h2>
          <p className="mt-4 text-lead text-ink-soft">
            Escríbenos con lo que tienes en mente y te respondemos con una primera valoración, sin
            compromiso. También puedes escribir a{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-semibold text-pine-700 underline underline-offset-4"
            >
              {siteConfig.email}
            </a>
            .
          </p>
        </div>
        <ButtonLink
          href="/contacto"
          variant="secondary"
          size="lg"
          className="self-start md:self-auto"
        >
          Escríbenos
        </ButtonLink>
      </div>
    </Section>
  );
}
