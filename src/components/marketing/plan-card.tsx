import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatEuro } from "@/features/catalog/format";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types/catalog";

interface PlanCardProps {
  plan: Plan;
  cta?: { href: string; label: string };
  className?: string;
}

export function PlanCard({
  plan,
  cta = { href: "/contacto", label: "Pedir propuesta" },
  className,
}: PlanCardProps) {
  const highlighted = Boolean(plan.highlight);

  return (
    <article
      id={plan.id}
      aria-labelledby={`${plan.id}-name`}
      className={cn(
        "relative flex h-full scroll-mt-28 flex-col rounded-card border bg-paper p-6 md:p-7",
        highlighted ? "border-pine-700 shadow-lift" : "border-line",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 id={`${plan.id}-name`} className="text-h4">
          {plan.name}
        </h3>
        {plan.highlight ? <Badge tone="signal">{plan.highlight}</Badge> : null}
      </div>
      <p className="mt-2 text-ink-soft">{plan.tagline}</p>

      <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
        {plan.pricing.kind === "from" ? (
          <>
            <span className="text-base text-ink-soft">Desde</span>
            <span className="text-h3 font-bold tabular">{formatEuro(plan.pricing.amount)}</span>
            <span className="text-sm text-ink-soft">sin IVA</span>
          </>
        ) : (
          <span className="text-h3 font-bold">{plan.pricing.label}</span>
        )}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-ink-soft">Plazo orientativo</dt>
          <dd className="mt-1 font-semibold">{plan.timeline}</dd>
        </div>
        <div>
          <dt className="text-ink-soft">Ideal para</dt>
          <dd className="mt-1 font-semibold">{plan.idealFor}</dd>
        </div>
      </dl>

      <ul className="mt-6 space-y-3 border-t border-line pt-6 text-base">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-pine-700" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <ButtonLink
          href={cta.href}
          variant={highlighted ? "primary" : "secondary"}
          className="w-full"
        >
          {cta.label}
          <span className="sr-only">: {plan.name}</span>
        </ButtonLink>
      </div>
    </article>
  );
}
