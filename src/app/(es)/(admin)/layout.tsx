import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/layout/logo";
import { SkipLink } from "@/components/layout/skip-link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/layout-primitives";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink label="Saltar al contenido" />
      <header className="glass-light sticky top-0 z-40">
        <Container className="flex h-(--header-height) items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo height={26} label="lguia, ir al inicio" />
            <Badge>Panel interno</Badge>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-footnote text-sapphire underline-offset-4 hover:underline"
          >
            Volver a la web
          </Link>
        </Container>
      </header>
      <main id="contenido" tabIndex={-1} className="min-h-[70vh] bg-fog-white outline-none">
        {children}
      </main>
    </>
  );
}
