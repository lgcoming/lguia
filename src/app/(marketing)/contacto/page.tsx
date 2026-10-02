import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/layout-primitives";
import { RouteStop } from "@/components/ui/route";
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
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <h2 id="formulario-titulo" className="mb-8 text-h3">
              Escríbenos
            </h2>
            <ContactForm interestOptions={interestOptions} />
          </div>

          <aside aria-labelledby="despues-titulo" className="lg:pt-2">
            <div className="rounded-card bg-mist p-6 md:p-8">
              <h2 id="despues-titulo" className="text-h4">
                Qué pasa después
              </h2>
              <ol className="mt-6 space-y-6">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="relative flex gap-4">
                    {index < nextSteps.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-9 -bottom-6 left-[17px] w-0.5 bg-pine-100"
                      />
                    ) : null}
                    <RouteStop state={index === 0 ? "current" : "done"}>{index + 1}</RouteStop>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-base text-ink-soft">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 space-y-6 px-1">
              <div>
                <h2 className="font-semibold">¿Prefieres el email?</h2>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-1 inline-flex min-h-11 items-center font-semibold text-pine-700 underline underline-offset-4"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <h2 className="font-semibold">¿No sabes qué necesitas?</h2>
                <p className="mt-1 text-ink-soft">
                  El{" "}
                  <Link
                    href="/diagnostico-digital"
                    className="font-semibold text-pine-700 underline underline-offset-4"
                  >
                    diagnóstico digital
                  </Link>{" "}
                  te da una recomendación en unos 3 minutos.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
