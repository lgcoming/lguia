import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatEuro } from "@/features/catalog/format";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref } from "@/i18n/routes";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types/catalog";

interface PlanCardProps {
  plan: Plan;
  locale: Locale;
  /** White tiles sit on the fog canvas; on white sections use the fog tone. */
  tone?: "white" | "canvas";
  className?: string;
}

/**
 * Plan as an Apple-style tile: no border, no shadow. The highlighted plan is told apart by its
 * badge and the only filled (primary) button in the row.
 */
export function PlanCard({ plan, locale, tone = "white", className }: PlanCardProps) {
  const t = getDictionary(locale);
  const highlighted = Boolean(plan.highlight);

  return (
    <article
      id={plan.id}
      aria-labelledby={`${plan.id}-name`}
      className={cn(
        "tile-hover flex h-full scroll-mt-24 flex-col rounded-tile p-7 md:p-8",
        tone === "white" ? "bg-pure-white" : "bg-fog-white",
        className,
      )}
    >
      <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
        <h3 id={`${plan.id}-name`} className="text-heading-sm">
          {plan.name}
        </h3>
        {plan.highlight ? <Badge tone="strong">{plan.highlight}</Badge> : null}
      </div>
      <p className="mt-2 text-footnote text-pewter">{plan.tagline}</p>

      <p className="mt-7 flex flex-wrap items-baseline gap-x-2">
        {plan.pricing.kind === "from" ? (
          <>
            <span className="text-footnote text-pewter">{t.planCard.from}</span>
            <span className="text-heading-lg font-semibold tabular">
              {formatEuro(plan.pricing.amount, locale)}
            </span>
            <span className="text-caption text-pewter">{t.planCard.vatExcluded}</span>
          </>
        ) : (
          <span className="text-heading-lg font-semibold">{plan.pricing.label}</span>
        )}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-footnote">
        <div>
          <dt className="text-pewter">{t.planCard.timeline}</dt>
          <dd className="mt-1 font-semibold">{plan.timeline}</dd>
        </div>
        <div>
          <dt className="text-pewter">{t.planCard.idealFor}</dt>
          <dd className="mt-1 font-semibold">{plan.idealFor}</dd>
        </div>
      </dl>

      <ul className="mt-7 space-y-3 text-footnote">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-obsidian" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <ButtonLink
          href={pageHref(locale, "contact")}
          variant={highlighted ? "primary" : "secondary"}
          className="w-full"
        >
          {t.common.proposalCta}
          <span className="sr-only">: {plan.name}</span>
        </ButtonLink>
      </div>
    </article>
  );
}
