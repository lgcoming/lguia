import Image from "next/image";
import type { ReactNode } from "react";

import { BackgroundVideo } from "@/components/media/background-video";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { cn } from "@/lib/utils";

type Overlay = "hero" | "band" | "soft";

/*
 * Overlays keep white text at ≥ 4.5:1 over the brightest regions of the footage (SPEC-002 v2
 * AC2). `hero` darkens the centre where the headline sits; `band` is uniform; `soft` is for
 * bands where text sits on glass panels.
 */
const overlayClasses: Record<Overlay, string> = {
  hero: "bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.66)_0%,rgb(0_0_0/0.64)_55%,rgb(0_0_0/0.78)_100%)]",
  band: "bg-carbon/70",
  soft: "bg-linear-to-b from-carbon/70 via-carbon/60 to-carbon/80",
};

interface MediaBandProps {
  id?: string;
  labelledBy?: string;
  image?: string;
  /** Focal point of the photograph, as a literal `object-*` class. */
  imagePosition?: string;
  /** A looping background video; `labels` name its pause control in the page's language. */
  video?: { src: string; poster: string; labels: { pause: string; play: string } };
  /** Above the fold (hero): load the poster/image eagerly with high priority. */
  eager?: boolean;
  overlay?: Overlay;
  className?: string;
  children: ReactNode;
}

/** Full-bleed dark band with photography or video behind its content. */
export function MediaBand({
  id,
  labelledBy,
  image,
  imagePosition = "object-center",
  video,
  eager = false,
  overlay = "band",
  className,
  children,
}: MediaBandProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-nav-theme="dark"
      className={cn(
        "surface-dark relative isolate overflow-hidden bg-carbon text-pure-white",
        className,
      )}
    >
      {/* No z-index here: the video pause button (z-20) must stay above the content (z-10). */}
      <div aria-hidden={video ? undefined : true} className="absolute inset-0">
        {video ? (
          <BackgroundVideo
            src={video.src}
            poster={video.poster}
            labels={video.labels}
            eager={eager}
            lazy={!eager}
            parallax={!eager}
          />
        ) : image ? (
          eager ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className={cn("object-cover", imagePosition)}
            />
          ) : (
            // Mid-page bands drift slightly slower than the content (subtle parallax).
            <ParallaxLayer>
              <Image
                src={image}
                alt=""
                fill
                sizes="100vw"
                className={cn("object-cover", imagePosition)}
              />
            </ParallaxLayer>
          )
        ) : null}
        <div className={cn("pointer-events-none absolute inset-0", overlayClasses[overlay])} />
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
