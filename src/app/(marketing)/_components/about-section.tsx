import { HeartHandshake, Layers, ReceiptText, type LucideIcon } from "lucide-react";

import { Section } from "@/components/ui/layout-primitives";

const facts: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Layers,
    title: "Un solo equipo",
    text: "Web, automatización e IA coordinadas desde el primer día.",
  },
  {
    icon: ReceiptText,
    title: "Presupuesto cerrado",
    text: "Sabes qué incluye y cuánto cuesta antes de empezar.",
  },
  {
    icon: HeartHandshake,
    title: "Acompañamiento real",
    text: "Seguimos a tu lado después del lanzamiento.",
  },
];

/** Editorial statement: a large centered headline, a calm subhead and three facts. */
export function AboutSection() {
  return (
    <Section tone="white" labelledBy="que-es-titulo">
      <div className="mx-auto max-w-text text-center">
        <h2
          id="que-es-titulo"
          className="text-[2rem] leading-[1.1] tracking-[-0.015em] md:text-[3rem] md:leading-[1.08] lg:text-display"
        >
          Una agencia digital que empieza por tu negocio, no por la tecnología
        </h2>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-body text-pewter md:text-subheading">
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
      </div>
      <dl className="mt-14 grid gap-4 sm:grid-cols-3 md:mt-20">
        {facts.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-tile bg-fog-white p-7 text-center md:p-8">
            <Icon aria-hidden="true" className="mx-auto size-7 text-obsidian" strokeWidth={1.5} />
            <dt className="mt-4 text-subheading font-semibold">{title}</dt>
            <dd className="mt-2 text-footnote text-pewter">{text}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
