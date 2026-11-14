import type { Metadata } from "next";

import { PricingView, pricingMetadata } from "@/views/pricing/pricing-view";

export const metadata: Metadata = pricingMetadata("en");

export default function Page() {
  return <PricingView locale="en" />;
}
