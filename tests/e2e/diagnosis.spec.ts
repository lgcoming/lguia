import { expect, test, type Page } from "@playwright/test";

/**
 * Critical flow (SPEC-008): /diagnostico-digital → complete the diagnosis →
 * receive a recommendation → submit the lead form → success message.
 */

const STEPS: { title: RegExp; answers: [question: RegExp, option: string][] }[] = [
  {
    title: /tu presencia online/i,
    answers: [
      [/cómo es hoy la web/i, "Tenemos web, pero está anticuada o casi no se actualiza"],
      [/vendes tus productos/i, "Todavía no, pero queremos hacerlo"],
      [/clientes potenciales/i, "De vez en cuando"],
    ],
  },
  {
    title: /procesos y automatización/i,
    answers: [
      [/herramientas que automaticen/i, "No, casi todo se hace a mano"],
      [/tareas repetitivas/i, "Algo, aunque es llevadero"],
    ],
  },
  {
    title: /inteligencia artificial/i,
    answers: [
      [/en qué punto estáis/i, "Nos interesa, pero no sabemos por dónde empezar"],
      [/chatbot o asistente/i, "Sí, nos ahorraría mucho tiempo"],
    ],
  },
  {
    title: /visibilidad en buscadores/i,
    answers: [
      [/posicionamiento en buscadores/i, "No, nunca"],
      [/aparecer mejor en google/i, "Sí, es una prioridad"],
    ],
  },
  {
    title: /tu empresa/i,
    answers: [
      [/cuántas personas/i, "De 2 a 9"],
      [/qué quieres conseguir/i, "Vender más por internet"],
    ],
  },
];

async function answerStep(page: Page, step: (typeof STEPS)[number], isLast: boolean) {
  await expect(page.getByRole("heading", { level: 2, name: step.title })).toBeVisible();
  for (const [question, option] of step.answers) {
    await page.getByRole("group", { name: question }).getByLabel(option, { exact: true }).check();
  }
  await page.getByRole("button", { name: isLast ? "Ver mi diagnóstico" : "Siguiente" }).click();
}

test("a business completes the diagnosis and requests a proposal", async ({ page }) => {
  await page.goto("/diagnostico-digital");
  await expect(page).toHaveTitle(/Diagnóstico digital gratuito/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Diagnóstico digital gratuito");

  await page.getByRole("button", { name: "Empezar diagnóstico" }).click();

  // Validation: an empty step cannot be skipped.
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByText("Selecciona una opción para continuar.")).toHaveCount(3);

  for (const [index, step] of STEPS.entries()) {
    await answerStep(page, step, index === STEPS.length - 1);
  }

  // Recommendation
  const resultHeading = page.getByRole("heading", { name: "Tu diagnóstico digital" });
  await expect(resultHeading).toBeVisible({ timeout: 10_000 });
  await expect(resultHeading).toBeFocused();
  await expect(page.getByText("Plan recomendado")).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Growth Web + IA" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Servicios recomendados" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Próximos pasos" })).toBeVisible();

  // Lead form
  const leadForm = page.getByRole("region", { name: /revisamos este diagnóstico/i });
  await leadForm.getByLabel("Nombre").fill("Lucía Fernández");
  await leadForm.getByLabel("Email").fill("lucia@tienda-e2e.test");
  await leadForm.getByLabel("Empresa (opcional)").fill("Tienda Fernández");
  await leadForm.getByRole("checkbox").check();

  const leadRequest = page.waitForRequest(
    (request) => request.url().endsWith("/api/leads") && request.method() === "POST",
  );
  await leadForm.getByRole("button", { name: "Quiero mi propuesta" }).click();

  const payload = (await leadRequest).postDataJSON();
  expect(payload).toMatchObject({
    source: "diagnosis",
    email: "lucia@tienda-e2e.test",
    answers: { mainGoal: "sales", companySize: "micro" },
  });

  // Success
  const success = page.getByRole("heading", { name: /gracias, lucía/i });
  await expect(success).toBeVisible();
  await expect(success).toBeFocused();
  await expect(page.getByText("lucia@tienda-e2e.test")).toBeVisible();
});
