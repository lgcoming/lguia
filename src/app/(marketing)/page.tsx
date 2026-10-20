import type { Metadata } from "next";

import { AboutSection } from "@/app/(marketing)/_components/about-section";
import { AudienceSection } from "@/app/(marketing)/_components/audience-section";
import { BenefitsSection } from "@/app/(marketing)/_components/benefits-section";
import { Hero } from "@/app/(marketing)/_components/hero";
import { ProblemsSection } from "@/app/(marketing)/_components/problems-section";
import { ContactCTA, DiagnosisCTA } from "@/components/marketing/cta-section";
import type { DiagnosisPreviewData } from "@/components/marketing/diagnosis-preview";
import { PlanCard } from "@/components/marketing/plan-card";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { ServicesBento } from "@/components/marketing/service-tile";
import { MediaBand } from "@/components/media/media-band";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { Container, Section, SectionHeader } from "@/components/ui/layout-primitives";
import { TextLink } from "@/components/ui/text-link";
import { processSteps } from "@/data/process";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { diagnose } from "@/features/diagnosis/model/diagnose";
import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "LGuIA: webs, automatización e IA práctica para pymes",
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

/** A real engine result for an example business, so the diagnosis band shows what users get. */
const EXAMPLE_ANSWERS: DiagnosisAnswers = {
  websiteStatus: "basic",
  sellsOnline: "no",
  webLeads: "occasional",
  automationLevel: "basic",
  repetitiveWorkload: "high",
  aiAdoption: "interested",
  chatbotInterest: "yes",
  seoStatus: "occasional",
  visibilityGoal: "interested",
  companySize: "micro",
  mainGoal: "leads",
};

export default async function HomePage() {
  const catalog = getCatalogRepository();
  const [categories, plans] = await Promise.all([
    catalog.listServiceCategories(),
    catalog.listPlans(),
  ]);
  const featuredPlans = plans.filter((plan) => plan.featured);
  const example = diagnose(EXAMPLE_ANSWERS, { plans, categories });
  const preview: DiagnosisPreviewData = {
    caption: "Ejemplo: clínica dental, 8 personas",
    score: example.score,
    levelLabel: example.level.label,
    areas: example.areas,
    planName: example.recommendedPlan.name,
  };

  return (
    <>
      <Hero />

      <AboutSection />

      <Section labelledBy="servicios-titulo">
        <SectionHeader
          id="servicios-titulo"
          title="Qué podemos hacer por tu negocio"
          intro="Cuatro áreas que se complementan. Puedes empezar por una y sumar las demás cuando tenga sentido."
        >
          <div className="mt-5 flex justify-center">
            <TextLink href="/servicios">Ver todos los servicios</TextLink>
          </div>
        </SectionHeader>
        <ServicesBento categories={categories} />
      </Section>

      <ProblemsSection />

      <Section labelledBy="planes-titulo">
        <SectionHeader
          id="planes-titulo"
          title="Planes para empezar con buen pie"
          intro="Precios orientativos para que sepas desde el principio de qué hablamos. El presupuesto final se cierra tras el diagnóstico."
        >
          <div className="mt-5 flex justify-center">
            <TextLink href="/planes">Ver todos los planes</TextLink>
          </div>
        </SectionHeader>
        <RevealList className="grid gap-4 lg:grid-cols-3">
          {featuredPlans.map((plan) => (
            <RevealItem key={plan.id}>
              <PlanCard plan={plan} />
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      <AudienceSection />

      <MediaBand
        labelledBy="proceso-titulo"
        video={{
          src: "/media/video/process-neural.mp4",
          poster: "/media/video/process-neural-poster.jpg",
        }}
        overlay="soft"
      >
        <Container className="py-20 md:py-28">
          <SectionHeader
            id="proceso-titulo"
            title="Cómo trabajamos"
            intro="Un proceso claro y por fases, para que sepas en todo momento en qué punto está tu proyecto."
            onDark
          />
          <ProcessSteps steps={processSteps} tone="dark" />
        </Container>
      </MediaBand>

      <BenefitsSection />

      <DiagnosisCTA preview={preview} tone="white" />

      <ContactCTA />
    </>
  );
}
