import type { LeadFormContent } from "@/features/leads/content/types";

export const leadContentEn: LeadFormContent = {
  validation: {
    name: "Enter your name (at least 2 characters).",
    nameTooLong: "The name is too long (80 characters maximum).",
    email: "Enter a valid email address, for example name@company.com.",
    company: "The company name is too long (120 characters maximum).",
    phone: "Enter a valid phone number (at least 9 digits).",
    interest: "Select what we can help you with.",
    message: "Tell us a little more (at least 10 characters).",
    messageTooLong: "The message is too long (2,000 characters maximum).",
    consent: "We need your consent to be able to reply.",
    answers: "Select an option to continue.",
    source: "Invalid contact source.",
  },
  fields: {
    name: "Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    optional: "(optional)",
    interest: "What can we help you with?",
    message: "Tell us about your project",
    messageHint: "What you need, by when, and any detail that helps us understand it.",
  },
  interestGeneral: "I am not sure yet, I would like some guidance",
  consent:
    "I have read the data protection information and agree to lguia using my details to answer my request.",
  dataProtection: {
    title: "Data protection.",
    text: "Controller: {owner} ({brand}). Purpose: to answer your request and, if you ask for it, send you a proposal. We do not share your data with third parties. You can exercise your rights by writing to",
    more: "More information in our",
    policy: "privacy policy",
  },
  honeypotLabel: "Leave this field empty",
  submit: "Send message",
  submitting: "Sending…",
  errors: {
    network: "We could not reach the server. Check your internet connection and try again.",
    server:
      "We could not send your details because of a problem on our side. Try again in a few minutes.",
  },
  success: {
    title: "Thank you, {name}. We have received your message.",
    text: "We will reply to {email} within 2 working days with an initial assessment.",
    next: "In the meantime, you can {link} to get a head start.",
    nextLink: "take the digital assessment",
  },
};
