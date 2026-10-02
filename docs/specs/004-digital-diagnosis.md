# SPEC-004 — Digital diagnosis

- Status: Approved
- Sprint: 2
- Related: [003](./003-marketing-site.md), [005](./005-leads.md), [006](./006-api.md)

## Context

The diagnosis is LGuIA's main conversion tool: a short questionnaire that tells a business where
it stands digitally, which plan fits and why, and then invites it to leave its details. The
recommendation must be **deterministic, explainable TypeScript** — no AI API — so it can be tested
and trusted.

## Architecture

```
DiagnosisAnswers (unknown input)
  → validateDiagnosis()        Zod schema, returns typed answers or field issues
  → calculateDiagnosis()       area maturity scores, overall score, level, category needs
  → recommendPlan()            plan id + reasons
  → getRecommendedServices()   2–4 services with a reason each
  → buildNextSteps()           plan-specific next steps
  → DiagnosisResult            enriched with catalog data by diagnose(answers, catalog)
```

- Module: `src/features/diagnosis/model/` — pure functions, no React, no I/O.
- `diagnose(answers, catalog)` composes the steps and resolves plan/service names from the catalog
  passed in (so tests can use the real catalog and the engine stays pure).
- `runDiagnosis(answers)` in `diagnosis-service.ts` loads the catalog from the repository and
  calls `diagnose`. Used by `POST /api/diagnosis`.
- `DiagnosisWizard` (client) only manages UI state and calls the API. It imports the question
  definitions and the per-step validator, never the scoring rules.

## Questions

Five steps, eleven single-choice questions. All are required.

| Step                         | Question id          | Question (es)                                                              | Options (value → label)                                                                                                                                                                                                                   |
| ---------------------------- | -------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Tu presencia online       | `websiteStatus`      | ¿Cómo es hoy la web de tu negocio?                                         | `none` No tenemos web · `outdated` Tenemos web, pero está anticuada o casi no se actualiza · `basic` Funciona, aunque se ha quedado corta · `modern` Es moderna y la mantenemos al día                                                    |
|                              | `sellsOnline`        | ¿Vendes tus productos o servicios por internet?                            | `yes` Sí, ya vendemos online · `planned` Todavía no, pero queremos hacerlo · `no` No, no lo necesitamos                                                                                                                                   |
|                              | `webLeads`           | ¿Te llegan clientes potenciales a través de la web?                        | `regular` Sí, con regularidad · `occasional` De vez en cuando · `none` Casi nunca o nunca                                                                                                                                                 |
| 2. Procesos y automatización | `automationLevel`    | ¿Usáis herramientas que automaticen tareas?                                | `none` No, casi todo se hace a mano · `basic` Alguna herramienta suelta · `advanced` Sí, tenemos procesos conectados                                                                                                                      |
|                              | `repetitiveWorkload` | ¿Cuánto tiempo dedica tu equipo a tareas repetitivas?                      | `high` Mucho: varias horas a la semana · `medium` Algo, aunque es llevadero · `low` Poco                                                                                                                                                  |
| 3. Inteligencia artificial   | `aiAdoption`         | ¿En qué punto estáis con la inteligencia artificial?                       | `none` No es una prioridad ahora · `interested` Nos interesa, pero no sabemos por dónde empezar · `exploring` La usamos de forma puntual · `using` Ya está integrada en algunos procesos                                                  |
|                              | `chatbotInterest`    | ¿Te interesaría un chatbot o asistente con IA para atender consultas?      | `yes` Sí, nos ahorraría mucho tiempo · `maybe` Quizá, quiero saber más · `no` No por ahora                                                                                                                                                |
| 4. Visibilidad en buscadores | `seoStatus`          | ¿Trabajáis el posicionamiento en buscadores (SEO)?                         | `none` No, nunca · `occasional` Algo, sin una estrategia clara · `active` Sí, de forma continua                                                                                                                                           |
|                              | `visibilityGoal`     | ¿Quieres aparecer mejor en Google y en las respuestas de asistentes de IA? | `priority` Sí, es una prioridad · `interested` Me interesa, pero no es urgente · `not-now` No es importante ahora                                                                                                                         |
| 5. Tu empresa                | `companySize`        | ¿Cuántas personas trabajan en tu empresa?                                  | `solo` Solo yo · `micro` De 2 a 9 · `small` De 10 a 49 · `medium` De 50 a 249 · `large` 250 o más                                                                                                                                         |
|                              | `mainGoal`           | ¿Qué quieres conseguir en los próximos meses?                              | `presence` Una imagen digital profesional · `leads` Más contactos y clientes · `sales` Vender más por internet · `efficiency` Ahorrar tiempo automatizando · `ai` Empezar a usar IA con sentido · `growth` Digitalizar el negocio a fondo |

