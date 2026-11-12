import type { Metadata } from "next";

import { ContactCTA, DiagnosisCTA } from "@/components/marketing/cta-section";
import type { DiagnosisPreviewData } from "@/components/marketing/diagnosis-preview";
import { FaqList } from "@/components/marketing/faq-list";
import { PlanCard } from "@/components/marketing/plan-card";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { ServicesBento } from "@/components/marketing/service-tile";
import { MediaBand } from "@/components/media/media-band";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, Section, SectionHeader } from "@/components/ui/layout-primitives";
import { TextLink } from "@/components/ui/text-link";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { diagnose } from "@/features/diagnosis/model/diagnose";
import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import { format, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";
import { createPageMetadata } from "@/lib/metadata";
import { faqSchema, webPageSchema } from "@/lib/structured-data";
import { AboutSection } from "@/views/home/about-section";
import { AudienceSection } from "@/views/home/audience-section";
import { BenefitsSection } from "@/views/home/benefits-section";
import { Hero } from "@/views/home/hero";
import { ProblemsSection } from "@/views/home/problems-section";

export function homeMetadata(locale: Locale): Metadata {
  const { meta } = getDictionary(locale);
  return createPageMetadata({
    locale,
    route: { page: "home" },
    title: meta.homeTitle,
    description: meta.description,
    absoluteTitle: true,
  });
}

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

export async function HomeView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const catalog = getCatalogRepository(locale);
  const [categories, plans, processSteps] = await Promise.all([
    catalog.listServiceCategories(),
    catalog.listPlans(),
    catalog.listProcessSteps(),
  ]);
  const featuredPlans = plans.filter((plan) => plan.featured);
  const example = diagnose(EXAMPLE_ANSWERS, { plans, categories }, locale);
  const previewLabels = t.diagnosisCta.preview;
  const preview: DiagnosisPreviewData = {
    caption: previewLabels.caption,
    labels: {
      label: previewLabels.label,
      title: previewLabels.title,
      recommended: previewLabels.recommended,
      today: previewLabels.today,
      points: format(previewLabels.points, { score: example.score }),
    },
    score: example.score,
    levelLabel: example.level.label,
    areas: example.areas,
    planName: example.recommendedPlan.name,
  };

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: { page: "home" },
          name: t.meta.homeTitle,
          description: t.meta.description,
          type: "AboutPage",
        })}
      />
      <JsonLd data={faqSchema(t.home.faq.items)} />

      <Hero locale={locale} />

      <AboutSection locale={locale} />

      <Section labelledBy="servicios-titulo">
        <SectionHeader
          id="servicios-titulo"
          title={t.home.services.title}
          intro={t.home.services.intro}
        >
          <div className="mt-5 flex justify-center">
            <TextLink href={pageHref(locale, "services")}>{t.home.services.link}</TextLink>
          </div>
        </SectionHeader>
        <ServicesBento categories={categories} locale={locale} />
      </Section>

      <ProblemsSection locale={locale} />

      <Section labelledBy="planes-titulo">
        <SectionHeader id="planes-titulo" title={t.home.plans.title} intro={t.home.plans.intro}>
          <div className="mt-5 flex justify-center">
            <TextLink href={pageHref(locale, "pricing")}>{t.home.plans.link}</TextLink>
          </div>
        </SectionHeader>
        <RevealList className="grid gap-4 lg:grid-cols-3">
          {featuredPlans.map((plan) => (
            <RevealItem key={plan.id}>
              <PlanCard plan={plan} locale={locale} />
            </RevealItem>
          ))}
        </RevealList>
      </Section>

      <AudienceSection locale={locale} />

      <MediaBand
        labelledBy="proceso-titulo"
        video={{
          src: "/media/video/process-neural.mp4",
          poster: "/media/video/process-neural-poster.jpg",
          labels: { pause: t.common.pauseVideo, play: t.common.playVideo },
        }}
        overlay="soft"
      >
        <Container className="py-20 md:py-28">
          <SectionHeader
            id="proceso-titulo"
            title={t.home.process.title}
            intro={t.home.process.intro}
            onDark
          />
          <ProcessSteps steps={processSteps} tone="dark" />
        </Container>
      </MediaBand>

      <BenefitsSection locale={locale} />

      <Section tone="white" width="text" labelledBy="faq-titulo">
        <SectionHeader id="faq-titulo" title={t.home.faq.title} />
        <FaqList faqs={t.home.faq.items} tone="canvas" />
      </Section>

      <DiagnosisCTA locale={locale} preview={preview} />

      <ContactCTA locale={locale} />
    </>
  );
}
