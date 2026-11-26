import type { Metadata } from "next";

import { PrototypeView, prototypeMetadata } from "@/views/prototype/prototype-view";

export const metadata: Metadata = prototypeMetadata("en");

export default function Page() {
  return <PrototypeView locale="en" />;
}
