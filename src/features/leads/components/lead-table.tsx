import { Inbox } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { MATURITY_LEVELS } from "@/features/diagnosis/model/diagnose";
import type { Lead } from "@/features/leads/types";

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Madrid",
});

interface LeadTableProps {
  leads: Lead[];
  planNames: Record<string, string>;
  interestLabels: Record<string, string>;
}

function LeadNeed({
  lead,
  planNames,
  interestLabels,
}: { lead: Lead } & Omit<LeadTableProps, "leads">) {
  if (lead.diagnosis) {
    return (
      <>
        <p className="font-semibold">{planNames[lead.diagnosis.recommendedPlanId]}</p>
        <p className="text-sm text-ink-soft">
          <span className="tabular">{lead.diagnosis.score}/100</span>,{" "}
          {MATURITY_LEVELS[lead.diagnosis.level].label.toLowerCase()}
        </p>
      </>
    );
  }
  return <p>{lead.interest ? interestLabels[lead.interest] : "—"}</p>;
}

/** Internal lead list (SPEC-005). Semantic table in a focusable scroll region for small screens. */
export function LeadTable({ leads, planNames, interestLabels }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-control p-10 text-center">
        <Inbox aria-hidden="true" className="mx-auto size-8 text-ink-soft" />
        <p className="mt-3 font-semibold">Todavía no hay leads</p>
        <p className="mt-1 text-ink-soft">
          Aparecerán aquí cuando alguien envíe el formulario de contacto o el del diagnóstico.
        </p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-labelledby="leads-caption"
      tabIndex={0}
      className="overflow-x-auto rounded-card border border-line bg-paper"
    >
      <table className="w-full min-w-[56rem] text-left text-base">
        <caption id="leads-caption" className="sr-only">
          Leads recibidos, del más reciente al más antiguo
        </caption>
        <thead className="border-b border-line bg-mist text-sm text-ink-soft">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">
              Fecha
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              Contacto
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              Origen
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              Interés o plan recomendado
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              Mensaje
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {leads.map((lead) => (
            <tr key={lead.id} className="align-top">
              <td className="px-5 py-4 text-sm whitespace-nowrap text-ink-soft">
                <time dateTime={lead.createdAt}>{dateFormat.format(new Date(lead.createdAt))}</time>
              </td>
              <td className="px-5 py-4">
                <p className="font-semibold">{lead.name}</p>
                {lead.company ? <p className="text-sm text-ink-soft">{lead.company}</p> : null}
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sm text-pine-700 underline underline-offset-2"
                >
                  {lead.email}
                </a>
                {lead.phone ? <p className="text-sm text-ink-soft">{lead.phone}</p> : null}
              </td>
              <td className="px-5 py-4">
                <Badge tone={lead.source === "diagnosis" ? "brand" : "neutral"}>
                  {lead.source === "diagnosis" ? "Diagnóstico" : "Contacto"}
                </Badge>
              </td>
              <td className="px-5 py-4">
                <LeadNeed lead={lead} planNames={planNames} interestLabels={interestLabels} />
              </td>
              <td className="max-w-xs px-5 py-4 text-sm text-ink-soft">
                {lead.message ? <p className="line-clamp-3">{lead.message}</p> : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
