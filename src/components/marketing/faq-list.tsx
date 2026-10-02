import { Plus } from "lucide-react";

import type { Faq } from "@/types/catalog";

/** Native <details> disclosure: keyboard and screen-reader support without JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="group">
          <summary className="flex min-h-16 list-none items-center justify-between gap-6 py-4 text-h4 font-semibold [&::-webkit-details-marker]:hidden">
            {faq.question}
            <Plus
              aria-hidden="true"
              className="size-5 shrink-0 text-pine-700 transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="max-w-3xl pb-6 text-ink-soft">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