The brief's "Does your company have a website?" and "Is the website updated?" are merged into
`websiteStatus` to avoid conditional questions.

## Scoring

### Area maturity (0–100, higher = more mature)

| Area (`id`, label)                     | Formula                                                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `web` Presencia web                    | `round(0.65·W + 0.35·L)` — W: none 0, outdated 25, basic 60, modern 100; L: none 0, occasional 50, regular 100 |
| `automation` Automatización            | `round(0.6·A + 0.4·R)` — A: none 0, basic 50, advanced 100; R: high 0, medium 50, low 100                      |
| `ai` Inteligencia artificial           | aiAdoption: none 0, interested 15, exploring 50, using 100                                                     |
| `visibility` Visibilidad en buscadores | seoStatus: none 0, occasional 45, active 100; **capped at 20 when `websiteStatus = none`**                     |

### Overall score and level

`score = round(0.35·web + 0.25·automation + 0.20·visibility + 0.20·ai)` → integer 0–100.

| Level id     | Label         | Range  | Summary                                                                                                   |
| ------------ | ------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `initial`    | Inicial       | 0–34   | Tu negocio tiene mucho margen de mejora digital. Con pocos cambios bien elegidos se nota la diferencia.   |
| `developing` | En desarrollo | 35–64  | Tienes una base digital, pero hay áreas concretas donde estás dejando pasar oportunidades.                |
| `advanced`   | Avanzado      | 65–100 | Tu negocio está bien digitalizado. El siguiente paso es optimizar y sacar más partido a lo que ya tienes. |

### Category needs (0–100, higher = bigger opportunity)

Goal boosts:

| mainGoal   | web | automation | ai  | seo |
| ---------- | --- | ---------- | --- | --- |
| presence   | +20 |            |     |     |
| leads      | +10 |            |     | +15 |
| sales      | +20 |            |     | +5  |
| efficiency |     | +20        |     |     |
| ai         |     |            | +20 |     |
| growth     | +10 | +10        | +10 | +10 |

- `web = clamp((100 − webMaturity)·0.8 + (sellsOnline = planned ? 20 : 0) + boost)`
- `automation = clamp((100 − automationMaturity)·0.8 + boost)`
- `ai = clamp(aiBase + chatbotAdd + boost)` — aiBase: none 5, interested 55, exploring 60,
  using 45; chatbotAdd: yes 30, maybe 15, no 0
- `seo = clamp((100 − visibilityMaturity)·factor + boost)` — factor: priority 1, interested 0.7,
  not-now 0.3

All values rounded to integers. A need ≥ 60 is a **strong need**.

## Plan recommendation (rules evaluated in order)

1. `companySize = large` → **custom-enterprise**.
2. `companySize = medium` and ≥ 3 strong needs → **custom-enterprise**.
3. ≥ 3 strong needs, or `mainGoal = growth` with ≥ 2 strong needs → **growth-web-ia**.
4. Otherwise take the **primary category** = highest need. Ties: the category linked to
   `mainGoal` (presence/leads/sales → web, efficiency → automation, ai → ai), then the order
   web > automation > ai > seo.
   - `web` → **starter-local** if `companySize ∈ {solo, micro}`, `websiteStatus ∈ {none, outdated}`,
     `sellsOnline = no` and `mainGoal ≠ sales`; otherwise **web-pro**.
   - `seo` → **starter-local** if `companySize ∈ {solo, micro}` and `websiteStatus ∈ {none, outdated}`;
     otherwise **web-pro** (Web Pro includes the SEO/GEO foundation).
   - `automation` → **automation-pack**.
   - `ai` → **ia-starter**.

### Reasons (2–3 strings)

The first reason explains the rule that fired:

| Rule                     | First reason                                                                                                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 (large)                | Por el tamaño de tu empresa, lo más eficaz es un proyecto a medida que empiece analizando procesos y sistemas.                                                                                       |
| 2 (medium + 3 strong)    | Tienes varias áreas con mucho potencial y un equipo grande: conviene planificarlas juntas en un proyecto a medida.                                                                                   |
| 3 (growth)               | Hay varias áreas con mucho margen a la vez: un plan conjunto evita soluciones sueltas que no se hablan entre sí.                                                                                     |
| 4 web → starter-local    | Para un negocio de tu tamaño, una web profesional con SEO local es la base con mejor retorno.                                                                                                        |
| 4 web → web-pro          | Tu mayor oportunidad está en la web: necesitas una más completa, preparada para captar clientes.                                                                                                     |
| 4 seo → starter-local    | Para que te encuentren, primero necesitas una web profesional con el SEO local bien hecho.                                                                                                           |
| 4 seo → web-pro          | Tu mayor oportunidad está en la visibilidad: Web Pro incluye SEO técnico y preparación para respuestas de IA.                                                                                        |
| 4 automation             | Tu mayor oportunidad está en automatizar procesos: es donde más tiempo puedes recuperar.                                                                                                             |
| 4 ai                     | La IA es tu mayor oportunidad ahora mismo, empezando por un caso de uso acotado y medible.                                                                                                           |
| 4 with primary need < 40 | Tu base digital es sólida: el mayor margen de mejora está en {área}. (web → tu web, automation → la automatización de procesos, ai → la inteligencia artificial, seo → la visibilidad en buscadores) |

