import type { Metadata } from "next";

import { PricingView, pricingMetadata } from "@/views/pricing/pricing-view";

export const metadata: Metadata = pricingMetadata("es");

export default function Page() {
  return <PricingView locale="es" />;
}
