import { Badge } from "@/components/ui/badge";

export interface DiagnosisPreviewData {
  caption: string;
  /** Interface labels in the page's language. */
  labels: { label: string; title: string; recommended: string; today: string; points: string };
  score: number;
  levelLabel: string;
  areas: { id: string; label: string; score: number }[];
  planName: string;
}

/**
 * A real diagnosis result for an example business, drawn with HTML and CSS on dark glass:
 * the "product shot" of the diagnosis. CSS-only animation, no JavaScript.
 */
export function DiagnosisPreview({ data }: { data: DiagnosisPreviewData }) {
  return (
    <figure
      aria-label={data.labels.label}
      className="glass-panel rounded-tile p-6 text-left sm:p-8"
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-footnote font-semibold">{data.labels.title}</span>
        <Badge tone="glass">{data.caption}</Badge>
      </figcaption>

      <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
        <p className="leading-none">
          <span className="text-[3.5rem] font-semibold tracking-[-0.03em] tabular sm:text-[4.5rem]">
            {data.score}
          </span>
          <span className="ml-1 text-body text-ash-veil">/100</span>
        </p>
        <Badge tone="inverse" className="mb-2">
          {data.levelLabel}
        </Badge>
      </div>

      <ul className="mt-7 space-y-4">
        {data.areas.map((area, index) => (
          <li key={area.id}>
            <div className="flex items-baseline justify-between text-footnote">
              <span className="text-ash-veil">{area.label}</span>
              <span className="font-semibold tabular">{area.score}</span>
            </div>
            <div
              aria-hidden="true"
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-pure-white/15"
            >
              <div
                className="h-full origin-left animate-bar-grow rounded-full bg-pure-white"
                style={{ width: `${area.score}%`, animationDelay: `${0.35 + index * 0.12}s` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-pure-white/10 pt-6">
        <p>
          <span className="block text-caption text-ash-veil">{data.labels.recommended}</span>
          <span className="mt-1 block text-subheading font-semibold">{data.planName}</span>
        </p>
        <p className="text-right">
          <span className="block text-caption text-ash-veil">{data.labels.today}</span>
          <span className="mt-1 block text-footnote font-semibold tabular">
            {data.labels.points}
          </span>
        </p>
      </div>
    </figure>
  );
}
