import { describe, expect, it } from "vitest";

import { isAdminEnabled } from "@/lib/admin-access";

const env = (values: Record<string, string>) => values as unknown as NodeJS.ProcessEnv;

describe("isAdminEnabled", () => {
  it("is open in development and closed in production unless a demo opts in", () => {
    expect(isAdminEnabled(env({ NODE_ENV: "development" }), "Node.js")).toBe(true);
    expect(isAdminEnabled(env({ NODE_ENV: "production" }), "Node.js")).toBe(false);
    expect(
      isAdminEnabled(env({ NODE_ENV: "production", ENABLE_DEMO_ADMIN: "true" }), "Node.js"),
    ).toBe(true);
  });

  it("stays closed on Cloudflare Workers even with the demo flag", () => {
    expect(
      isAdminEnabled(
        env({ NODE_ENV: "production", ENABLE_DEMO_ADMIN: "true" }),
        "Cloudflare-Workers",
      ),
    ).toBe(false);
  });
});
