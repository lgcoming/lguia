import type { Metadata } from "next";

import { ServicesView, servicesMetadata } from "@/views/services/services-view";

export const metadata: Metadata = servicesMetadata("en");

export default function Page() {
  return <ServicesView locale="en" />;
}
