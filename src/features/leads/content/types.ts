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
  dataProtection: { title: string; text: string };
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
