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
    attachments?: {
      content: string;
      filename: string;
      type: string;
      disposition: "attachment";
    }[];
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
  const binding = env.LEADS_EMAIL;
  const to = normalizeAddress(env.LEADS_TO);
  if (!binding || !to) {
    // On Workers the in-memory store is lost between requests: failing tells the visitor to use
    // the email address instead of thanking them for a lead nobody will read.
    return {
      async notify() {
        throw new Error(
          `LEADS_EMAIL binding or a valid LEADS_TO secret is missing (${describeSecret(env.LEADS_TO)})`,
        );
      },
    };
  }

  return {
    async notify(lead, files = []) {
      const { subject, text } = formatLeadEmail(lead);
      const attachments = files.map((file) => ({
        content: file.data,
        filename: file.filename,
        type: file.type,
        disposition: "attachment" as const,
      }));
      const message = { from: SENDER, to, subject, text, attachments };
      try {
        await binding.send({ ...message, replyTo: lead.email });
      } catch (error) {
        // Without the reply-to the team can still read the visitor's address in the body.
        console.error("[leads] send with Reply-To failed, retrying without it", error);
        await binding.send(message);
      }
    },
  };
}

const EMAIL = /[^\s<>"'@]+@[^\s<>"'@]+\.[^\s<>"'@]+/;

/** Accepts the address typed with stray spaces, quotes or "Name <address>" around it. */
export function normalizeAddress(value: string | undefined): string | undefined {
  return value?.match(EMAIL)?.[0];
}

/** Shape of the secret for logs, without revealing the address. */
function describeSecret(value: string | undefined): string {
  if (value === undefined) return "LEADS_TO not set";
  return `LEADS_TO has ${value.length} characters, ${value.includes("@") ? "with" : "without"} "@"`;
}
