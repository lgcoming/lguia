import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl, PRODUCTION_ORIGIN } from "@/lib/site";

describe("getSiteUrl", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("prefers an explicit NEXT_PUBLIC_SITE_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(getSiteUrl().origin).toBe("https://example.test");
  });

  it("uses lguia.com on Vercel production, never the vercel.app alias", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_URL", "lguia-abc123.vercel.app");
    expect(getSiteUrl().origin).toBe(PRODUCTION_ORIGIN);
  });

  it("uses the deployment URL on previews and localhost elsewhere", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "lguia-abc123.vercel.app");
    expect(getSiteUrl().origin).toBe("https://lguia-abc123.vercel.app");

    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("VERCEL_URL", "");
    expect(getSiteUrl().origin).toBe("http://localhost:3000");
  });
});
