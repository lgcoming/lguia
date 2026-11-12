import type { ReactNode } from "react";

import { MarketingShell } from "@/views/marketing-shell";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <MarketingShell locale="es">{children}</MarketingShell>;
}
