import { Check } from "lucide-react";

import { RevealGroup, RevealText } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/layout-primitives";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";

/** Dark band on the web development page that leads to the free prototype request (SPEC-012). */
export function PrototypeOffer({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).servicePage.prototype;
  return (
    <Section tone="dark" width="text" labelledBy="prototipo-titulo">
      <RevealGroup className="mx-auto max-w-3xl text-center">
        <RevealText>
          <h2
            id="prototipo-titulo"
            className="text-[2rem] leading-[1.1] tracking-[-0.01em] md:text-heading-lg"
          >
            {copy.title}
          </h2>
        </RevealText>
        <RevealText>
          <p className="mt-4 text-subheading text-ash-veil">{copy.text}</p>
        </RevealText>
        <RevealText>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-footnote text-ash-veil">
            {copy.points.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <Check aria-hidden="true" className="size-4 text-sky-signal" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <ButtonLink href={pageHref(locale, "prototype")} size="lg">
              {copy.cta}
            </ButtonLink>
          </div>
        </RevealText>
      </RevealGroup>
    </Section>
  );
}
