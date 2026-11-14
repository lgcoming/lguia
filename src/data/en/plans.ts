import type { Faq, Plan } from "@/types/catalog";

/**
 * Plans in English (en). Ids, prices, categories and flags must mirror src/data/es/plans.ts
 * (a unit test checks it). Prices are indicative placeholders pending business validation.
 */
export const plans: Plan[] = [
  {
    id: "starter-local",
    name: "Starter Local",
    tagline: "For small businesses that need a professional online presence.",
    idealFor: "Freelancers, shops and local businesses",
    pricing: { kind: "from", amount: 690, currency: "EUR" },
    timeline: "2–3 weeks",
    features: [
      "Professional website of up to 5 sections",
      "Mobile-first design, optimised to load fast",
      "Local SEO: Google Business Profile and structured contact data",
      "Contact form and direct WhatsApp link",
      "Basic, privacy-friendly analytics",
      "Legal pages and cookie notice prepared",
    ],
    categories: ["desarrollo-web", "seo-geo"],
    featured: true,
  },
  {
    id: "web-pro",
    name: "Web Pro",
    tagline: "For companies that need a more advanced corporate website.",
    idealFor: "SMEs and service companies",
    pricing: { kind: "from", amount: 1900, currency: "EUR" },
    timeline: "4–6 weeks",
    features: [
      "Custom design of up to 12 pages",
      "Content structure and technical SEO from day one",
      "Structured data and readiness for AI answers (GEO)",
      "Forms connected to your email or CRM",
      "Analytics with conversion goals",
      "3 months of maintenance included",
    ],
    categories: ["desarrollo-web", "seo-geo", "automatizaciones"],
    featured: true,
  },
  {
    id: "ia-starter",
    name: "IA Starter",
    tagline:
      "For companies that want to launch one specific AI project, such as a chatbot or an internal assistant.",
    idealFor: "Companies that receive many repeated enquiries",
    pricing: { kind: "from", amount: 1200, currency: "EUR" },
    timeline: "3–4 weeks",
    features: [
      "Session to identify the use case with the best return",
      "Chatbot or assistant trained on your business information",
      "Knowledge base with your FAQs and documents",
      "Handover to a person when needed",
      "Results review and tuning during the first month",
      "Training for your team",
    ],
    categories: ["chatbots-ia"],
    featured: false,
  },
  {
    id: "automation-pack",
    name: "Automation Pack",
    tagline: "For companies with repetitive processes that want their hours back.",
    idealFor: "Teams that lose hours to manual tasks",
    pricing: { kind: "from", amount: 950, currency: "EUR" },
    timeline: "2–4 weeks",
    features: [
      "Review of your current processes",
      "Up to 3 automations: forms, emails and internal alerts",
      "Automatic qualification of leads and opportunities",
      "Integration with your tools: CRM, spreadsheets, email",
      "Documentation and team training",
    ],
    categories: ["automatizaciones"],
    featured: false,
  },
  {
    id: "growth-web-ia",
    name: "Growth Web + IA",
    tagline: "For companies that want web, SEO/GEO, AI and automation working together.",
    idealFor: "Companies that want to grow online",
    pricing: { kind: "from", amount: 3900, currency: "EUR" },
    timeline: "8–10 weeks",
    features: [
      "Everything in Web Pro",
      "SEO + GEO strategy with content for 3 months",
      "AI assistant built into your website",
      "2 automations connected to your CRM",
      "Monthly review of results and improvements",
    ],
    categories: ["desarrollo-web", "seo-geo", "chatbots-ia", "automatizaciones"],
    featured: true,
    highlight: "Most complete",
  },
  {
    id: "custom-enterprise",
    name: "Custom Enterprise",
    tagline: "For complex projects that need a solution built to order.",
    idealFor: "Mid-sized and large companies",
    pricing: { kind: "custom", label: "Custom quote" },
    timeline: "Depends on scope",
    features: [
      "Discovery phase with your team",
      "Architecture and integrations with your systems (ERP, CRM, API)",
      "AI agents and advanced automations",
      "Dedicated team and phased planning",
      "Support with service-level agreements",
    ],
    categories: ["desarrollo-web", "seo-geo", "chatbots-ia", "automatizaciones"],
    featured: false,
  },
];

export const planFaqs: Faq[] = [
  {
    question: "Are the prices final?",
    answer:
      "They are indicative starting prices, VAT excluded. After the assessment and a call we send a fixed quote with the exact scope.",
  },
  {
    question: "How is a project paid for?",
    answer:
      "Usually in two or three milestones: at the start, midway and on delivery. The proposal spells it out.",
  },
  {
    question: "Is there a minimum commitment?",
    answer:
      "No. Projects have a fixed scope. Maintenance and continuous improvement are optional and can be cancelled whenever you like.",
  },
  {
    question: "Can I start with one plan and extend it later?",
    answer:
      "Yes. Many clients start with the website or a first automation and add AI or SEO once they see results.",
  },
  {
    question: "Do you work with companies outside Spain?",
    answer:
      "Yes. We work remotely, in Spanish and English. Prices are quoted in euros and VAT is applied according to where your company is based.",
  },
];
