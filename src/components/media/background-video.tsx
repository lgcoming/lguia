"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface BackgroundVideoProps {
  src: string;
  /** First frame of the video, shown immediately and as the only visual on mobile. */
  poster: string;
  /** Above the fold: fetch the poster with high priority (it may be the LCP element). */
  eager?: boolean;
  /** Below the fold: only attach the video source once the band is near the viewport. */
  lazy?: boolean;
}

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

/** Desktop, motion allowed and no Save-Data: the only case where a 5 MB video is worth it. */
function canPlayVideo(): boolean {
  const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
  return (
    !saveData &&
    window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches
  );
}

/**
 * Decorative background video (SPEC-002 v2). Server-rendered as a poster image; the video is
 * attached after hydration only when it makes sense, plays only while visible and can be paused
 * (WCAG 2.2.2: moving content longer than five seconds needs a pause control).
 */
export function BackgroundVideo({
  src,
  poster,
  eager = false,
  lazy = false,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [near, setNear] = useState(!lazy);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedByUser = useRef(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(canPlayVideo());
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Lazy bands: wait until the band approaches the viewport before downloading anything.
  useEffect(() => {
    if (!enabled || near) return;
    const container = videoRef.current?.parentElement;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [enabled, near]);

  // Play only while on screen, unless the user paused it.
  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !near || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pausedByUser.current) {
          video.play().catch(() => setPaused(true));
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [enabled, near]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      video.play().catch(() => setPaused(true));
    } else {
      pausedByUser.current = true;
      video.pause();
    }
  }

  return (
    <>
      <Image
        src={poster}
        alt=""
        fill
        sizes="100vw"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className="object-cover"
      />
      {enabled ? (
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src={near ? src : undefined}
            muted
            loop
            playsInline
            preload={near ? "auto" : "none"}
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setReady(true)}
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
            className={cn(
              "size-full object-cover transition-opacity duration-700 ease-out",
              ready ? "opacity-100" : "opacity-0",
            )}
          />
          {ready ? (
            <button
              type="button"
              onClick={togglePlayback}
              className="glass-panel absolute right-4 bottom-4 z-20 inline-flex size-11 items-center justify-center rounded-full text-pure-white transition-colors duration-200 hover:bg-pure-white/20 md:right-8 md:bottom-8"
            >
              {paused ? (
                <Play aria-hidden="true" className="size-4 fill-current" />
              ) : (
                <Pause aria-hidden="true" className="size-4 fill-current" />
              )}
              <span className="sr-only">
                {paused ? "Reproducir vídeo de fondo" : "Pausar vídeo de fondo"}
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
