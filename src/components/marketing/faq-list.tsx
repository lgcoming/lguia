import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Faq } from "@/types/catalog";

/**
 * Native <details> disclosure inside a tile: keyboard and screen-reader support without
 * JavaScript. Hairlines separate rows inside the tile only.
 */
export function FaqList({
  faqs,
  tone = "white",
}: {
  faqs: Faq[];
  /** White on the fog canvas; fog ("canvas") on white sections. */
  tone?: "white" | "canvas";
}) {
  return (
    <div
      className={cn(
        "divide-y divide-pale-mist rounded-tile px-6 md:px-9",
        tone === "white" ? "bg-pure-white" : "bg-fog-white",
      )}
    >
      {faqs.map((faq) => (
        <details key={faq.question} className="group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-body font-semibold transition-colors duration-200 ease-out hover:text-sapphire md:text-subheading [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span
              aria-hidden="true"
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-obsidian transition-transform duration-300 ease-out group-open:rotate-45",
                tone === "white" ? "bg-fog-white" : "bg-pure-white",
              )}
            >
              <Plus className="size-4" strokeWidth={2} />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 text-body text-pewter">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
