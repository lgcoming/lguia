import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/layout-primitives";
import { StepNumber } from "@/components/ui/step-number";
import { TextLink } from "@/components/ui/text-link";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { ContactForm } from "@/features/leads/components/contact-form";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contacto",
  description:
    "Cuéntanos tu proyecto de web, automatización o inteligencia artificial y te respondemos con una primera valoración en un máximo de 2 días laborables.",
  path: "/contacto",
});

const nextSteps = [
  {
    title: "Leemos tu mensaje",
    text: "Te respondemos en un máximo de 2 días laborables.",
  },
  {
    title: "Hablamos 30 minutos",
    text: "Una llamada para entender tu negocio y lo que necesitas.",
  },
  {
    title: "Te enviamos una propuesta",
    text: "Con alcance, plazos y presupuesto cerrado. Sin compromiso.",
  },
];

export default async function ContactPage() {
  const categories = await getCatalogRepository().listServiceCategories();
  const interestOptions = [
    { value: "general", label: "Todavía no lo sé, quiero orientación" },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];

  return (
    <>
      <PageHero
        title="Hablemos de tu proyecto"
        intro="Cuéntanos qué necesitas y te responderemos con una primera valoración, sin compromiso. Cuanto más concreto seas, más útil será nuestra respuesta."
      />

      <Section labelledBy="formulario-titulo">
        <div className="grid items-start gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-tile bg-pure-white p-6 sm:p-10">
            <h2 id="formulario-titulo" className="mb-8 text-heading-sm">
              Escríbenos
            </h2>
            <ContactForm interestOptions={interestOptions} />
          </div>

          <aside aria-labelledby="despues-titulo" className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-tile bg-pure-white p-6 md:p-8">
              <h2 id="despues-titulo" className="text-subheading font-semibold">
                Qué pasa después
              </h2>
              <ol className="mt-6 space-y-5">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <StepNumber value={index + 1} />
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="mt-0.5 text-footnote text-pewter">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-tile bg-pure-white p-6 md:p-8">
              <h2 className="font-semibold">¿Prefieres el email?</h2>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-1 inline-flex min-h-11 items-center text-body text-sapphire underline-offset-4 hover:underline"
              >
                {siteConfig.email}
              </a>
              <h2 className="mt-5 font-semibold">¿No sabes qué necesitas?</h2>
              <p className="mt-1 text-footnote text-pewter">
                El diagnóstico digital te da una recomendación en unos 3 minutos.
              </p>
              <TextLink href="/diagnostico-digital">Haz el diagnóstico</TextLink>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
