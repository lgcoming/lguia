import type { ServiceCategory } from "@/types/catalog";

/*
 * Service catalog in English (en). Localised, not translated: titles and H1s open with the
 * terms international buyers search for. Ids, icons, service ids and related plans must mirror
 * src/data/es/services.ts, and prices must match src/data/en/plans.ts (unit tests check both).
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: "desarrollo-web",
    name: "Custom web design",
    icon: "web",
    seoTitle: "Custom web design and development, from €590",
    seoDescription:
      "Custom web design for businesses: corporate sites, landing pages and online stores that load fast and win customers. Fixed quotes from €590.",
    headline: "Custom web design and development for businesses",
    topic: "custom web design",
    summary:
      "Corporate websites, landing pages and online stores built from scratch: fast, clear and designed to generate leads.",
    description:
      "We design and code your website from scratch, with no bloated templates: it loads fast, makes sense at first glance and moves every visitor toward a call or a purchase. Fixed quote, and the code, the domain and every account in your name.",
    answer:
      "lguia builds custom websites for businesses: corporate sites, landing pages and online stores coded without templates and optimised for speed (Core Web Vitals), technical SEO and conversion. Projects start at €590 for a site of up to five sections and at €1,950 for a full corporate website, ship in 2 to 6 weeks, and are agreed as a fixed quote before work begins.",
    problems: [
      {
        pain: "Your website gets traffic, but almost nobody gets in touch",
        solution:
          "We rebuild the messaging, pages and calls to action around what your buyer is looking for, and track every form so you know what works.",
      },
      {
        pain: "It loads slowly and you lose customers on mobile",
        solution:
          "Custom code, optimised images and fonts and no unnecessary scripts, so the site passes Core Web Vitals on mobile too.",
      },
      {
        pain: "You are locked into a template or a vendor",
        solution:
          "You own the code, the domain and the accounts, with documentation so any team can pick the work up.",
      },
    ],
    outcomes: [
      "More leads and sales from pages designed to convert",
      "A site that is fast on mobile, where your customers search",
      "A professional image that builds trust from the first visit",
      "Clear data on what works, so you can decide with evidence",
    ],
    services: [
      {
        id: "web-corporativa",
        name: "Corporate websites",
        description: "Your company explained clearly: services, team, work and contact.",
      },
      {
        id: "landing-pages",
        name: "Landing pages",
        description: "Pages focused on one service or campaign, designed to capture leads.",
      },
      {
        id: "ecommerce",
        name: "Online stores",
        description: "Catalogue, payments and shipping in a store that is easy to run.",
      },
      {
        id: "rediseno-web",
        name: "Website redesign",
        description: "We rebuild your site without losing what already works or your rankings.",
      },
      {
        id: "optimizacion-rendimiento",
        name: "Speed optimisation",
        description: "Faster load times and better Core Web Vitals, so you stop losing visits.",
      },
      {
        id: "mantenimiento-web",
        name: "Maintenance",
        description: "Updates, backups and small changes, handled for you.",
      },
      {
        id: "analitica-web",
        name: "Analytics and measurement",
        description: "We measure visits, leads and sales with privacy-friendly tools.",
      },
      {
        id: "preparacion-legal",
        name: "Legal pages and cookies",
        description: "The structure for legal notices and a cookie banner that covers the basics.",
      },
      {
        id: "soluciones-tecnicas",
        name: "Custom features",
        description: "Bookings, private areas, integrations and other features built to order.",
      },
    ],
    faqs: [
      {
        question: "How much does a custom website cost?",
        answer:
          "It depends on scope. A professional site of up to five sections starts at €590 and a custom corporate website of up to twelve pages at €1,950, VAT excluded. After the assessment we send a fixed quote with the exact scope.",
      },
      {
        question: "How long does it take to build a website?",
        answer:
          "A simple site is usually ready in 2 to 3 weeks and a full corporate website in 4 to 6. Before we start you get a schedule with actual dates.",
      },
      {
        question: "What is the difference between a custom website and a template?",
        answer:
          "A template fits your content into a generic design and usually ships code you do not need. A custom website is designed and coded for your customers and your goals: it loads faster, ranks better and can grow with your business.",
      },
      {
        question: "Will I be able to edit the content myself?",
        answer:
          "Yes. Depending on the project, we set up a simple system so you can update copy, images or products without relying on us.",
      },
      {
        question: "What happens to my current website and its rankings?",
        answer:
          "In a redesign we keep the important URLs or set up redirects, so you keep the rankings you already have.",
      },
      {
        question: "Are the domain and hosting included?",
        answer:
          "We help you choose and set up the right hosting. The domain, the hosting and the accounts are always in your name.",
      },
    ],
    relatedPlanIds: ["starter-local", "web-pro", "growth-web-ia"],
  },
  {
    id: "automatizaciones",
    name: "AI automation",
    icon: "automation",
    seoTitle: "AI automation services for businesses",
    seoDescription:
      "AI automation for businesses: we connect forms, email and your CRM to remove manual work and answer leads faster. From €890, live in 2 to 4 weeks.",
    headline: "AI automation services for businesses",
    topic: "AI automation",
    summary:
      "We connect forms, email and your CRM, and add AI where it saves time, so data moves on its own and your team stops copying and pasting.",
    description:
      "We study how your team works and automate what repeats every day: logging requests, moving data between tools, qualifying leads or alerting the right person. Fewer errors, faster replies and hours back every week.",
    answer:
      "lguia automates business processes for companies: it connects forms, email, spreadsheets and CRMs, and uses artificial intelligence to classify and answer incoming requests. A typical project includes a process review and up to three documented automations, starts at €890 and goes live in 2 to 4 weeks, with error alerts and a manual fallback for every workflow.",
    problems: [
      {
        pain: "Your team loses hours copying data from one tool to another",
        solution:
          "We connect your tools so each piece of data is entered once and reaches wherever it is needed.",
      },
      {
        pain: "Requests are answered late or slip through the cracks",
        solution:
          "Every lead is classified, assigned and gets an automatic first reply; the person responsible is alerted straight away.",
      },
      {
        pain: "Your processes depend on one person",
        solution:
          "We document each workflow and train the team, with error alerts and a manual plan if something fails.",
      },
    ],
    outcomes: [
      "Hours back every week for work that adds value",
      "Faster replies to customers and opportunities",
      "Fewer errors when data moves between tools",
      "Documented processes that do not depend on one person",
    ],
    services: [
      {
        id: "automatizacion-formularios",
        name: "Form automation",
        description: "Every request arrives sorted where it needs to go, with no manual step.",
      },
      {
        id: "email-automatico",
        name: "Automated email",
        description: "Confirmations, follow-ups and reminders sent on their own at the right time.",
      },
      {
        id: "clasificacion-leads",
        name: "AI lead qualification",
        description: "Leads are scored and routed by interest and urgency.",
      },
      {
        id: "integraciones-crm",
        name: "CRM integrations",
        description:
          "We connect your website, email and tools to the CRM you already use, or help you choose one.",
      },
      {
        id: "flujos-internos",
        name: "Internal workflows",
        description: "Approvals, alerts and tasks across teams without chasing anyone by email.",
      },
      {
        id: "reduccion-tareas",
        name: "Repetitive task removal",
        description: "We find what is done by hand over and over and automate it.",
      },
    ],
    faqs: [
      {
        question: "How much does business process automation cost?",
        answer:
          "A first project with a review of your processes and up to three automations starts at €890, VAT excluded. The final price depends on how many tools need connecting, and we agree it before starting.",
      },
      {
        question: "Which processes can be automated with AI?",
        answer:
          "Those that always follow the same steps: logging requests, sending confirmations, updating records, raising alerts or preparing reports. AI adds what used to need someone to read and decide: classifying messages, extracting data from documents or drafting a reply.",
      },
      {
        question: "Do I have to replace the tools I already use?",
        answer:
          "Usually not. We work with what you have (email, spreadsheets, CRM) and only suggest changes when they bring a clear improvement.",
      },
      {
        question: "What happens if an automation fails?",
        answer:
          "Every workflow includes error alerts and a manual fallback. We document it so your team knows what to do in each case.",
      },
    ],
    relatedPlanIds: ["automation-pack", "growth-web-ia", "custom-enterprise"],
  },
  {
    id: "chatbots-ia",
    name: "AI chatbots and agents",
    icon: "ai",
    seoTitle: "AI chatbots and AI agents for business, from €750",
    seoDescription:
      "AI chatbots and AI agents for business, trained on your own information and supervised by people: 24/7 customer service and internal assistants. From €750.",
    headline: "AI chatbots and AI agents for businesses",
    topic: "AI chatbots and agents",
    summary:
      "Chatbots, internal assistants and AI agents that answer with your company's information and hand the conversation to a person when needed.",
    description:
      "We apply AI where it delivers measurable value: answering frequent questions around the clock, helping your team find information or completing simple tasks. We start with one narrow use case, measure the result and only then expand.",
    answer:
      "lguia develops AI agents and chatbots for businesses: customer-service assistants, internal search over company documentation, and agents that complete tasks such as logging a request. They are trained on verified company information, comply with the GDPR and hand over to a person when needed. A first project starts at €750 and goes live in 3 to 4 weeks.",
    problems: [
      {
        pain: "You answer the same questions every day",
        solution:
          "An assistant trained on your FAQs and documents answers instantly and leaves your team the cases that need judgement.",
      },
      {
        pain: "Your team wastes time looking for internal information",
        solution:
          "AI search over your procedures, catalogues and documentation that answers and cites the source.",
      },
      {
        pain: "You want to use AI but do not know where to start or what the risks are",
        solution:
          "We pick a first use case with a clear return, restrict the AI to verified information and define when a person steps in.",
      },
    ],
    outcomes: [
      "Frequent questions answered outside business hours too",
      "Your team finds internal information in seconds",
      "Consistent answers based on your own documents",
      "Always with the option to hand over to a person",
    ],
    services: [
      {
        id: "chatbots",
        name: "Customer service chatbots",
        description: "They answer your customers' frequent questions with verified information.",
      },
      {
        id: "agentes-ia",
        name: "AI agents",
        description:
          "Assistants that complete simple tasks, such as logging a request or checking an order status.",
      },
      {
        id: "asistentes-internos",
        name: "Internal assistants",
        description: "Smart search over your procedures, catalogues and documentation.",
      },
      {
        id: "respuestas-automaticas",
        name: "Assisted replies",
        description: "Draft replies for email or forms that your team reviews before sending.",
      },
      {
        id: "bases-conocimiento",
        name: "Knowledge bases",
        description: "We organise your company's information so the AI answers accurately.",
      },
      {
        id: "flujos-atencion",
        name: "Customer service workflows",
        description: "We define when the AI answers and when someone on your team takes over.",
      },
    ],
    faqs: [
      {
        question: "What is an AI agent and how is it different from a chatbot?",
        answer:
          "A chatbot answers questions. An AI agent also takes actions: it queries a system, logs a request or updates a record following rules we define with you. Both are trained on your company's information.",
      },
      {
        question: "How much does an AI agent or chatbot cost?",
        answer:
          "A first project, with use-case discovery, a chatbot or assistant trained on your information and a month of tuning, starts at €750, VAT excluded. Agents connected to several systems are quoted to order.",
      },
      {
        question: "Can the AI give wrong answers?",
        answer:
          "It can happen. That is why we restrict the assistant to your verified information, define the topics it must not handle and add a handover to a person.",
      },
      {
        question: "What about data privacy?",
        answer:
          "We choose providers and settings that comply with the GDPR, avoid sending unnecessary personal data and document what information is used.",
      },
      {
        question: "Do I need a lot of data to get started?",
        answer:
          "No. Your FAQs, your website and a few key documents are usually enough for a useful first assistant.",
      },
    ],
    relatedPlanIds: ["ia-starter", "growth-web-ia", "custom-enterprise"],
  },
  {
    id: "seo-geo",
    name: "SEO + GEO",
    icon: "search",
    seoTitle: "SEO and GEO services for businesses",
    seoDescription:
      "SEO and GEO services: a website Google crawls cleanly and that ChatGPT, Perplexity and Gemini can understand and cite. Measurable work, no empty promises.",
    headline: "SEO and GEO services for businesses",
    topic: "SEO and GEO",
    summary:
      "Technical SEO, well-structured content and structured data to show up on Google and in answers from ChatGPT, Perplexity or Gemini.",
    description:
      "Your buyers search on Google and ask assistants such as ChatGPT, Perplexity or Gemini. We work on the technical foundation, the structure of your content and structured data so your company is understood in both. No promises of top positions: measurable, continuous work.",
    answer:
      "lguia provides SEO and GEO (generative engine optimization) for businesses: technical SEO, content architecture, schema.org structured data and clear, verifiable content so that search engines and AI assistants such as ChatGPT, Perplexity and Gemini understand the business and can cite it. It is included in web projects from €590 and continues as ongoing work with monthly reporting. Nobody can guarantee rankings or citations, and lguia does not promise them.",
    problems: [
      {
        pain: "You do not show up when people search for what you offer",
        solution:
          "We fix the technical foundation and organise your pages around the searches your customers actually make.",
      },
      {
        pain: "AI assistants do not mention your company",
        solution:
          "We publish clear, structured, verifiable information about who you are, what you offer and at what price, which is what those systems can understand and cite.",
      },
      {
        pain: "You pay for SEO and cannot tell what you are getting",
        solution:
          "We agree what to measure from the start and review visibility and the leads it brings every month.",
      },
    ],
    outcomes: [
      "A site search engines crawl and interpret without problems",
      "Content organised around what your customers search for",
      "Clear information about your business for AI assistants",
      "Monthly tracking of visibility and leads",
    ],
    services: [
      {
        id: "seo-tecnico",
        name: "Technical SEO",
        description: "Speed, indexing, architecture and technical errors, fixed.",
      },
      {
        id: "estructura-contenidos",
        name: "Content architecture",
        description: "Pages organised around the searches your customers actually make.",
      },
      {
        id: "estructura-semantica",
        name: "Semantic structure",
        description: "HTML and headings that explain your content to search engines and readers.",
      },
      {
        id: "datos-estructurados",
        name: "Structured data",
        description:
          "schema.org markup so search engines understand your company and your services.",
      },
      {
        id: "optimizacion-busqueda",
        name: "On-page optimisation",
        description: "Continuous improvement of titles, descriptions and internal links.",
      },
      {
        id: "geo",
        name: "Generative engine optimization (GEO)",
        description: "Clear, verifiable content that AI assistants can understand and cite.",
      },
    ],
    faqs: [
      {
        question: "What is GEO (generative engine optimization)?",
        answer:
          "GEO means preparing your content so AI assistants can understand it and cite it: clear, structured, verifiable information about your company, your services and your prices.",
      },
      {
        question: "What is the difference between SEO and GEO?",
        answer:
          "SEO aims to get your pages into a search engine's results. GEO aims to get an AI assistant to understand your business and mention it in its answer. They share a foundation: a fast, well-structured site with reliable information.",
      },
      {
        question: "Do you guarantee the top position on Google?",
        answer:
          "No. Nobody can honestly guarantee that, on Google or in AI assistants. What we do guarantee is technical work that is correct, measurable and transparent.",
      },
      {
        question: "When will I see results?",
        answer:
          "Technical improvements show within weeks. Organic growth usually settles in 3 to 6 months, depending on how competitive your sector is.",
      },
    ],
    relatedPlanIds: ["starter-local", "web-pro", "growth-web-ia"],
  },
];