Then up to two **signal reasons** whose category is covered by the recommended plan, ordered by
that category's need (desc), then table order:

| Signal                                        | Category   | Reason                                                                                |
| --------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| websiteStatus = none                          | web        | Todavía no tienes web, y es lo primero que consultan tus clientes antes de contactar. |
| websiteStatus = outdated                      | web        | Tu web actual está anticuada y no refleja cómo trabaja hoy tu negocio.                |
| has website and webLeads = none               | web        | Tu web casi no genera contactos: falta orientarla a convertir visitas en clientes.    |
| sellsOnline = planned                         | web        | Quieres empezar a vender online y necesitas una tienda preparada para ello.           |
| repetitiveWorkload = high                     | automation | Tu equipo dedica muchas horas a tareas repetitivas que se pueden automatizar.         |
| automationLevel = none                        | automation | Casi todo se hace a mano: conectar tus herramientas reduce errores y tiempo.          |
| chatbotInterest = yes                         | ai         | Te interesa un asistente que atienda consultas, un punto de partida claro para la IA. |
| aiAdoption = interested                       | ai         | Quieres empezar con la IA y necesitas un primer caso de uso claro y medible.          |
| aiAdoption = exploring                        | ai         | Ya usáis IA de forma puntual: el siguiente paso es integrarla en procesos concretos.  |
| seoStatus = none and visibilityGoal ≠ not-now | seo        | No trabajas el SEO y quieres ganar visibilidad en buscadores y asistentes de IA.      |

Plan coverage: starter-local, web-pro → web, seo; ia-starter → ai; automation-pack → automation;
growth-web-ia, custom-enterprise → all.

## Recommended services (2–4)

Candidate rules (in order). A candidate is kept only if its category need ≥ 30. Kept candidates are
sorted by category need (desc, stable) and the first 4 unique services are returned. If fewer than
2 remain, the flagship service of the highest-need categories is added until there are 2
(flagships: web → `optimizacion-rendimiento`, automation → `reduccion-tareas`, ai → `chatbots`,
seo → `seo-tecnico`).

| #   | Condition                                                        | Service                    | Reason                                                                             |
| --- | ---------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| 1   | websiteStatus = none                                             | `web-corporativa`          | Una web profesional que explique con claridad qué haces y cómo contactarte.        |
| 2   | websiteStatus = outdated                                         | `rediseno-web`             | Renovar tu web para que transmita confianza y funcione bien en móvil.              |
| 3   | websiteStatus ∈ {basic, modern} and webLeads ≠ regular           | `landing-pages`            | Páginas enfocadas en tus servicios clave para convertir visitas en contactos.      |
| 4   | sellsOnline = planned, or mainGoal = sales and sellsOnline ≠ yes | `ecommerce`                | Una tienda online fácil de gestionar para empezar a vender por internet.           |
| 5   | sellsOnline = yes and websiteStatus ≠ modern                     | `optimizacion-rendimiento` | Una tienda más rápida reduce abandonos y mejora la conversión.                     |
| 6   | chatbotInterest ∈ {yes, maybe}                                   | `chatbots`                 | Un chatbot que responda las preguntas frecuentes de tus clientes a cualquier hora. |
| 7   | aiAdoption ≠ none and companySize ≠ solo                         | `asistentes-internos`      | Un asistente interno para que tu equipo encuentre información al instante.         |
| 8   | repetitiveWorkload ∈ {high, medium}                              | `reduccion-tareas`         | Automatizar las tareas que hoy se repiten a mano cada semana.                      |
| 9   | webLeads ∈ {regular, occasional} and automationLevel ≠ advanced  | `clasificacion-leads`      | Clasificar y responder automáticamente los contactos que llegan por la web.        |
| 10  | automationLevel = none and companySize ∈ {small, medium, large}  | `integraciones-crm`        | Conectar tus herramientas con un CRM para no perder ninguna oportunidad.           |
| 11  | seoStatus ≠ active and visibilityGoal ≠ not-now                  | `seo-tecnico`              | Resolver la base técnica para que los buscadores entiendan tu web.                 |
| 12  | visibilityGoal ∈ {priority, interested}                          | `geo`                      | Preparar tu contenido para aparecer en respuestas de asistentes de IA.             |

