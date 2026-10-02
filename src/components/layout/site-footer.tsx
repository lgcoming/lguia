import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/layout-primitives";
import type { NavItem } from "@/lib/site";
import { siteConfig } from "@/lib/site";

const companyLinks: NavItem[] = [
  { href: "/planes", label: "Planes y precios" },
  { href: "/diagnostico-digital", label: "Diagnóstico digital" },
  { href: "/contacto", label: "Contacto" },
];

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-paper">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FooterLinks({ links }: { links: NavItem[] }) {
  return (
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="inline-flex min-h-10 items-center text-on-dark-soft transition-colors hover:text-paper"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter({ serviceLinks }: { serviceLinks: NavItem[] }) {
  return (
    <footer className="bg-ink text-paper [--focus-ring:var(--color-signal)]">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Logo onDark />
            <p className="mt-4 text-on-dark-soft">
              Webs, automatización e inteligencia artificial práctica para pymes y negocios locales.
            </p>
          </div>
          <FooterColumn title="Servicios">
            <FooterLinks links={serviceLinks} />
          </FooterColumn>
          <FooterColumn title="LGuIA">
            <FooterLinks links={companyLinks} />
          </FooterColumn>
          <FooterColumn title="Hablemos">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex min-h-10 items-center font-semibold text-paper underline decoration-signal decoration-2 underline-offset-4"
            >
              {siteConfig.email}
            </a>
            <p className="mt-2 text-on-dark-soft">
              Trabajamos en remoto con empresas de toda España.
            </p>
          </FooterColumn>
        </div>
        <div className="mt-12 border-t border-ink-raised pt-6 text-sm text-on-dark-soft">
          <p>© {new Date().getFullYear()} LGuIA. Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}
