import { describe, expect, it, vi } from "vitest";

import { getLeadSchemas } from "@/features/leads/content";
import { formatLeadEmail } from "@/features/leads/lead-notifier";
import { createInMemoryLeadRepository } from "@/features/leads/lead-repository";
import { submitLead } from "@/features/leads/lead-service";
import { LOGO_MAX_BYTES } from "@/features/leads/prototype-options";

const { prototypeLeadSchema, leadInputSchema } = getLeadSchemas("es");

const PNG = Buffer.from("fake-png-bytes").toString("base64");

const valid = {
  source: "prototype",
  name: "Ana Ruiz",
  email: "ana@floristeria.test",
  company: "Floristería Ruiz",
  projectType: "redesign",
  currentSite: "floristeriaruiz.es",
  business: "Floristería de barrio con entregas a domicilio y ramos para bodas.",
  goal: "sales",
  styles: ["warm", "premium"],
  palette: "custom",
  colors: ["#2e7d32", "#f8bbd0"],
  tone: "light",
  sections: ["home", "shop", "contact"],
  references: "https://ejemplo.test — me gustan sus fotos grandes",
  logo: { name: "logo.png", type: "image/png", data: PNG },
  consent: true,
};

function fieldOf(input: unknown): string[] {
  const result = prototypeLeadSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
}

describe("prototype request validation", () => {
  it("accepts a complete brief and normalises the website", () => {
    const result = leadInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success && result.data.source === "prototype") {
      expect(result.data.currentSite).toBe("https://floristeriaruiz.es");
    }
  });

  it("asks for the current website only for a redesign", () => {
    expect(fieldOf({ ...valid, currentSite: "" })).toContain("currentSite");
    expect(fieldOf({ ...valid, projectType: "new", currentSite: "" })).toEqual([]);
    expect(fieldOf({ ...valid, currentSite: "no es una web" })).toContain("currentSite");
  });

  it("needs 1 to 3 styles and colours only for a custom palette", () => {
    expect(fieldOf({ ...valid, styles: [] })).toContain("styles");
    expect(fieldOf({ ...valid, styles: ["minimal", "bold", "warm", "premium"] })).toContain(
      "styles",
    );
    expect(fieldOf({ ...valid, colors: [] })).toContain("colors");
    expect(fieldOf({ ...valid, palette: "suggest", colors: [] })).toEqual([]);
    expect(fieldOf({ ...valid, colors: ["red"] })).toContain("colors.0");
  });

  it("rejects logos of the wrong type or over 3 MB", () => {
    expect(fieldOf({ ...valid, logo: { ...valid.logo, type: "application/zip" } })).toContain(
      "logo.type",
    );
    const tooBig = "A".repeat(Math.ceil((LOGO_MAX_BYTES + 3) / 3) * 4 + 4);
    expect(fieldOf({ ...valid, logo: { ...valid.logo, data: tooBig } })).toContain("logo.data");
    expect(fieldOf({ ...valid, logo: undefined })).toEqual([]);
  });
});

describe("prototype request lead", () => {
  it("stores the brief without the file and emails the logo as an attachment", async () => {
    const repository = createInMemoryLeadRepository();
    const notify = vi.fn(async () => {});
    const input = leadInputSchema.parse(valid);

    await submitLead(input, { repository, notifier: { notify }, createId: () => "proto-1" });

    const [lead] = await repository.list();
    expect(lead.source).toBe("prototype");
    expect(lead.prototype).toMatchObject({
      projectType: "redesign",
      currentSite: "https://floristeriaruiz.es",
      styles: ["warm", "premium"],
      colors: ["#2e7d32", "#f8bbd0"],
      logoName: "logo.png",
    });
    expect(JSON.stringify(lead)).not.toContain(PNG);
    expect(notify).toHaveBeenCalledWith(lead, [
      { filename: "logo.png", type: "image/png", data: PNG },
    ]);

    const { subject, text } = formatLeadEmail(lead);
    expect(subject).toContain("Prototipo web gratis");
    expect(text).toContain("Proyecto: Rediseño de su web actual");
    expect(text).toContain("Estilo: Cercano, Premium");
    expect(text).toContain("Colores: #2e7d32, #f8bbd0");
    expect(text).toContain("Logo: logo.png (adjunto)");
  });

  it("drops colours when the visitor asks us to suggest a palette", async () => {
    const repository = createInMemoryLeadRepository();
    const input = leadInputSchema.parse({ ...valid, palette: "suggest", logo: undefined });
    await submitLead(input, { repository });
    const [lead] = await repository.list();
    expect(lead.prototype?.colors).toEqual([]);
    expect(formatLeadEmail(lead).text).toContain("Logo: no enviado");
  });
});
