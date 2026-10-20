import { cn } from "@/lib/utils";

/** A numbered step marker for real sequences (process, next steps). Decorative. */
export function StepNumber({
  value,
  tone = "light",
  className,
}: {
  value: number;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-footnote font-semibold tabular",
        tone === "dark" ? "bg-pure-white text-carbon" : "bg-obsidian text-pure-white",
        className,
      )}
    >
      {value}
    </span>
  );
}
