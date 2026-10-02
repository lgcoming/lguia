import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/features/leads/components/contact-form";

const interestOptions = [
  { value: "general", label: "Todavía no lo sé, quiero orientación" },
  { value: "desarrollo-web", label: "Desarrollo web" },
];

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nombre"), "Marta López");
  await user.type(screen.getByLabelText("Email"), "marta@clinica.test");
  await user.selectOptions(screen.getByLabelText("¿En qué podemos ayudarte?"), "desarrollo-web");
  await user.type(
    screen.getByLabelText("Cuéntanos tu proyecto"),
    "Necesitamos rediseñar la web de la clínica.",
  );
  await user.click(screen.getByRole("checkbox"));
}

describe("ContactForm", () => {
  it("validates on submit, links errors to fields and focuses the first one", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm interestOptions={interestOptions} />);

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    const name = screen.getByLabelText("Nombre");
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Escribe tu nombre (mínimo 2 caracteres).");
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(
      "Introduce un email válido, por ejemplo nombre@empresa.com.",
    );
    expect(fetchMock).not.toHaveBeenCalled();

    // After the first attempt, fixing a field clears its error immediately.
    await user.type(name, "Marta");
    expect(name).not.toHaveAttribute("aria-invalid");
  });

  it("submits the lead and replaces the form with a focused confirmation", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ data: { id: "1", receivedAt: "2026-10-02T09:00:00.000Z" } }, 201),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm interestOptions={interestOptions} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByRole("heading", { name: /gracias, marta/i })).toHaveFocus();
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body)).toMatchObject({
      source: "contact",
      name: "Marta López",
      email: "marta@clinica.test",
      interest: "desarrollo-web",
      consent: true,
    });
  });

  it("maps server-side validation issues back to the fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Revisa los campos marcados.",
              issues: [{ path: "email", message: "Este dominio de email no acepta mensajes." }],
            },
          },
          400,
        ),
      ),
    );
    const user = userEvent.setup();
    render(<ContactForm interestOptions={interestOptions} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    const email = await screen.findByLabelText("Email");
    expect(email).toHaveAccessibleDescription("Este dominio de email no acepta mensajes.");
    expect(email).toHaveFocus();
  });

  it("explains server failures and keeps what the user typed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ error: { code: "INTERNAL_ERROR" } }, 500)),
    );
    const user = userEvent.setup();
    render(<ContactForm interestOptions={interestOptions} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/problema de nuestro lado/i);
    expect(screen.getByLabelText("Nombre")).toHaveValue("Marta López");
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeEnabled();
  });
});
