import { Info } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { Container } from "@/components/ui/layout-primitives";
import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { LeadTable } from "@/features/leads/components/lead-table";
import { getLeadRepository } from "@/features/leads/lead-repository";
import { isAdminEnabled } from "@/lib/admin-access";

export const metadata: Metadata = {
  title: "Leads",
};

export default async function AdminLeadsPage() {
  // Lead data changes per request: never prerender this page.
  await connection();
  if (!isAdminEnabled()) notFound();

  const catalog = getCatalogRepository();
  const [leads, plans, categories] = await Promise.all([
    getLeadRepository().list(),
    catalog.listPlans(),
    catalog.listServiceCategories(),
  ]);

  const planNames = Object.fromEntries(plans.map((plan) => [plan.id, plan.name]));
  const interestLabels: Record<string, string> = {
    general: "Orientación general",
    ...Object.fromEntries(categories.map((category) => [category.id, category.name])),
  };

  const fromDiagnosis = leads.filter((lead) => lead.diagnosis);
  const averageScore =
    fromDiagnosis.length > 0
      ? Math.round(
          fromDiagnosis.reduce((total, lead) => total + (lead.diagnosis?.score ?? 0), 0) /
            fromDiagnosis.length,
        )
      : null;

  const stats = [
    { label: "Leads totales", value: String(leads.length) },
    { label: "Desde el diagnóstico", value: String(fromDiagnosis.length) },
    { label: "Desde contacto", value: String(leads.length - fromDiagnosis.length) },
    { label: "Puntuación media", value: averageScore === null ? "—" : `${averageScore}/100` },
  ];

  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-h2">Leads</h1>

      <p className="mt-4 flex max-w-3xl gap-3 rounded-xl border border-signal bg-paper p-4 text-sm">
        <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-signal-700" />
        <span>
          Vista de demostración: los leads se guardan en memoria y se pierden al reiniciar el
          servidor. No tiene autenticación, por eso está desactivada en producción salvo que se
          active <code className="font-semibold">ENABLE_DEMO_ADMIN</code>.
        </span>
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-card border border-line bg-paper p-5">
            <dt className="text-sm text-ink-soft">{stat.label}</dt>
            <dd className="mt-1 text-h3 font-bold tabular">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <LeadTable leads={leads} planNames={planNames} interestLabels={interestLabels} />
      </div>
    </Container>
  );
}
