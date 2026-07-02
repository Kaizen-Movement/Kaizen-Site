import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

function getFromAddress(): string {
  // Defaults to Resend's shared testing domain so email works out of the
  // box with just an API key. Once a real domain is verified in Resend,
  // set RESEND_FROM_EMAIL to something like
  // "Kaizen Subliminals <orders@kaizensubliminals.store>".
  return process.env.RESEND_FROM_EMAIL ?? "Kaizen Subliminals <onboarding@resend.dev>";
}

function getReplyTo(): string | undefined {
  return process.env.RESEND_REPLY_TO ?? undefined;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  sent: boolean;
  error?: string;
}

/**
 * Best-effort email send. Deliberately never throws — a Resend outage or
 * misconfiguration should never fail a checkout or block order fulfillment.
 * Callers should log the returned error for visibility but proceed regardless.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailInput): Promise<SendEmailResult> {
  const resend = getClient();
  if (!resend) {
    return { sent: false, error: "RESEND_API_KEY not configured." };
  }

  try {
    const { error } = await resend.emails.send({
      from: getFromAddress(),
      to,
      replyTo: getReplyTo(),
      subject,
      html,
    });

    if (error) {
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Unknown email error.",
    };
  }
}
