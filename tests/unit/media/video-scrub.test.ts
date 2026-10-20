import { describe, expect, it } from "vitest";

import { progressToTime } from "@/components/media/use-video-scrub";

describe("progressToTime", () => {
  it("maps scroll progress linearly onto the video, stopping one frame before the end", () => {
    expect(progressToTime(0, 9.6)).toBe(0);
    expect(progressToTime(0.5, 9.6)).toBeCloseTo((9.6 - 1 / 24) / 2);
    expect(progressToTime(1, 9.6)).toBeCloseTo(9.6 - 1 / 24);
  });

  it("clamps progress outside 0–1 (spring overshoot, elastic scrolling)", () => {
    expect(progressToTime(-0.2, 8)).toBe(0);
    expect(progressToTime(1.3, 8)).toBeCloseTo(8 - 1 / 24);
  });

  it("returns 0 while the duration is unknown", () => {
    expect(progressToTime(0.5, Number.NaN)).toBe(0);
    expect(progressToTime(0.5, 0)).toBe(0);
    expect(progressToTime(0.5, Number.POSITIVE_INFINITY)).toBe(0);
  });
});
