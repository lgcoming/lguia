import { Section } from "@/components/ui/layout-primitives";

const facts = [
  { title: "Un solo equipo", text: "Web, automatización e IA coordinadas desde el primer día." },
  { title: "Presupuesto cerrado", text: "Sabes qué incluye y cuánto cuesta antes de empezar." },
  { title: "Acompañamiento real", text: "Seguimos a tu lado después del lanzamiento." },
];

export function AboutSection() {
  return (
    <Section labelledBy="que-es-titulo">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <h2 id="que-es-titulo" className="text-[1.75rem] leading-tight md:text-h2">
          Una agencia digital que empieza por tu negocio, no por la tecnología
        </h2>
        <div>
          <div className="space-y-5 text-lead text-ink-soft">
            <p>
              LGuIA ayuda a pymes y negocios locales a digitalizarse con sentido común. Diseñamos
              webs, automatizamos procesos y aplicamos inteligencia artificial cuando resuelve un
              problema concreto, no porque esté de moda.
            </p>
            <p>
              Trabajamos las tres cosas con el mismo equipo para que todo encaje: tu web capta
              contactos, las automatizaciones los ordenan y la IA te ayuda a responder antes.
            </p>
          </div>
          <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.title}>
                <dt className="font-semibold">{fact.title}</dt>
                <dd className="mt-1 text-base text-ink-soft">{fact.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
