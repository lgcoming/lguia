import { getCatalogRepository } from "@/features/catalog/catalog-repository";
import { formatPlanPrice } from "@/features/catalog/format";
import { LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageHref, planHref, serviceHref } from "@/i18n/routes";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

async function section(locale: Locale): Promise<string> {
  const t = getDictionary(locale);
  const catalog = getCatalogRepository(locale);
  const [categories, plans] = await Promise.all([
    catalog.listServiceCategories(),
    catalog.listPlans(),
  ]);

  const services = categories.map(
    (category) =>
      `- [${category.name}](${absoluteUrl(serviceHref(locale, category.id))}): ${category.answer}`,
  );
  const pricing = plans.map(
    (plan) =>
      `- [${plan.name}](${absoluteUrl(planHref(locale, plan.id))}): ${formatPlanPrice(plan.pricing, locale)}, ${plan.timeline}. ${plan.tagline}`,
  );
  const pages = [
    `- [${t.footer.pricing}](${absoluteUrl(pageHref(locale, "pricing"))}): ${t.pricingPage.metaDescription}`,
    `- [${t.diagnosisPage.title}](${absoluteUrl(pageHref(locale, "diagnosis"))}): ${t.diagnosisPage.metaDescription}`,
    `- [${t.footer.contact}](${absoluteUrl(pageHref(locale, "contact"))}): ${t.contactPage.metaDescription}`,
  ];

  return [
    `## ${LOCALE_INFO[locale].nativeName}: ${t.footer.services}`,
    "",
    ...services,
    "",
    `## ${LOCALE_INFO[locale].nativeName}: ${t.footer.pricing}`,
    "",
    ...pricing,
    "",
    `## ${LOCALE_INFO[locale].nativeName}: ${t.footer.company}`,
    "",
    ...pages,
  ].join("\n");
}

/**
 * /llms.txt (llmstxt.org): a Markdown summary of the site for AI assistants, generated from the
 * same catalog as the pages so facts and prices never drift (SPEC-009). It is an optional,
 * experimental convention: it helps tools that read it and promises nothing about citations.
 */
export async function GET() {
  const { about } = getDictionary("en").home;
  const sections = await Promise.all(LOCALES.map(section));
  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${about.paragraphs[0]}`,
    "",
    `Contact: ${siteConfig.email}. The site is available in Spanish (${absoluteUrl(pageHref("es", "home"))}) and English (${absoluteUrl(pageHref("en", "home"))}). Prices are indicative starting prices in euros, VAT excluded.`,
    "",
    ...sections.flatMap((text) => [text, ""]),
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
