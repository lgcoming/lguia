import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl, PRODUCTION_ORIGIN } from "@/lib/site";

describe("getSiteUrl", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("prefers an explicit NEXT_PUBLIC_SITE_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
    vi.stubEnv("NODE_ENV", "production");
    expect(getSiteUrl().origin).toBe("https://example.test");
  });

  it("uses lguia.com for production builds", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(getSiteUrl().origin).toBe(PRODUCTION_ORIGIN);
  });

  it("uses localhost in development", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(getSiteUrl().origin).toBe("http://localhost:3000");
  });
});
