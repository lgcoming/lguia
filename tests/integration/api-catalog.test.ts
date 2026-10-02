import { describe, expect, it } from "vitest";

import { GET as getPlans } from "@/app/api/plans/route";
import { GET as getServices } from "@/app/api/services/route";

describe("catalog endpoints", () => {
  it("GET /api/services returns the four service categories", async () => {
    const response = await getServices();
    expect(response.status).toBe(200);

    const { data } = await response.json();
    expect(data.map((category: { id: string }) => category.id)).toEqual([
      "desarrollo-web",
      "automatizaciones",
      "chatbots-ia",
      "seo-geo",
    ]);
    expect(data[0].services.length).toBeGreaterThan(0);
  });

  it("GET /api/plans returns the six plans with structured pricing", async () => {
    const response = await getPlans();
    expect(response.status).toBe(200);

    const { data } = await response.json();
    expect(data).toHaveLength(6);
    expect(data.find((plan: { id: string }) => plan.id === "custom-enterprise").pricing).toEqual({
      kind: "custom",
      label: "A medida",
    });
  });
});
