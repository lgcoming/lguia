/** Everything the lead forms say, per language (SPEC-005, SPEC-009). Templates use `{name}`. */

export interface LeadValidationMessages {
  name: string;
  nameTooLong: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
  message: string;
  messageTooLong: string;
  consent: string;
  /** Diagnosis answers missing or tampered with (only reachable through the API). */
  answers: string;
  source: string;
  projectType: string;
  currentSite: string;
  business: string;
  goal: string;
  styles: string;
  palette: string;
  colors: string;
  tone: string;
  logo: string;
  logoSize: string;
}

export interface LeadFormContent {
  validation: LeadValidationMessages;
  fields: {
    name: string;
    email: string;
    company: string;
    phone: string;
    optional: string;
    interest: string;
    message: string;
    messageHint: string;
  };
  /** First option of the interest select: "I am not sure yet". */
  interestGeneral: string;
  consent: string;
  dataProtection: { title: string; text: string; more: string; policy: string };
  honeypotLabel: string;
  submit: string;
  submitting: string;
  errors: { network: string; server: string };
  success: {
    /** `{name}`. */
    title: string;
    /** `{email}` is rendered in bold. */
    text: string;
    /** `{link}` is replaced by a link to the diagnosis with `nextLink` as its text. */
    next: string;
    nextLink: string;
  };
}

type Labels<K extends string> = Record<K, string>;

/** Copy of the free prototype request form (SPEC-012). */
export interface PrototypeFormContent {
  groups: { contact: string; project: string; style: string; content: string; extra: string };
  fields: {
    projectType: string;
    currentSite: string;
    currentSiteHint: string;
    business: string;
    businessHint: string;
    goal: string;
    styles: string;
    stylesHint: string;
    palette: string;
    colors: string;
    colorsHint: string;
    /** `{n}`: position of the colour. */
    color: string;
    addColor: string;
    /** `{n}`: position of the colour. */
    removeColor: string;
    tone: string;
    sections: string;
    sectionsHint: string;
    references: string;
    referencesHint: string;
    logo: string;
    logoHint: string;
    /** `{name}`: file name. */
    logoSelected: string;
    logoRemove: string;
    message: string;
    messageHint: string;
  };
  options: {
    projectType: Labels<"new" | "redesign">;
    goal: Labels<"leads" | "sales" | "bookings" | "brand" | "portfolio">;
    styles: Record<
      "minimal" | "corporate" | "modern" | "warm" | "bold" | "premium",
      { label: string; hint: string }
    >;
    palette: Labels<"brand" | "custom" | "suggest">;
    tone: Labels<"light" | "dark" | "any">;
    sections: Labels<
      "home" | "services" | "about" | "portfolio" | "blog" | "shop" | "bookings" | "contact"
    >;
  };
  submit: string;
  success: {
    /** `{name}`. */
    title: string;
    /** `{email}` is rendered in bold. */
    text: string;
  };
}
