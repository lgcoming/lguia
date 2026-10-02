import { describe, expect, it } from "vitest";

import { contactLeadSchema, emailSchema, LEAD_MESSAGES } from "@/features/leads/schema";
import { issuesToFieldErrors, toApiIssues } from "@/lib/validation";

const validContact = {
  source: "contact",
  name: "Marta López",
  email: "marta@clinicadental.es",
  company: "Clínica Dental Sonrisa",
  phone: "+34 612 345 678",
  interest: "chatbots-ia",
  message: "Queremos un asistente que responda las dudas de los pacientes.",
  consent: true,
  website: "",
};

function fieldErrorsFor(input: unknown) {
  const result = contactLeadSchema.safeParse(input);
  if (result.success) return {};
  return issuesToFieldErrors(toApiIssues(result.error));
}

describe("emailSchema", () => {
  it.each(["ana@empresa.com", "  Ana.Garcia+web@Empresa.ES  ", "info@sub.dominio.com"])(
    "accepts %s",
    (email) => {
      expect(emailSchema.safeParse(email).success).toBe(true);
    },
  );

  it("normalizes whitespace and case", () => {
    expect(emailSchema.parse("  Ana@Empresa.COM ")).toBe("ana@empresa.com");
  });

  it.each(["", "ana", "ana@", "@empresa.com", "ana@empresa", "ana empresa@x.com"])(
    "rejects %j",
    (email) => {
      const result = emailSchema.safeParse(email);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe(LEAD_MESSAGES.email);
    },
  );
});

describe("contactLeadSchema", () => {
  it("accepts a complete contact lead and trims values", () => {
    const result = contactLeadSchema.parse({ ...validContact, name: "  Marta López  " });
    expect(result.name).toBe("Marta López");
    expect(result.interest).toBe("chatbots-ia");
  });

  it("treats empty optional fields as missing", () => {
    const result = contactLeadSchema.parse({ ...validContact, company: " ", phone: "" });
    expect(result.company).toBeUndefined();
    expect(result.phone).toBeUndefined();
  });

  it("reports every invalid field with its message", () => {
    const errors = fieldErrorsFor({
      ...validContact,
      name: "M",
      email: "marta@",
      message: "Hola",
      consent: false,
    });

    expect(errors).toEqual({
      name: LEAD_MESSAGES.name,
      email: LEAD_MESSAGES.email,
      message: LEAD_MESSAGES.message,
      consent: LEAD_MESSAGES.consent,
    });
  });

  it("requires name, email, message and consent", () => {
    const errors = fieldErrorsFor({ source: "contact", interest: "general" });
    expect(Object.keys(errors).sort()).toEqual(["consent", "email", "message", "name"]);
  });

  it.each(["123", "abc 123 456 789", "+34 6123456789012345"])("rejects phone %j", (phone) => {
    expect(fieldErrorsFor({ ...validContact, phone }).phone).toBe(LEAD_MESSAGES.phone);
  });

  it("rejects an unknown interest", () => {
    expect(fieldErrorsFor({ ...validContact, interest: "blockchain" }).interest).toBe(
      LEAD_MESSAGES.interest,
    );
  });
});
