import { describe, expect, it } from "vitest";

import { GET as getPlans } from "@/app/api/plans/route";
import { GET as getServices } from "@/app/api/services/route";

const request = (path: string) => new Request(`http://localhost${path}`);

describe("catalog endpoints", () => {
  it("GET /api/services returns the four service categories", async () => {
    const response = await getServices(request("/api/services"));
    expect(response.status).toBe(200);

    const { data } = await response.json();
    expect(data.map((category: { id: string }) => category.id)).toEqual([
      "desarrollo-web",
      "automatizaciones",
      "chatbots-ia",
      "seo-geo",
    ]);
    expect(data[0].services.length).toBeGreaterThan(0);
    expect(data[0].name).toBe("Desarrollo web a medida");
  });

  it("GET /api/plans returns the six plans with structured pricing", async () => {
    const response = await getPlans(request("/api/plans"));
    expect(response.status).toBe(200);

    const { data } = await response.json();
    expect(data).toHaveLength(6);
    expect(data.find((plan: { id: string }) => plan.id === "custom-enterprise").pricing).toEqual({
      kind: "custom",
      label: "A medida",
    });
  });

  it("serves the catalog in English with ?locale=en and falls back to Spanish otherwise", async () => {
    const english = await (await getServices(request("/api/services?locale=en"))).json();
    expect(english.data[0].name).toBe("Custom web development");

    const plans = await (await getPlans(request("/api/plans?locale=en"))).json();
    expect(
      plans.data.find((plan: { id: string }) => plan.id === "custom-enterprise").pricing.label,
    ).toBe("Custom quote");

    const unknown = await (await getServices(request("/api/services?locale=fr"))).json();
    expect(unknown.data[0].name).toBe("Desarrollo web a medida");
  });
});
