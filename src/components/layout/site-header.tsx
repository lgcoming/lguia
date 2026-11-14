import { HeaderShell } from "@/components/layout/header-shell";
import { Logo } from "@/components/layout/logo";
import { MainNav } from "@/components/layout/main-nav";
import { format, LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const other = LOCALES.find((candidate) => candidate !== locale) ?? locale;

  return (
    <HeaderShell>
      <div className="mx-auto flex h-(--header-height) w-full max-w-grid items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* 28px in the 56px mobile bar, 32px in the 64px desktop bar: half the bar height. */}
        <Logo
          variant="adaptive"
          height={32}
          href={pageHref(locale, "home")}
          label={t.common.logoLabel}
          imageClassName="h-7 lg:h-8"
        />
        <MainNav
          items={[
            { href: pageHref(locale, "services"), label: t.nav.services },
            { href: pageHref(locale, "pricing"), label: t.nav.pricing },
            { href: pageHref(locale, "contact"), label: t.nav.contact },
          ]}
          home={{ href: pageHref(locale, "home"), label: t.common.logoLabel }}
          cta={{ href: pageHref(locale, "diagnosis"), label: t.common.diagnosisCtaShort }}
          mobileCta={t.common.diagnosisCta}
          language={{
            target: other,
            name: LOCALE_INFO[other].nativeName,
            code: other.toUpperCase(),
            label: format(t.nav.switchLanguage, { language: LOCALE_INFO[other].nativeName }),
          }}
          labels={{
            primary: t.nav.primary,
            mobile: t.nav.mobile,
            menu: t.nav.menu,
            openMenu: t.nav.openMenu,
            closeMenu: t.nav.closeMenu,
          }}
        />
      </div>
    </HeaderShell>
  );
}
