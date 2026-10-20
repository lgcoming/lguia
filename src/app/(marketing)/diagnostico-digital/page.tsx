import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/layout-primitives";
import { DiagnosisWizard } from "@/features/diagnosis/components/diagnosis-wizard";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Diagnóstico digital gratuito",
  description:
    "Responde 11 preguntas y descubre tu nivel de madurez digital, el plan que mejor encaja con tu negocio y los próximos pasos recomendados. Gratis y en 3 minutos.",
  path: "/diagnostico-digital",
});

export default function DiagnosisPage() {
  return (
    <>
      <PageHero
        title="Diagnóstico digital gratuito"
        intro="En unos 3 minutos sabrás en qué punto está tu negocio, qué plan te encaja mejor y por dónde empezar. Sin registro y sin compromiso."
      />
      <div className="bg-fog-white pt-10 pb-20 md:pt-14 md:pb-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <noscript>
              <p className="mb-6 rounded-tile bg-pure-white p-6">
                El diagnóstico necesita JavaScript para funcionar. Si lo prefieres, cuéntanos tu
                caso desde la{" "}
                <Link href="/contacto" className="text-sapphire underline underline-offset-4">
                  página de contacto
                </Link>
                .
              </p>
            </noscript>
            <DiagnosisWizard />
          </div>
        </Container>
      </div>
    </>
  );
}
