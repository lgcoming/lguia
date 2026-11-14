import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageLink } from "@/components/layout/language-link";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/layout-primitives";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { format, LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref, serviceHref } from "@/i18n/routes";
import { siteConfig } from "@/lib/site";

const linkClasses =
  "inline-flex min-h-8 items-center text-footnote text-slate underline-offset-4 transition-colors duration-200 hover:text-obsidian hover:underline";

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-caption font-semibold text-obsidian">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function FooterLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={linkClasses}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Apple-style footer: fog canvas, dense columns, fine print (SPEC-003). */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const categories = await getCatalogRepository(locale).listServiceCategories();
  const other = LOCALES.find((candidate) => candidate !== locale) ?? locale;

  return (
    <footer className="border-t border-pale-mist bg-fog-white text-pewter">
      <Container className="pt-14 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Logo
              height={30}
              href={pageHref(locale, "home")}
              label={t.common.logoLabel}
              className="-ml-0.5"
            />
            <p className="mt-4 text-footnote">{t.footer.statement}</p>
          </div>
          <FooterColumn title={t.footer.services}>
            <FooterLinks
              links={categories.map((category) => ({
                href: serviceHref(locale, category.id),
                label: category.name,
              }))}
            />
          </FooterColumn>
          <FooterColumn title={t.footer.company}>
            <FooterLinks
              links={[
                { href: pageHref(locale, "pricing"), label: t.footer.pricing },
                { href: pageHref(locale, "diagnosis"), label: t.footer.diagnosis },
                { href: pageHref(locale, "contact"), label: t.footer.contact },
              ]}
            />
          </FooterColumn>
          <FooterColumn title={t.footer.talk}>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex min-h-8 items-center text-footnote text-sapphire underline-offset-4 hover:underline"
            >
              {siteConfig.email}
            </a>
            <p className="mt-1 text-footnote">{t.footer.remote}</p>
          </FooterColumn>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-pale-mist pt-5 text-caption">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {t.footer.rights}
          </p>
          <nav aria-label={t.legal.footerLabel}>
            <ul className="flex flex-wrap gap-x-4">
              {(["legal", "privacy", "cookies"] as const).map((page) => (
                <li key={page}>
                  <Link
                    href={pageHref(locale, page)}
                    className="inline-flex min-h-6 items-center underline-offset-4 hover:text-obsidian hover:underline"
                  >
                    {t.legal.pages[page].navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="flex items-center gap-2">
            <span>{t.footer.language}:</span>
            <span className="font-semibold text-obsidian">{LOCALE_INFO[locale].nativeName}</span>
            <LanguageLink
              target={other}
              label={format(t.nav.switchLanguage, { language: LOCALE_INFO[other].nativeName })}
              className="inline-flex min-h-6 items-center text-sapphire underline-offset-4 hover:underline"
            >
              {LOCALE_INFO[other].nativeName}
            </LanguageLink>
          </p>
        </div>
      </Container>
    </footer>
  );
}
