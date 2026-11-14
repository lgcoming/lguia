import type { Dictionary } from "@/i18n/dictionaries/es";

/*
 * Site copy in English (en). Localised for international buyers, not translated word for word.
 * Prices quoted here must match src/data/en/plans.ts (a unit test checks it).
 */
export const en: Dictionary = {
  meta: {
    homeTitle: "lguia: custom web development, AI automation and AI agents",
    description:
      "Custom web development, AI automation and AI agents for businesses. Fixed quotes, clear timelines and a free 3-minute digital assessment.",
    ogAlt: "lguia: custom web development, AI automation and AI agents for business",
    ogHeadline: "Custom websites, AI automation and AI agents that solve real business problems",
    ogTagline: "Web development, AI automation and AI agents agency",
  },
  common: {
    skipLink: "Skip to content",
    logoLabel: "lguia, go to the home page",
    diagnosisCta: "Take the free assessment",
    diagnosisCtaShort: "Free assessment",
    proposalCta: "Request a proposal",
    servicesCta: "View services",
    learnMore: "Learn more",
    breadcrumbs: "Breadcrumbs",
    home: "Home",
    pauseVideo: "Pause background video",
    playVideo: "Play background video",
  },
  nav: {
    primary: "Main",
    mobile: "Main, mobile",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    services: "Services",
    pricing: "Pricing",
    contact: "Contact",
    switchLanguage: "Switch language to {language}",
  },
  footer: {
    statement: "Custom web development, automation and artificial intelligence for businesses.",
    services: "Services",
    company: "lguia",
    talk: "Get in touch",
    pricing: "Plans and pricing",
    diagnosis: "Digital assessment",
    contact: "Contact",
    remote: "We work remotely, in English and Spanish.",
    rights: "All rights reserved.",
    language: "Language",
  },
  stickyCta: {
    text: "Free assessment in 3 minutes",
    button: "Start",
  },
  diagnosisCta: {
    title: "Not sure where to start?",
    text: "Answer 11 questions about your business and find out what to improve first. It is free, takes about 3 minutes and you do not need to sign up to see the result.",
    outcomesLabel: "What you get from the assessment",
    outcomes: [
      { title: "Your digital maturity level", text: "A score from 0 to 100, by area." },
      { title: "The plan that fits best", text: "With the reasons, in plain language." },
      { title: "Your next steps", text: "What to do first to see results." },
    ],
    preview: {
      label: "Example of a digital assessment result",
      title: "Digital assessment",
      caption: "Example: dental clinic, 8 people",
      recommended: "Recommended plan",
      today: "Today",
      points: "{score} points",
    },
  },
  contactCta: {
    title: "Tell us about your project and get a proposal",
    text: "Write to us with what you have in mind and we will reply within 2 working days with an initial assessment, with no obligation.",
  },
  planCard: {
    from: "From",
    vatExcluded: "excl. VAT",
    timeline: "Estimated timeline",
    idealFor: "Ideal for",
  },
  home: {
    hero: {
      eyebrow: "Custom web development, AI automation and AI agents agency",
      title: "Custom websites, AI automation and AI agents that solve real business problems",
      subtitle:
        "We build websites that win customers, automate processes with AI and develop AI agents for your team. Fixed quotes, clear timelines and results you can measure.",
      reassurances: ["Free, no obligation", "11 questions, about 3 minutes", "Instant result"],
      outroTitle: "Your website, your processes and AI, finally connected.",
      outroText: "We design every piece to work with the others, with no stand-alone tools.",
    },
    about: {
      title: "A web development and AI agency that starts with your business, not the technology",
      paragraphs: [
        "lguia is a digital agency that builds custom websites, automates processes and applies artificial intelligence in companies. We work remotely from Spain, in English and Spanish, with fixed quotes and with the code, the data and the accounts always in the client's name.",
        "One team handles all three areas so everything fits together: your website captures leads, automations organise them and AI helps you answer sooner.",
      ],
      facts: [
        { title: "One team", text: "Web, automation and AI coordinated from day one." },
        {
          title: "Fixed quote",
          text: "You know what is included and what it costs before we start.",
        },
        { title: "Real follow-through", text: "We stay with you after launch." },
      ],
    },
    services: {
      title: "Web development, automation and AI services",
      intro:
        "Four areas that complement each other. You can start with one and add the others when it makes sense.",
      link: "View all services",
    },
    problems: {
      title: "Business problems we solve",
      intro: "If any of these sounds familiar, we can help.",
      items: [
        {
          pain: "My website does not bring in customers",
          solution:
            "We rebuild the site around conversion: clear messaging, visible calls to action and forms that work.",
          service: "desarrollo-web",
          link: "View custom web development",
        },
        {
          pain: "I do not show up when people search for me",
          solution:
            "We work on technical SEO and content so the people looking for what you offer find you, in AI assistants too.",
          service: "seo-geo",
          link: "View SEO + GEO",
        },
        {
          pain: "I answer the same questions all day",
          solution:
            "An AI agent handles frequent enquiries and leaves you the ones that need your judgement.",
          service: "chatbots-ia",
          link: "View AI agents and chatbots",
        },
        {
          pain: "We lose hours copying data",
          solution:
            "We connect forms, email and your CRM so information flows without being passed from hand to hand.",
          service: "automatizaciones",
          link: "View AI automation",
        },
        {
          pain: "Leads get lost or are answered late",
          solution:
            "Every request is classified and assigned automatically, with an alert to the person responsible.",
          service: "automatizaciones",
          link: "View AI automation",
        },
        {
          pain: "I want to use AI, but I do not know where to start",
          solution:
            "We identify a first use case with a clear return and get it running in a few weeks.",
          service: "chatbots-ia",
          link: "View AI agents and chatbots",
        },
      ],
    },
    plans: {
      title: "Plans and pricing to start on the right foot",
      intro:
        "Indicative prices, so you know what we are talking about from the start. The final quote is agreed after the assessment.",
      link: "View all plans",
    },
    audience: {
      title: "The companies we work with",
      intro: "Companies in any sector. These are some we fit especially well.",
      sectors: [
        {
          name: "Retail and online shops",
          example: "Online store, Google Business Profile and automatic order alerts.",
        },
        {
          name: "Clinics and health centres",
          example: "Online booking, reminders and answers to frequent questions.",
        },
        {
          name: "Law and accounting firms",
          example: "Client acquisition and organised paperwork without chasing anyone.",
        },
        {
          name: "Restaurants and hospitality",
          example: "Reservations, an always up-to-date menu and search visibility.",
        },
        {
          name: "Industry and B2B companies",
          example: "Technical catalogue, quote requests and a connected CRM.",
        },
        {
          name: "Schools and training centres",
          example: "Enrolments, an assistant for questions and automated communications.",
        },
      ],
      closing:
        "If your company has customers looking for you online or tasks that repeat every week, we can probably help.",
    },
    process: {
      title: "How we work",
      intro: "A clear, phased process, so you always know where your project stands.",
    },
    benefits: {
      title: "Why work with lguia",
      items: [
        {
          title: "The problem first",
          text: "We understand what your business needs before proposing any tool. Technology comes afterwards, and only what is needed.",
        },
        {
          title: "No jargon",
          text: "We explain every decision in plain language and train you so you can work independently.",
        },
        {
          title: "Measurable results",
          text: "We agree from the start what we will measure: leads, sales or hours saved.",
        },
        {
          title: "Everything in your name",
          text: "Your website, your data and your accounts are yours. No forced dependencies.",
        },
        {
          title: "Responsible AI",
          text: "Only where it adds value, with human oversight and in line with the GDPR.",
        },
        {
          title: "Fast and accessible",
          text: "Websites that load fast and work for everyone, search engines included.",
        },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "What does lguia do?",
          answer:
            "lguia is a digital agency that builds custom websites, automates business processes with AI, develops AI agents and chatbots, and works on SEO and GEO for companies. One team handles all four areas so they work together.",
        },
        {
          question: "How much does a project with lguia cost?",
          answer:
            "We publish indicative starting prices, VAT excluded: a professional website from €690, an automation pack from €950, a first AI agent or chatbot from €1,200, a custom corporate website from €1,900 and a combined web, SEO, AI and automation project from €3,900. The final quote is fixed and agreed before we start.",
        },
        {
          question: "How long does a project take?",
          answer:
            "Between 2 and 10 weeks depending on scope: 2 to 4 weeks for a simple website or an automation pack, 4 to 6 for a corporate website and 8 to 10 for a combined project.",
        },
        {
          question: "Do you work with companies outside Spain?",
          answer: "Yes. We work remotely, in English and Spanish, with companies in any country.",
        },
        {
          question: "What is the free digital assessment?",
          answer:
            "An 11-question questionnaire that takes about 3 minutes and instantly returns a digital maturity score from 0 to 100, the plan that best fits your company and the next steps. No sign-up required.",
        },
      ],
    },
  },
  servicesPage: {
    metaTitle: "Web development, AI automation and AI agent services",
    metaDescription:
      "Custom web development, AI automation, AI agents and SEO + GEO for businesses. Four services that work together, with fixed quotes.",
    title: "Custom web development, AI automation and AI agent services for business",
    intro:
      "A website that wins customers, automations that save time, AI agents applied with judgement and visibility in search. You can start with one service and add the others when it makes sense.",
    areasTitle: "Four services, one team",
    areasIntro: "Choose a service to see what it includes, how we work and what it costs.",
    more: "More about {name}",
  },
  servicePage: {
    services: "Services",
    answerTitle: "In short",
    facts: {
      from: "From",
      timeline: "Timeline",
      quote: "Quote",
      quoteValue: "Fixed before we start",
      customQuote: "Custom",
    },
    problemsTitle: "Problems it solves",
    includesTitle: "What is included",
    outcomesTitle: "What your company gets",
    processTitle: "How we do it",
    processIntro:
      "The same phased process in all our projects, so you always know what comes next.",
    plansTitle: "Plans and pricing",
    plansIntro: "Indicative prices, VAT excluded. The final quote is agreed after the assessment.",
    faqTitle: "Frequently asked questions",
    othersTitle: "Other services",
    midCta: {
      title: "Shall we talk about your case?",
      text: "Tell us what you need and we will send a proposal with scope, timeline and a fixed quote.",
    },
  },
  pricingPage: {
    metaTitle: "Pricing for web development, AI automation and AI agents",
    metaDescription:
      "Pricing for custom web development, AI automation and AI agents: plans from €690, with estimated timelines and a fixed quote after a free assessment.",
    title: "Plans and pricing for every stage of your company",
    intro:
      "Choose a starting point. Every project begins with an assessment and ends with a fixed quote, with no surprises.",
    heroCta: "Find out which plan fits you",
    allPlans: "All plans",
    note: "Indicative prices, VAT excluded. The final quote depends on the scope of each project and is agreed with you after the assessment, before we start.",
    guideTitle: "Which plan fits you?",
    guideIntro:
      "A quick guide. If you are still unsure, the digital assessment recommends a plan, with its reasons, in about 3 minutes.",
    guide: [
      {
        situation:
          "You are a freelancer or run a local business and have no website yet, or yours is out of date.",
        plan: "starter-local",
      },
      {
        situation: "Your company needs a complete corporate website that wins customers and ranks.",
        plan: "web-pro",
      },
      {
        situation: "You get many repeated enquiries and want to try AI on one specific case.",
        plan: "ia-starter",
      },
      {
        situation: "Your team loses hours copying data and answering the same things.",
        plan: "automation-pack",
      },
      {
        situation: "You want web, SEO, AI and automation working together in order to grow.",
        plan: "growth-web-ia",
      },
      {
        situation: "You have several departments, in-house systems or complex needs.",
        plan: "custom-enterprise",
      },
    ],
    faqTitle: "Frequently asked questions about the plans",
  },
  diagnosisPage: {
    metaTitle: "Free digital maturity assessment",
    metaDescription:
      "Free digital maturity assessment for businesses: answer 11 questions and in 3 minutes get your score, the plan that fits best and your next steps. No sign-up.",
    title: "Free digital maturity assessment",
    intro:
      "In about 3 minutes you will know where your business stands, which plan fits best and where to start. No sign-up, no obligation.",
    noscript:
      "The assessment needs JavaScript to work. If you prefer, tell us about your case on the {link}.",
    noscriptLink: "contact page",
    coversTitle: "What the assessment covers",
    coversIntro:
      "Eleven questions in five blocks. At the end you get a score from 0 to 100 by area, the recommended plan with its reasons and your next steps.",
  },
  contactPage: {
    metaTitle: "Contact: request a proposal",
    metaDescription:
      "Tell us about your web development, automation or AI project and get an initial assessment within 2 working days, with no obligation.",
    title: "Let's talk about your project",
    intro:
      "Tell us what you need and we will reply with an initial assessment, with no obligation. The more specific you are, the more useful our answer will be.",
    formTitle: "Write to us",
    nextTitle: "What happens next",
    nextSteps: [
      { title: "We read your message", text: "We reply within 2 working days." },
      {
        title: "We talk for 30 minutes",
        text: "A call to understand your business and what you need.",
      },
      {
        title: "We send you a proposal",
        text: "With scope, timeline and a fixed quote. No obligation.",
      },
    ],
    emailTitle: "Prefer email?",
    unsureTitle: "Not sure what you need?",
    unsureText: "The digital assessment gives you a recommendation in about 3 minutes.",
    unsureLink: "Take the assessment",
  },
  notFound: {
    metaTitle: "Page not found",
    eyebrow: "Error 404",
    title: "We could not find this page",
    text: "The address may have changed or the link may be wrong. These pages can help:",
    home: "Go to the home page",
    services: "View services",
    diagnosis: "Take the assessment",
  },
  legal: {
    footerLabel: "Legal information",
    updatedLabel: "Last updated",
    updated: "14 November 2026",
    pages: {
      legal: {
        navLabel: "Legal notice",
        metaTitle: "Legal notice",
        metaDescription:
          "Who runs lguia.com and the terms of use of the website, under Spanish law (LSSI-CE).",
        title: "Legal notice",
        intro:
          "Under Spanish Law 34/2002 on information society services and electronic commerce (LSSI-CE), these are the details of the owner of this website and the terms for using it.",
        sections: [
          {
            heading: "Website owner",
            paragraphs: [
              "Owner: {owner}, a professional who trades under the name {brand}.",
              "Website: lguia.com. Contact email: {email}.",
              "Activity: custom web development, process automation and AI implementation for businesses.",
            ],
          },
          {
            heading: "Terms of use",
            paragraphs: [
              "Access to this website is free and needs no registration. By using it you accept these terms.",
              "You agree to use the content properly and not for unlawful activities or anything that harms others or the operation of the site.",
            ],
          },
          {
            heading: "Information and prices",
            paragraphs: [
              "Published prices are indicative, exclude VAT and are not a binding offer. Every project is quoted in writing before work starts.",
              "The digital assessment is automatic guidance based on your answers; it does not replace a professional review of your case.",
            ],
          },
          {
            heading: "Intellectual and industrial property",
            paragraphs: [
              "The text, design, code, logos and the {brand} brand belong to their owner. They may not be reproduced, distributed or altered without express permission.",
              "Third-party photographs and videos are used under their licences.",
            ],
          },
          {
            heading: "Liability",
            paragraphs: [
              "The owner works to keep the information accurate and up to date, but does not guarantee that it is free of errors or that the site is always available.",
              "Links to third-party sites are provided for reference only; the owner is not responsible for their content.",
            ],
          },
          {
            heading: "Governing law",
            paragraphs: [
              "These terms are governed by Spanish law. Any dispute will be settled by the courts that have jurisdiction under the applicable rules, including consumer protection law where it applies.",
            ],
          },
        ],
      },
      privacy: {
        navLabel: "Privacy",
        metaTitle: "Privacy policy",
        metaDescription:
          "What personal data lguia processes when you use its forms, why, for how long and how to exercise your rights.",
        title: "Privacy policy",
        intro:
          "This policy explains what personal data we process when you use the forms on lguia.com, why, and what rights you have under the General Data Protection Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018.",
        sections: [
          {
            heading: "Data controller",
            paragraphs: [
              "{owner}, who trades under the name {brand}.",
              "Contact for any question about your data: {email}.",
            ],
          },
          {
            heading: "What data we process",
            paragraphs: [
              "The data you give us in the contact and assessment forms: name, email address and, if you provide them, company, phone, service of interest and message.",
              "In the assessment, also your answers about the digital situation of your business and the calculated result.",
              "We do not ask for special categories of data. The site is aimed at businesses and professionals, not at children under 14.",
            ],
          },
          {
            heading: "Why we use it",
            paragraphs: [
              "To answer your request and, if you ask for it, prepare and send you a proposal or a quote.",
              "We do not use it to send you advertising and we make no automated decisions about you: the assessment result is guidance only.",
            ],
          },
          {
            heading: "Legal basis",
            paragraphs: [
              "Your consent, given when you send the form (Article 6(1)(a) GDPR), and steps taken at your request before entering into a contract (Article 6(1)(b) GDPR). You can withdraw your consent at any time without affecting earlier processing.",
            ],
          },
          {
            heading: "How long we keep it",
            paragraphs: [
              "While we handle your request and, if we do not end up working together, for up to 12 months after the last contact. If you hire a service, for the length of the relationship and the periods required by law, such as tax rules.",
            ],
          },
          {
            heading: "Who else can access your data",
            paragraphs: [
              "We do not share your data with third parties unless the law requires it.",
              "Providers process data on our behalf: Cloudflare, Inc. hosts the website and delivers the forms to us by email, and our email provider receives them. They may process data outside the European Economic Area with the safeguards provided by the GDPR, such as the EU-US Data Privacy Framework and standard contractual clauses.",
            ],
          },
          {
            heading: "Your rights",
            paragraphs: [
              "You can ask for access, rectification, erasure, objection, restriction of processing and portability of your data by writing to {email}. We will answer within one month at the latest.",
              "If you believe we have not handled your request properly, you can complain to the Spanish Data Protection Agency (aepd.es) or to the authority of your country.",
            ],
          },
        ],
      },
      cookies: {
        navLabel: "Cookies",
        metaTitle: "Cookie policy",
        metaDescription:
          "lguia.com uses no analytics, advertising or tracking cookies. Which technical cookies its hosting provider may use.",
        title: "Cookie policy",
        intro: "This policy explains the use of cookies and similar technologies on lguia.com.",
        sections: [
          {
            heading: "Which cookies we use",
            paragraphs: [
              "lguia.com uses no analytics, advertising or tracking cookies of its own, and stores nothing in your browser to identify you. That is why we do not show you a cookie banner.",
            ],
          },
          {
            heading: "Technical cookies from our provider",
            paragraphs: [
              "Cloudflare, which hosts and protects the website, may use strictly necessary technical cookies to detect malicious traffic and keep the service secure. They are exempt from consent (Article 22.2 LSSI-CE) and are not used to track you.",
            ],
          },
          {
            heading: "Third-party content",
            paragraphs: [
              "The website embeds no videos, maps, social networks or other third-party services that set cookies. Fonts and videos are served from our own domain.",
            ],
          },
          {
            heading: "Changes to this policy",
            paragraphs: [
              "If we ever use cookies that need your consent, we will update this page and ask you before setting them. You can delete or block cookies in your browser settings.",
            ],
          },
        ],
      },
    },
  },
};
