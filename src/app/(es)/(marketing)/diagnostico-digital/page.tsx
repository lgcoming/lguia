import type { Metadata } from "next";

import { DiagnosisView, diagnosisMetadata } from "@/views/diagnosis/diagnosis-view";

export const metadata: Metadata = diagnosisMetadata("es");

export default function Page() {
  return <DiagnosisView locale="es" />;
}
