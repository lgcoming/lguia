import type { DiagnosisContent } from "@/features/diagnosis/content/types";

const WEB_REFERENCES =
  "Gather what you already have: logo, copy, photos and websites you like as references.";

export const diagnosisContentEn: DiagnosisContent = {
  steps: {
    web: {
      title: "Your online presence",
      description: "How customers find you and get in touch today.",
    },
    processes: {
      title: "Processes and automation",
      description: "How much manual work your team does day to day.",
    },
    ai: {
      title: "Artificial intelligence",
      description: "The role AI plays, or could play, in your business.",
    },
    visibility: {
      title: "Search visibility",
      description: "How easy it is to find you on Google and in AI assistants.",
    },
    company: {
      title: "Your company",
      description: "So the recommendation fits your size and your goals.",
    },
  },
  questions: {
    websiteStatus: {
      label: "What is your business website like today?",
      options: {
        none: "We do not have a website",
        outdated: "We have one, but it is dated or rarely updated",
        basic: "It works, but we have outgrown it",
        modern: "It is modern and we keep it up to date",
      },
    },
    sellsOnline: {
      label: "Do you sell your products or services online?",
      options: {
        yes: "Yes, we already sell online",
        planned: "Not yet, but we want to",
        no: "No, we do not need to",
      },
    },
    webLeads: {
      label: "Do you get potential customers through your website?",
      options: {
        regular: "Yes, regularly",
        occasional: "Now and then",
        none: "Rarely or never",
      },
    },
    automationLevel: {
      label:
        "Do you use tools that automate tasks, such as connected forms, automatic emails or a CRM?",
      options: {
        none: "No, almost everything is done by hand",
        basic: "A few stand-alone tools",
        advanced: "Yes, our processes are connected",
      },
    },
    repetitiveWorkload: {
      label:
        "How much time does your team spend on repetitive tasks, such as copying data, answering the same questions or preparing quotes?",
      options: {
        high: "A lot: several hours a week",
        medium: "Some, but it is manageable",
        low: "Very little",
      },
    },
    aiAdoption: {
      label: "Where are you with artificial intelligence?",
      options: {
        none: "It is not a priority right now",
        interested: "We are interested, but do not know where to start",
        exploring: "We use it occasionally (ChatGPT, Copilot…)",
        using: "It is already part of some processes",
      },
    },
    chatbotInterest: {
      label:
        "Would you be interested in an AI chatbot or assistant that handles questions from customers or your team?",
      options: {
        yes: "Yes, it would save us a lot of time",
        maybe: "Maybe, I would like to know more",
        no: "Not for now",
      },
    },
    seoStatus: {
      label: "Do you work on search engine optimisation (SEO)?",
      options: {
        none: "No, never",
        occasional: "A little, with no clear strategy",
        active: "Yes, continuously",
      },
    },
    visibilityGoal: {
      label: "Do you want to rank better on Google and appear in AI assistants' answers?",
      options: {
        priority: "Yes, it is a priority",
        interested: "I am interested, but it is not urgent",
        "not-now": "It is not important right now",
      },
    },
    companySize: {
      label: "How many people work at your company?",
      options: {
        solo: "Just me",
        micro: "2 to 9",
        small: "10 to 49",
        medium: "50 to 249",
        large: "250 or more",
      },
    },
    mainGoal: {
      label: "What do you want to achieve in the next few months?",
      options: {
        presence: "A professional online image",
        leads: "More leads and customers",
        sales: "Sell more online",
        efficiency: "Save time by automating tasks",
        ai: "Start using AI in a way that makes sense",
        growth: "Digitalise the business in depth to grow",
      },
    },
  },
  requiredMessage: "Select an option to continue.",
  engine: {
    areas: {
      web: "Web presence",
      automation: "Automation",
      ai: "Artificial intelligence",
      visibility: "Search visibility",
    },
    levels: {
      initial: {
        label: "Early stage",
        summary:
          "Your business has a lot of room to improve online. A few well-chosen changes will make a visible difference.",
      },
      developing: {
        label: "Developing",
        summary:
          "You have a digital foundation, but there are specific areas where you are missing opportunities.",
      },
      advanced: {
        label: "Advanced",
        summary:
          "Your business is well digitalised. The next step is to optimise and get more out of what you already have.",
      },
    },
    ruleReasons: {
      large:
        "Given the size of your company, the most effective route is a custom project that starts by reviewing processes and systems.",
      mediumComplex:
        "You have several high-potential areas and a large team: it makes sense to plan them together in a custom project.",
      growth:
        "Several areas have a lot of room at once: a joint plan avoids stand-alone solutions that do not talk to each other.",
      webStarter:
        "For a business of your size, a professional website with local SEO is the foundation with the best return.",
      webPro:
        "Your biggest opportunity is the website: you need a more complete one, built to win customers.",
      seoStarter: "To be found, you first need a professional website with local SEO done right.",
      seoPro:
        "Your biggest opportunity is visibility: Web Pro includes technical SEO and readiness for AI answers.",
      automation:
        "Your biggest opportunity is automating processes: that is where you can win back the most time.",
      ai: "Your biggest opportunity is artificial intelligence, applied to specific day-to-day tasks.",
    },
    solidBaseReason: "Your digital foundation is solid: the most room to improve is in {area}.",
    areaPhrases: {
      web: "your website",
      automation: "process automation",
      ai: "artificial intelligence",
      seo: "search visibility",
    },
    signalReasons: {
      noWebsite:
        "You do not have a website yet, and it is the first thing customers check before getting in touch.",
      outdatedWebsite:
        "Your current website is dated and does not reflect how your business works today.",
      noWebLeads:
        "Your website generates almost no leads: it needs to be built around turning visits into customers.",
      plansToSell: "You want to start selling online and need a store that is ready for it.",
      highRepetitive: "Your team spends many hours on repetitive tasks that can be automated.",
      noAutomation:
        "Almost everything is done by hand: connecting your tools cuts errors and time.",
      wantsChatbot:
        "You are interested in an assistant that handles enquiries, a clear starting point for AI.",
      aiInterested: "You want to start with AI and need a clear, measurable first use case.",
      aiExploring:
        "You already use AI occasionally: the next step is to build it into specific processes.",
      aiUsing:
        "You already use AI in some processes: the next step is to extend it to new tasks in an orderly way.",
      noSeo: "You do not work on SEO and want more visibility on search engines and AI assistants.",
    },
    fallbackReasons: {
      web: "A well-maintained, measured website keeps delivering results over time.",
      automation: "Reviewing your processes regularly stops manual tasks from creeping back.",
      ai: "Starting with a narrow use case lets you measure the value of AI before expanding it.",
      seo: "Looking after the technical foundation and the content keeps you visible against competitors.",
    },
    serviceReasons: {
      "web-corporativa":
        "A professional website that explains clearly what you do and how to contact you.",
      "rediseno-web": "Rebuild your website so it builds trust and works well on mobile.",
      "landing-pages": "Pages focused on your key services to turn visits into leads.",
      ecommerce: "An online store that is easy to run, so you can start selling online.",
      "optimizacion-rendimiento": "A faster store reduces drop-offs and improves conversion.",
      chatbots: "A chatbot that answers your customers' frequent questions around the clock.",
      "asistentes-internos": "An internal assistant so your team finds information instantly.",
      "reduccion-tareas": "Automate the tasks that are repeated by hand every week.",
      "clasificacion-leads":
        "Qualify and answer the leads that come in through the website, automatically.",
      "integraciones-crm": "Connect your tools to a CRM so no opportunity is lost.",
      "seo-tecnico": "Fix the technical foundation so search engines understand your website.",
      geo: "Prepare your content to appear in AI assistants' answers.",
    },
    flagshipReasons: {
      web: "Review your website's speed and conversion to get more out of it.",
      automation: "Find the tasks still done by hand and automate them.",
      ai: "A chatbot that answers your customers' frequent questions around the clock.",
      seo: "Review the technical foundation so search engines understand your website better.",
    },
    nextSteps: {
      first:
        "Leave your details and we will go through the assessment with you on a 30-minute call, with no obligation.",
      last: "Then we will send you a proposal with scope, timeline and a detailed quote.",
      preparation: {
        "starter-local": WEB_REFERENCES,
        "web-pro": WEB_REFERENCES,
        "ia-starter":
          "Write down the questions your customers or your team ask most often: they will be the basis of the assistant.",
        "automation-pack":
          "List the three repetitive tasks that take the most time out of your week.",
        "growth-web-ia":
          "Decide which result you want to measure first: leads, sales or hours saved.",
        "custom-enterprise":
          "Identify the key people and the systems involved (ERP, CRM, internal tools).",
      },
    },
  },
  ui: {
    intro: {
      title: "Find out what to improve first in your business",
      text: "Answer {count} questions about your website, your processes, artificial intelligence and your search visibility. At the end you will see:",
      outcomes: [
        "Your digital maturity score, from 0 to 100, by area",
        "The plan that best fits your business, and why",
        "The services and next steps we recommend",
      ],
      facts: { steps: "5 short steps", time: "About 3 minutes", signup: "No sign-up" },
      factLabels: { steps: "Steps", time: "Duration", signup: "Sign-up" },
      privacy:
        "Your answers are only used to calculate the result and are not stored. If you want us to contact you, we will ask for your details at the end.",
      start: "Start the assessment",
    },
    progress: "Step {current} of {total}",
    stepPrefix: "Step {current} of {total}:",
    previous: "Back",
    next: "Next",
    finish: "See my assessment",
    calculating: {
      title: "Analysing your answers…",
      text: "We are calculating your score and the plan that best fits your business.",
    },
    error: {
      title: "We could not calculate your assessment",
      answersKept: "Your answers are still saved.",
      retry: "Try again",
      review: "Review answers",
      offline: "You seem to be offline.",
      invalid: "One of the answers is not valid.",
      server: "There was a problem on our server.",
    },
    result: {
      title: "Your digital assessment",
      subtitle: "Based on the answers you gave today.",
      scoreHeading: "Your score: {score} out of 100, level {level}",
      outOf: "out of 100",
      maturity: "Digital maturity level",
      planEyebrow: "Recommended plan",
      vatExcluded: "excl. VAT",
      why: "Why we recommend it",
      planLink: "See what {plan} includes",
      services: "Recommended services",
      moreAbout: "More about {category}",
      nextSteps: "Next steps",
      change: "Change my answers",
    },
    leadForm: {
      title: "Shall we go through this assessment with you?",
      text: "Leave your details and we will send you a proposal for the {plan} plan, with no obligation.",
      messageLabel: "Anything else we should know?",
      consent:
        "I have read the data protection information and agree to lguia using my details and my assessment to prepare a proposal.",
      submit: "Send me a proposal",
      successTitle: "Thank you, {name}. We have received your assessment.",
      successText: "We will write to {email} within 2 working days to arrange a 30-minute call.",
    },
  },
};
