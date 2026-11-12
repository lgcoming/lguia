import type { Metadata } from "next";
import type { ReactNode } from "react";

import { RootDocument } from "@/app/_document/root-document";
import { rootMetadata } from "@/lib/metadata";

export const metadata: Metadata = rootMetadata("es");

/** Root layout of the Spanish site (SPEC-009): one root layout per language. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
