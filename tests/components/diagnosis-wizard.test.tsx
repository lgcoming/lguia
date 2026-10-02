import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/components/motion/motion-provider";
import { plans } from "@/data/plans";
import { serviceCategories } from "@/data/services";
import { DiagnosisWizard } from "@/features/diagnosis/components/diagnosis-wizard";
import { diagnose } from "@/features/diagnosis/model/diagnose";
import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";

const ANSWERS: DiagnosisAnswers = {
  websiteStatus: "outdated",
  sellsOnline: "planned",
  webLeads: "occasional",
  automationLevel: "none",
  repetitiveWorkload: "medium",
  aiAdoption: "interested",
  chatbotInterest: "yes",
  seoStatus: "none",
  visibilityGoal: "priority",
  companySize: "micro",
  mainGoal: "sales",
};

const RESULT = diagnose(ANSWERS, { plans, categories: serviceCategories });

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function renderWizard() {
  const user = userEvent.setup();
  render(
    <MotionProvider>
      <DiagnosisWizard />
    </MotionProvider>,
  );
  return user;
}

/** Answers every question of the visible step from ANSWERS, by clicking the option labels. */
async function answerVisibleStep(user: ReturnType<typeof userEvent.setup>) {
  for (const group of screen.getAllByRole("group")) {
    const radios = within(group).getAllByRole("radio") as HTMLInputElement[];
    const questionId = radios[0].name as keyof DiagnosisAnswers;
    const target = radios.find((radio) => radio.value === ANSWERS[questionId]);
    await user.click(target!);
  }
}

describe("DiagnosisWizard", () => {
  it("starts with an introduction and moves focus to the first step", async () => {
    const user = renderWizard();
    expect(screen.getByRole("heading", { name: /descubre qué mejorar/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Empezar diagnóstico" }));

    const heading = await screen.findByRole("heading", {
      name: /paso 1 de 5: tu presencia online/i,
    });
    expect(heading).toHaveFocus();
    expect(screen.getAllByRole("group")).toHaveLength(3);
  });

  it("blocks progress until every question is answered and explains why", async () => {
    const user = renderWizard();
    await user.click(screen.getByRole("button", { name: "Empezar diagnóstico" }));
    await user.click(await screen.findByRole("button", { name: "Siguiente" }));

    expect(screen.getAllByText("Selecciona una opción para continuar.")).toHaveLength(3);
    const firstGroup = screen.getByRole("group", { name: /cómo es hoy la web/i });
    expect(firstGroup).toHaveAccessibleDescription("Selecciona una opción para continuar.");
    expect(within(firstGroup).getAllByRole("radio")[0]).toHaveFocus();

    await user.click(within(firstGroup).getByRole("radio", { name: "No tenemos web" }));
    expect(screen.getAllByText("Selecciona una opción para continuar.")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: /paso 1 de 5/i })).toBeInTheDocument();
  });

  it("can be operated with the keyboard and keeps answers when going back", async () => {
    const user = renderWizard();
    await user.click(screen.getByRole("button", { name: "Empezar diagnóstico" }));
    await screen.findByRole("heading", { name: /paso 1 de 5/i });

    // Tab into each radio group, select with Space, then submit the step with Enter.
    for (let group = 0; group < 3; group++) {
      await user.tab();
      await user.keyboard("[Space]");
    }
    expect(screen.getAllByRole("radio", { checked: true })).toHaveLength(3);
    await user.keyboard("{Enter}");

    expect(
      await screen.findByRole("heading", { name: /paso 2 de 5: procesos y automatización/i }),
    ).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Anterior" }));
    await screen.findByRole("heading", { name: /paso 1 de 5/i });
    expect(screen.getAllByRole("radio", { checked: true })).toHaveLength(3);
  });

  it("sends the answers to the API and shows the recommendation", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ data: RESULT }));
    vi.stubGlobal("fetch", fetchMock);
    const user = renderWizard();

    await user.click(screen.getByRole("button", { name: "Empezar diagnóstico" }));
    for (let step = 1; step <= 5; step++) {
      await screen.findByRole("heading", { name: new RegExp(`paso ${step} de 5`, "i") });
      await answerVisibleStep(user);
      await user.click(
        screen.getByRole("button", { name: step === 5 ? "Ver mi diagnóstico" : "Siguiente" }),
      );
    }

    expect(
      await screen.findByRole("heading", { name: "Tu diagnóstico digital" }, { timeout: 3000 }),
    ).toHaveFocus();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/diagnosis",
      expect.objectContaining({ method: "POST", body: JSON.stringify(ANSWERS) }),
    );
    expect(screen.getByRole("heading", { name: RESULT.recommendedPlan.name })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: `Tu puntuación: ${RESULT.score} de 100, nivel ${RESULT.level.label}`,
      }),
    ).toBeInTheDocument();
    for (const reason of RESULT.reasons) expect(screen.getByText(reason)).toBeInTheDocument();
  });

  it("shows a recoverable error when the API fails, without losing answers", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(jsonResponse({ data: RESULT }));
    vi.stubGlobal("fetch", fetchMock);
    const user = renderWizard();

    await user.click(screen.getByRole("button", { name: "Empezar diagnóstico" }));
    for (let step = 1; step <= 5; step++) {
      await screen.findByRole("heading", { name: new RegExp(`paso ${step} de 5`, "i") });
      await answerVisibleStep(user);
      await user.click(
        screen.getByRole("button", { name: step === 5 ? "Ver mi diagnóstico" : "Siguiente" }),
      );
    }

    expect(
      await screen.findByRole("heading", { name: /no hemos podido calcular/i }, { timeout: 3000 }),
    ).toHaveFocus();
    expect(screen.getByText(/no hay conexión a internet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(
      await screen.findByRole("heading", { name: "Tu diagnóstico digital" }, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ body: JSON.stringify(ANSWERS) });
  });
});