## Next steps (3 strings)

1. Déjanos tus datos y revisaremos el diagnóstico contigo en una llamada de 30 minutos, sin compromiso.
2. Plan-specific preparation:
   - starter-local, web-pro: Reúne lo que ya tengas: logotipo, textos, fotos y webs que te gusten como referencia.
   - ia-starter: Anota las preguntas que más se repiten de tus clientes o de tu equipo: serán la base del asistente.
   - automation-pack: Haz una lista de las tres tareas repetitivas que más tiempo os quitan cada semana.
   - growth-web-ia: Decide qué resultado quieres medir primero: contactos, ventas u horas ahorradas.
   - custom-enterprise: Identifica a las personas clave y los sistemas implicados (ERP, CRM, herramientas internas).
3. Después te enviaremos una propuesta con alcance, plazos y presupuesto detallado.

## Result contract

```ts
interface DiagnosisResult {
  score: number; // 0–100
  level: { id: "initial" | "developing" | "advanced"; label: string; summary: string };
  areas: { id: "web" | "automation" | "ai" | "visibility"; label: string; score: number }[];
  recommendedPlan: {
    id: PlanId;
    name: string;
    tagline: string;
    pricing: PlanPricing;
    features: string[];
    href: "/planes";
  };
  recommendedServices: {
    id: string;
    name: string;
    description: string;
    reason: string;
    category: { id: ServiceCategoryId; name: string; href: string };
  }[];
  reasons: string[];
  nextSteps: string[];
}
```

## Wizard UX

Phases: `intro` → `questions` (step 1–5) → `calculating` → `result` (+ lead form) → lead
`success`; `error` is reachable from `calculating`.

- **Intro**: what the user gets, ~3 minutes, 5 steps, no data required until the end. Button
  "Empezar diagnóstico".
- **Questions**: one `<form>` per step; each question is a `<fieldset>` with `<legend>` and native
  radio inputs styled as option tiles (arrow keys move within a group, Tab between groups, Enter
  submits the step). Buttons "Anterior" and "Siguiente" (last step: "Ver mi diagnóstico").
- **Progress**: "Paso N de 5: {step title}" text plus the route line with five stops; the visual
  route is decorative (`aria-hidden`), the text is the accessible source of truth.
- **Validation**: on "Siguiente", unanswered questions show "Selecciona una opción para continuar."
  inside the fieldset (`aria-describedby`, `aria-invalid` on the inputs), focus moves to the first
  invalid group. Answering a question clears its error.
- **Focus**: on step change focus moves to the step heading (`tabIndex=-1`); on result, to the
  result heading.
- **Calculating**: `POST /api/diagnosis`; status message "Analizando tus respuestas…" in a
  `role="status"` region; minimum display time 900 ms so the transition is perceivable.
- **Error**: message explaining the failure, "Reintentar" (re-sends) and "Revisar respuestas"
  (back to last step). Answers are never lost.
- **Result**: score ring + level + summary, area bars, recommended plan (with link to `/planes`),
  recommended services (with links to category pages), reasons, next steps, lead form (SPEC-005),
  and "Repetir diagnóstico".
- **Motion**: step transitions, progress, result count-up — all disabled/instant with reduced motion.

## Acceptance criteria

- [ ] AC1 — `validateDiagnosis` rejects missing fields and unknown option values with per-field
      messages; accepts a complete valid object (unit tests).
- [ ] AC2 — `calculateDiagnosis` returns 0 for the lowest answers and 100 for the highest, applies
      the visibility cap, and level boundaries 34/35 and 64/65 (unit tests).
- [ ] AC3 — `recommendPlan` returns the expected plan for each rule, including tie-breaks, and
      never recommends starter-local to a business with a modern website (unit tests).
- [ ] AC4 — `getRecommendedServices` returns 2–4 unique services, filtered and ordered per spec
      (unit tests).
- [ ] AC5 — `POST /api/diagnosis` returns a `DiagnosisResult` for valid input and a 400 with issues
      for invalid input (integration tests).
- [ ] AC6 — The wizard can be completed with keyboard only; validation errors are announced and
      focus is managed as described (component test + E2E).
- [ ] AC7 — The full flow intro → result → lead → success works on desktop and mobile (E2E).
- [ ] AC8 — With reduced motion, the result shows final values immediately.
