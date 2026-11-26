import { expect, test } from "@playwright/test";

/** International routing (SPEC-009): language versions, hreflang, switcher and localized 404s. */

test("the English site is a full, linked language version", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/web design/i);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("AI automation");

  // hreflang is reciprocal and x-default points at English.
  const alternates = await page
    .locator('link[rel="alternate"][hreflang]')
    .evaluateAll((links) =>
      Object.fromEntries(
        links.map((link) => [
          link.getAttribute("hreflang"),
          new URL(link.getAttribute("href") ?? "").pathname,
        ]),
      ),
    );
  expect(alternates).toEqual({ es: "/", en: "/en", "x-default": "/en" });

  // Every internal link on an English page stays in English.
  const hrefs = await page
    .locator("main a[href^='/'], footer a[href^='/']:not([hreflang])")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
  expect(hrefs.length).toBeGreaterThan(10);
  for (const href of hrefs) expect(href, href).toMatch(/^\/en(\/|$|#)/);
});

test("the language switcher keeps the page", async ({ page }) => {
  await page.goto("/servicios/diseno-web-a-medida");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");

  await page.locator("footer a[hreflang='en']").click();
  await expect(page).toHaveURL(/\/en\/services\/custom-web-development$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Custom web design");

  await page.locator("footer a[hreflang='es']").click();
  await expect(page).toHaveURL(/\/servicios\/diseno-web-a-medida$/);
});

test("the assessment works in English end to end", async ({ page }) => {
  await page.goto("/en/digital-assessment");
  await page.getByRole("button", { name: "Start the assessment" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Select an option to continue.")).toHaveCount(3);

  const steps: string[][] = [
    ["We do not have a website", "No, we do not need to", "Rarely or never"],
    ["No, almost everything is done by hand", "A lot: several hours a week"],
    ["We are interested, but do not know where to start", "Yes, it would save us a lot of time"],
    ["No, never", "Yes, it is a priority"],
    ["2 to 9", "More leads and customers"],
  ];
  for (const [index, options] of steps.entries()) {
    for (const option of options) await page.getByLabel(option, { exact: true }).check();
    await page
      .getByRole("button", { name: index === steps.length - 1 ? "See my assessment" : "Next" })
      .click();
  }

  await expect(page.getByRole("heading", { name: "Your digital assessment" })).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.getByText("Recommended plan", { exact: true })).toBeVisible();
  await expect(page.locator("a[href^='/en/pricing#']")).toBeVisible();
});

test("unknown URLs get a 404 in the language of their section", async ({ page }) => {
  const english = await page.goto("/en/does-not-exist");
  expect(english?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("We could not find this page");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  const spanish = await page.goto("/no-existe");
  expect(spanish?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No encontramos esta página");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});
