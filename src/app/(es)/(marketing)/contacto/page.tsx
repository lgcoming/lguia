import type { Metadata } from "next";

import { ContactView, contactMetadata } from "@/views/contact/contact-view";

export const metadata: Metadata = contactMetadata("es");

export default function Page() {
  return <ContactView locale="es" />;
}
