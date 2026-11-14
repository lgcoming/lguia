import type { Metadata } from "next";

import { ServicesView, servicesMetadata } from "@/views/services/services-view";

export const metadata: Metadata = servicesMetadata("es");

export default function Page() {
  return <ServicesView locale="es" />;
}
