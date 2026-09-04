// Texting isn't connected yet — create a Twilio account (twilio.com), buy or
// verify a sending number, and set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and
// TWILIO_FROM_NUMBER (e.g. "+61...") in the environment to turn this on for
// real. Until then, sendSms below throws and the caller should treat that as
// "texting not configured" rather than a hard failure.

export function isSmsConfigured() {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  );
}

export async function sendSms(to: string, body: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !from) {
    throw new Error(
      "Texting isn't configured yet — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and " +
        "TWILIO_FROM_NUMBER to enable it."
    );
  }

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Twilio request failed (${res.status}): ${detail.slice(0, 200)}`);
  }
}

export function bookingConfirmationMessage(params: {
  guestName: string;
  listingName: string;
  checkIn: Date;
  checkOut: Date;
  siteName: string;
}) {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-AU", { month: "short", day: "numeric", timeZone: "UTC" }).format(d);
  const firstName = params.guestName.split(" ")[0] || params.guestName;
  return (
    `Hi ${firstName}, your booking at ${params.listingName} (${fmt(params.checkIn)} - ` +
    `${fmt(params.checkOut)}) is confirmed! - ${params.siteName}`
  );
}
