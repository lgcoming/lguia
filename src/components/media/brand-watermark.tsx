import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The compass mark as a faint watermark on dark surfaces. Purely decorative: the caller
 * positions and sizes it (the parent needs `relative isolate overflow-hidden`).
 */
export function BrandWatermark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/lguia-mark.png"
      alt=""
      width={512}
      height={512}
      className={cn("pointer-events-none absolute -z-10 select-none", className)}
    />
  );
}
