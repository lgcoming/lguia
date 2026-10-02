import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/layout-primitives";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-mist px-3 py-1 text-sm font-semibold text-ink-soft">
              Panel interno
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center font-semibold text-pine-700 underline-offset-4 hover:underline"
          >
            Volver a la web
          </Link>
        </Container>
      </header>
      <main id="contenido" className="min-h-[70vh] bg-mist">
        {children}
      </main>
    </>
  );
}
