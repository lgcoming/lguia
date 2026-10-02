import { RouteStop } from "@/components/ui/route";
import type { ProcessStep } from "@/types/catalog";

/** The work process drawn on the route line: vertical on mobile, horizontal from md. */
export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-8 md:grid-cols-5 md:gap-6">
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-4 md:flex-col md:gap-0">
          {index < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute top-9 -bottom-8 left-[17px] w-0.5 bg-pine-100 md:top-[17px] md:right-[-1.5rem] md:bottom-auto md:left-9 md:h-0.5 md:w-auto"
            />
          ) : null}
          {/* The first stop is amber: it is where every project starts. */}
          <RouteStop state={index === 0 ? "current" : "done"}>{index + 1}</RouteStop>
          <div className="md:mt-5">
            <h3 className="text-h4">{step.title}</h3>
            <p className="mt-2 text-ink-soft">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
