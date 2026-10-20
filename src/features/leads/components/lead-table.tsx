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
        <p className="text-footnote text-pewter">
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
      <div className="rounded-tile bg-pure-white p-10 text-center">
        <Inbox aria-hidden="true" className="mx-auto size-8 text-pewter" strokeWidth={1.5} />
        <p className="mt-3 font-semibold">Todavía no hay leads</p>
        <p className="mt-1 text-pewter">
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
      className="overflow-x-auto rounded-tile bg-pure-white"
    >
      <table className="w-full min-w-[56rem] text-left text-footnote">
        <caption id="leads-caption" className="sr-only">
          Leads recibidos, del más reciente al más antiguo
        </caption>
        <thead className="border-b border-pale-mist text-caption text-pewter">
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
        <tbody className="divide-y divide-pale-mist">
          {leads.map((lead) => (
            <tr key={lead.id} className="align-top">
              <td className="px-5 py-4 whitespace-nowrap text-pewter">
                <time dateTime={lead.createdAt}>{dateFormat.format(new Date(lead.createdAt))}</time>
              </td>
              <td className="px-5 py-4">
                <p className="font-semibold">{lead.name}</p>
                {lead.company ? <p className="text-pewter">{lead.company}</p> : null}
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sapphire underline-offset-2 hover:underline"
                >
                  {lead.email}
                </a>
                {lead.phone ? <p className="text-pewter">{lead.phone}</p> : null}
              </td>
              <td className="px-5 py-4">
                <Badge tone={lead.source === "diagnosis" ? "strong" : "neutral"}>
                  {lead.source === "diagnosis" ? "Diagnóstico" : "Contacto"}
                </Badge>
              </td>
              <td className="px-5 py-4">
                <LeadNeed lead={lead} planNames={planNames} interestLabels={interestLabels} />
              </td>
              <td className="max-w-xs px-5 py-4 text-pewter">
                {lead.message ? <p className="line-clamp-3">{lead.message}</p> : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
