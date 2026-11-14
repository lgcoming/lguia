import type { Metadata } from "next";

import { LegalView, legalMetadata } from "@/views/legal/legal-view";

export const metadata: Metadata = legalMetadata("en", "cookies");

export default function Page() {
  return <LegalView locale="en" page="cookies" />;
}
