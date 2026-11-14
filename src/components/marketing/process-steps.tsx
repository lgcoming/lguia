import { RevealItem, RevealList } from "@/components/motion/reveal";
import { StepNumber } from "@/components/ui/step-number";
import { cn } from "@/lib/utils";
import type { ProcessStep } from "@/types/catalog";

/**
 * The work process as five numbered panels: dark glass over the process video, or white
 * tiles on light pages. Five columns from lg; two on tablets with the last one full width.
 */
export function ProcessSteps({
  steps,
  tone = "light",
}: {
  steps: ProcessStep[];
  tone?: "light" | "dark";
}) {
  return (
    <RevealList as="ol" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, index) => (
        <RevealItem
          key={step.title}
          className={cn(
            "flex flex-col p-6 last:sm:col-span-2 last:lg:col-span-1",
            tone === "dark" ? "glass-panel rounded-[1.25rem]" : "rounded-tile bg-pure-white",
          )}
        >
          <StepNumber value={index + 1} tone={tone} />
          <h3 className="mt-5 text-subheading font-semibold">{step.title}</h3>
          <p
            className={cn("mt-2 text-footnote", tone === "dark" ? "text-ash-veil" : "text-pewter")}
          >
            {step.description}
          </p>
        </RevealItem>
      ))}
    </RevealList>
  );
}
