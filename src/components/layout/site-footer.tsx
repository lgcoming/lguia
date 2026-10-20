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
      <h2 className="text-caption font-semibold text-obsidian">{title}</h2>
      <div className="mt-3">{children}</div>
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
            className="inline-flex min-h-8 items-center text-footnote text-slate underline-offset-4 transition-colors duration-200 hover:text-obsidian hover:underline"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Apple-style footer: fog canvas, dense columns, fine print (SPEC-003). */
export function SiteFooter({ serviceLinks }: { serviceLinks: NavItem[] }) {
  return (
    <footer className="border-t border-pale-mist bg-fog-white text-pewter">
      <Container className="pt-14 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Logo height={30} className="-ml-0.5" />
            <p className="mt-4 text-footnote">
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
              className="inline-flex min-h-8 items-center text-footnote text-sapphire underline-offset-4 hover:underline"
            >
              {siteConfig.email}
            </a>
            <p className="mt-1 text-footnote">Trabajamos en remoto con empresas de toda España.</p>
          </FooterColumn>
        </div>
        <div className="mt-12 border-t border-pale-mist pt-5 text-caption">
          <p>© {new Date().getFullYear()} LGuIA. Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}
