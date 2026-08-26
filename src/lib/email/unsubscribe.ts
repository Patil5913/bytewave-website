import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signed unsubscribe links. The token is an HMAC of the address, so a link is
 * valid without a database lookup and cannot be forged into someone else's
 * address by editing the query string.
 */

function secret() {
  return process.env.PAYLOAD_SECRET ?? "";
}

export function unsubscribeToken(email: string): string {
  return createHmac("sha256", secret())
    .update(`unsubscribe:${email.trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function unsubscribeUrl(baseUrl: string, email: string): string {
  const params = new URLSearchParams({
    e: email,
    t: unsubscribeToken(email),
  });
  return `${baseUrl}/unsubscribe?${params.toString()}`;
}
