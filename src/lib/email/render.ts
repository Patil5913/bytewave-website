import { render, toPlainText } from "@react-email/render";

import { Shell, type EmailContent } from "./Shell";

export { serverUrl } from "./Shell";
export type { EmailBlock, EmailContent, EmailRow } from "./Shell";

export type RenderedEmail = { subject: string; html: string; text: string };

/**
 * Renders a template through the shared Shell. Async because React Email's
 * renderer is — Payload's sendEmail and generateEmailHTML both accept promises.
 */
export async function renderEmail(
  content: EmailContent,
): Promise<RenderedEmail> {
  const html = await render(Shell({ content }));
  return {
    subject: content.subject,
    html,
    // derived from the rendered HTML, so the two halves cannot drift
    text: toPlainText(html),
  };
}

/**
 * Footer identity for outbound mail, read from the CMS with the static site
 * settings as the fallback — so editors changing the address or social links in
 * the admin see it in emails without a deploy.
 */
export async function emailFooter() {
  const { getSiteSettingsContent } = await import("@/lib/content");
  const settings = await getSiteSettingsContent();
  return {
    socials: settings.socials,
    legalLine: settings.legalLine,
    address: settings.address,
  };
}
