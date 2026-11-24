import type { Metadata } from "next";

import { PrototypeView, prototypeMetadata } from "@/views/prototype/prototype-view";

export const metadata: Metadata = prototypeMetadata("es");

export default function Page() {
  return <PrototypeView locale="es" />;
}
