import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
  formatLeadEmail,
  noopLeadNotifier,
  type LeadNotifier,
} from "@/features/leads/lead-notifier";

/** Sender on the lguia.com Email Routing domain; replies go to the lead, not to this address. */
const SENDER = { email: "web@lguia.com", name: "web lguia" };

interface EmailBinding {
  send(message: {
    from: { email: string; name?: string };
    to: string;
    replyTo?: string;
    subject: string;
    text: string;
  }): Promise<unknown>;
}

/**
 * Emails each lead through the Workers `send_email` binding (SPEC-010). Outside the Workers
 * runtime (next dev, tests) there is nothing to send with, so the lead is only kept by the
 * repository.
 */
export function getLeadNotifier(): LeadNotifier {
  let env: Partial<{ LEADS_EMAIL: EmailBinding; LEADS_TO: string }>;
  try {
    env = getCloudflareContext().env as typeof env;
  } catch {
    return noopLeadNotifier;
  }
  const { LEADS_EMAIL: binding, LEADS_TO: to } = env;
  if (!binding || !to) {
    // On Workers the in-memory store is lost between requests: failing tells the visitor to use
    // the email address instead of thanking them for a lead nobody will read.
    return {
      async notify() {
        throw new Error("LEADS_EMAIL binding or LEADS_TO secret is not configured");
      },
    };
  }

  return {
    async notify(lead) {
      const { subject, text } = formatLeadEmail(lead);
      await binding.send({ from: SENDER, to, replyTo: lead.email, subject, text });
    },
  };
}
