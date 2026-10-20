"use client";

import { useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useVideoScrub } from "@/components/media/use-video-scrub";
import { cn } from "@/lib/utils";
import { SCROLL_EFFECTS_QUERY, useMediaQuery } from "@/lib/use-media-query";

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

/*
 * Choreography on the smoothed scroll progress of the pinned track (0 → 1):
 *   0.00–0.22  opening stack holds, footage starts moving
 *   0.22–0.38  opening stack lifts and fades; the overlay thins so the footage takes over
 *   0.62–0.74  the overlay closes again …
 *   0.72–0.86  … and the closing line rises in, on a dark enough ground for its contrast
 * The overlay is never thinned while text is on screen (SPEC-002 AC2).
 */
const COPY = { input: [0, 0.22, 0.38], opacity: [1, 1, 0], y: [0, 0, -56], scale: [1, 1, 0.97] };
const OVERLAY = { input: [0, 0.3, 0.45, 0.62, 0.74], opacity: [1, 1, 0.55, 0.55, 1] };
const OUTRO = { input: [0.72, 0.86], opacity: [0, 1], y: [28, 0] };

/** Inertia: the picture eases after the scroll position instead of jumping frame to frame. */
const SMOOTHING = { stiffness: 170, damping: 30, mass: 0.45, restDelta: 0.0001 };

interface ScrollVideoHeroProps {
  labelledBy: string;
  video: { src: string; poster: string };
  /** Opening stack (h1, subhead, actions). Rendered as normal content everywhere. */
  children: ReactNode;
  /** Closing line revealed at the end of the scrub (pinned mode only). */
  outro?: ReactNode;
}

/**
 * Apple-style product hero: on wide screens with motion allowed the section is a tall track
 * whose stage stays pinned (CSS `sticky`) while scrolling scrubs the footage. Elsewhere — small
 * screens, reduced motion, no JavaScript — it is a regular full-viewport hero on the poster.
 * The pinned layout is decided in CSS so server and client markup never disagree.
 */
export function ScrollVideoHero({ labelledBy, video, children, outro }: ScrollVideoHeroProps) {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pinned = useMediaQuery(SCROLL_EFFECTS_QUERY);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, SMOOTHING);

  const copyOpacity = useTransform(progress, COPY.input, COPY.opacity);
  const copyY = useTransform(progress, COPY.input, COPY.y);
  const copyScale = useTransform(progress, COPY.input, COPY.scale);
  const overlayOpacity = useTransform(progress, OVERLAY.input, OVERLAY.opacity);
  const outroOpacity = useTransform(progress, OUTRO.input, OUTRO.opacity);
  const outroY = useTransform(progress, OUTRO.input, OUTRO.y);
  const mediaScale = useTransform(progress, [0, 1], [1.08, 1]);

  // Fetch the whole file once into memory: seeking a blob never waits on the network, which
  // is what keeps scrubbing smooth. Started after `load` so it never competes with the page.
  useEffect(() => {
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    if (!pinned || saveData) return;
    const controller = new AbortController();
    let objectUrl: string | undefined;
    const start = () => {
      fetch(video.src, { signal: controller.signal })
        .then((response) => (response.ok ? response.blob() : Promise.reject(response.status)))
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob);
          setVideoUrl(objectUrl);
        })
        .catch(() => {
          // The poster stays: same first frame, still a complete hero.
        });
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pinned, video.src]);

  useVideoScrub(videoRef, progress, pinned && videoUrl !== null);

  return (
    <section
      ref={trackRef}
      aria-labelledby={labelledBy}
      data-nav-theme="dark"
      data-scroll-track=""
      className="surface-dark relative -mt-(--header-height) bg-carbon text-pure-white md:motion-safe:h-[300svh]"
    >
      <div
        data-scroll-stage=""
        className="relative isolate flex min-h-[max(38rem,100svh)] items-center overflow-hidden md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:h-svh"
      >
        <m.div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={pinned ? { scale: mediaScale } : undefined}
        >
          {/* The poster is the first frame of the encoded video, so the swap is invisible. */}
          <Image
            src={video.poster}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
          {pinned && videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
              onLoadedData={() => setReady(true)}
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-500 ease-out",
                ready ? "opacity-100" : "opacity-0",
              )}
            />
          ) : null}
        </m.div>
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.66)_0%,rgb(0_0_0/0.64)_55%,rgb(0_0_0/0.78)_100%)]"
          style={pinned ? { opacity: overlayOpacity } : undefined}
        />

        <m.div
          data-hero-copy=""
          className="relative z-10 w-full"
          style={pinned ? { opacity: copyOpacity, y: copyY, scale: copyScale } : undefined}
        >
          {children}
        </m.div>

        {outro ? (
          <m.div
            data-hero-outro=""
            className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center md:motion-safe:flex"
            style={pinned ? { opacity: outroOpacity, y: outroY } : { opacity: 0 }}
          >
            {outro}
          </m.div>
        ) : null}
      </div>
    </section>
  );
}
