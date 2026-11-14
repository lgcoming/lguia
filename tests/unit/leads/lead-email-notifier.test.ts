import { describe, expect, it } from "vitest";

import { normalizeAddress } from "@/lib/cloudflare/lead-email-notifier";

describe("normalizeAddress", () => {
  it("keeps only the address from a hand-typed secret", () => {
    expect(normalizeAddress("ana@empresa.test")).toBe("ana@empresa.test");
    expect(normalizeAddress('  "ana@empresa.test"\r\n')).toBe("ana@empresa.test");
    expect(normalizeAddress("Ana <ana@empresa.test>")).toBe("ana@empresa.test");
  });

  it("rejects values that are not an address", () => {
    expect(normalizeAddress(undefined)).toBeUndefined();
    expect(normalizeAddress("ana empresa")).toBeUndefined();
  });
});
