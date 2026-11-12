import type { Metadata } from "next";

import { DiagnosisView, diagnosisMetadata } from "@/views/diagnosis/diagnosis-view";

export const metadata: Metadata = diagnosisMetadata("en");

export default function Page() {
  return <DiagnosisView locale="en" />;
}
