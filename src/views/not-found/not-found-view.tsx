import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { BrandWatermark } from "@/components/media/brand-watermark";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout-primitives";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";

/** 404 page of one language, with the site chrome so people can keep navigating. */
export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <SkipLink label={t.common.skipLink} />
      <SiteHeader locale={locale} />
      <main
        id="contenido"
        tabIndex={-1}
        className="relative isolate overflow-hidden bg-pure-white outline-none"
      >
        <BrandWatermark className="top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" />
        <Container width="text" className="py-24 text-center md:py-36">
          <p className="text-subheading font-semibold text-pewter">{t.notFound.eyebrow}</p>
          <h1 className="mt-3 text-[2.5rem] leading-[1.08] tracking-[-0.02em] md:text-display">
            {t.notFound.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-body text-pewter md:text-subheading">
            {t.notFound.text}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href={pageHref(locale, "home")} size="lg">
              {t.notFound.home}
            </ButtonLink>
            <ButtonLink href={pageHref(locale, "services")} variant="secondary" size="lg">
              {t.notFound.services}
            </ButtonLink>
            <ButtonLink href={pageHref(locale, "diagnosis")} variant="secondary" size="lg">
              {t.notFound.diagnosis}
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
