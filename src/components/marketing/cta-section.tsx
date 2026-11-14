import Image from "next/image";

import {
  DiagnosisPreview,
  type DiagnosisPreviewData,
} from "@/components/marketing/diagnosis-preview";
import { BrandWatermark } from "@/components/media/brand-watermark";
import { MediaBand } from "@/components/media/media-band";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { buttonStyles, ButtonLink } from "@/components/ui/button";
import { Container, Section, type SectionTone } from "@/components/ui/layout-primitives";
import { StepNumber } from "@/components/ui/step-number";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";
import { siteConfig } from "@/lib/site";

interface DiagnosisCTAProps {
  locale: Locale;
  id?: string;
  /** Home shows a real example result; other pages list what the diagnosis gives you. */
  preview?: DiagnosisPreviewData;
  tone?: Exclude<SectionTone, "dark">;
}

/**
 * The diagnosis presented like a product: a dark photographic tile (circuit board) inside a
 * light section, with the compass mark as a watermark and the result on glass.
 */
export function DiagnosisCTA({
  locale,
  id = "cta-diagnostico",
  preview,
  tone = "canvas",
}: DiagnosisCTAProps) {
  const t = getDictionary(locale);
  return (
    <Section tone={tone} labelledBy={`${id}-titulo`}>
      <div className="surface-dark relative isolate overflow-hidden rounded-tile bg-carbon text-pure-white">
        <ParallaxLayer className="-z-10">
          <Image
            src="/media/images/circuit.jpg"
            alt=""
            fill
            sizes="(min-width: 1200px) 1136px, 100vw"
            className="object-cover object-[70%_50%]"
          />
        </ParallaxLayer>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-carbon/85 via-carbon/70 to-carbon/85 lg:bg-linear-to-r lg:from-carbon/90 lg:via-carbon/65 lg:to-carbon/25"
        />
        <BrandWatermark className="-bottom-28 -left-28 size-96 opacity-[0.07]" />

        <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:p-16">
          <div>
            <h2
              id={`${id}-titulo`}
              className="text-[2rem] leading-[1.1] tracking-[-0.01em] md:text-heading-lg"
            >
              {t.diagnosisCta.title}
            </h2>
            <p className="mt-4 max-w-xl text-body text-ash-veil md:text-subheading">
              {t.diagnosisCta.text}
            </p>
            <ButtonLink href={pageHref(locale, "diagnosis")} size="lg" className="mt-8">
              {t.common.diagnosisCta}
            </ButtonLink>
          </div>

          {preview ? (
            <DiagnosisPreview data={preview} />
          ) : (
            <ol aria-label={t.diagnosisCta.outcomesLabel} className="space-y-3">
              {t.diagnosisCta.outcomes.map((outcome, index) => (
                <li
                  key={outcome.title}
                  className="glass-panel flex items-start gap-4 rounded-[1.25rem] p-5"
                >
                  <StepNumber value={index + 1} tone="dark" />
                  <div>
                    <p className="font-semibold">{outcome.title}</p>
                    <p className="mt-0.5 text-footnote text-ash-veil">{outcome.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </Section>
  );
}

/** Closing band: the neural-circuit photograph behind a centered stack with the brand mark. */
export function ContactCTA({ locale, id = "cta-contacto" }: { locale: Locale; id?: string }) {
  const t = getDictionary(locale);
  return (
    <MediaBand
      labelledBy={`${id}-titulo`}
      image="/media/images/neural-circuit.jpg"
      imagePosition="object-[60%_40%]"
      overlay="band"
    >
      <Container width="text" className="py-24 text-center md:py-32">
        <Image
          src="/brand/lguia-mark.png"
          alt=""
          width={64}
          height={64}
          className="mx-auto size-14 md:size-16"
        />
        <h2
          id={`${id}-titulo`}
          className="mt-6 text-[2rem] leading-[1.1] tracking-[-0.01em] md:text-display"
        >
          {t.contactCta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-body text-ash-veil md:text-subheading">
          {t.contactCta.text}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={pageHref(locale, "contact")} size="lg" className="w-full sm:w-auto">
            {t.common.proposalCta}
          </ButtonLink>
          <a
            href={`mailto:${siteConfig.email}`}
            className={buttonStyles({
              variant: "glass",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            {siteConfig.email}
          </a>
        </div>
      </Container>
    </MediaBand>
  );
}
