"use client";

import type { MotionValue } from "motion/react";
import { useEffect, type RefObject } from "react";

/** Maps scroll progress (0–1) to a playback position, stopping one frame before the end. */
export function progressToTime(progress: number, duration: number, frameRate = 24): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return clamped * Math.max(0, duration - 1 / frameRate);
}

/**
 * Drives `video.currentTime` from a (smoothed) progress value. Seeks are coalesced to one per
 * animation frame and never stacked: while the decoder is busy the latest target is kept and
 * applied on `seeked`, so fast scrolling drops intermediate frames instead of queueing them.
 */
export function useVideoScrub(
  videoRef: RefObject<HTMLVideoElement | null>,
  progress: MotionValue<number>,
  enabled: boolean,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !video) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      if (video.seeking || video.readyState < HTMLMediaElement.HAVE_METADATA) return;
      const time = progressToTime(progress.get(), video.duration);
      // Below half a frame the picture would not change: skip the decoder work.
      if (Math.abs(video.currentTime - time) > 1 / 48) video.currentTime = time;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const unsubscribe = progress.on("change", schedule);
    video.addEventListener("seeked", schedule);
    video.addEventListener("loadedmetadata", schedule);
    schedule();
    return () => {
      unsubscribe();
      video.removeEventListener("seeked", schedule);
      video.removeEventListener("loadedmetadata", schedule);
      cancelAnimationFrame(frame);
    };
  }, [videoRef, progress, enabled]);
}
