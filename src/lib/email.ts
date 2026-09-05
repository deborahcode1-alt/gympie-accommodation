import { Resend } from "resend";

// Email isn't connected yet — sign up at resend.com, verify a sending domain
// (once there's a real custom domain for the site), and set RESEND_API_KEY
// and RESEND_FROM_EMAIL to turn this on. Until then, callers should treat a
// thrown error here as "not configured yet" rather than a hard failure.

export function isEmailConfigured() {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error(
      "Email isn't configured yet — set RESEND_API_KEY and RESEND_FROM_EMAIL to enable it."
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    text: params.text,
  });

  if (error) {
    throw new Error(`Resend request failed: ${error.message}`);
  }
}
