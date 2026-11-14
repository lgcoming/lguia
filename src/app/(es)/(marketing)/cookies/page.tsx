import type { Metadata } from "next";

import { LegalView, legalMetadata } from "@/views/legal/legal-view";

export const metadata: Metadata = legalMetadata("es", "cookies");

export default function Page() {
  return <LegalView locale="es" page="cookies" />;
}
