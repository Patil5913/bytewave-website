import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { emailFooter } from "@/lib/email/render";
import { newsletterIssue, type NewsletterIssue } from "@/lib/email/templates";
import { unsubscribeUrl } from "@/lib/email/unsubscribe";
import { serverUrl } from "@/lib/email/render";
import { errorResponse, secretMatches } from "@/lib/routeGuards";

/**
 * Sends a drafted newsletter issue to every newsletter subscriber.
 *
 *   POST /newsletter/send
 *   x-newsletter-secret: <NEWSLETTER_SEND_SECRET>
 *   { "id": 3 }                       -> sends the issue, once
 *   { "id": 3, "test": "me@you.com" } -> sends only to that address, no stamp
 *
 * Deliberately not a Payload hook: saving a draft must never be able to mail
 * the list. An issue already marked `sent` is refused.
 */

const BATCH = 20;
const MAX_RECIPIENTS = 5000;

export async function POST(req: Request) {
  const expected = process.env.NEWSLETTER_SEND_SECRET;
  if (!expected) {
    return errorResponse(
      "NEWSLETTER_SEND_SECRET is not set — this endpoint is disabled.",
      403,
    );
  }
  if (!secretMatches(req.headers.get("x-newsletter-secret"), expected)) {
    return errorResponse("forbidden", 403);
  }

  let body: { id?: number | string; test?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse("invalid JSON body", 400);
  }
  if (body.id === undefined || body.id === null) {
    return errorResponse("id is required", 400);
  }

  const payload = await getPayload({ config });

  const issueDoc = await payload
    .findByID({
      collection: "newsletters",
      id: body.id,
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => null);

  if (!issueDoc) return errorResponse("newsletter not found", 404);

  const isTest = typeof body.test === "string" && body.test.includes("@");
  if (!isTest && issueDoc.status === "sent") {
    return errorResponse(
      `This issue was already sent${
        issueDoc.sentAt ? ` on ${issueDoc.sentAt}` : ""
      }. Duplicate sends are refused.`,
      409,
    );
  }

  const issue = issueDoc as unknown as NewsletterIssue;
  const footer = await emailFooter();

  let recipients: string[];
  if (isTest) {
    recipients = [body.test!.trim().toLowerCase()];
  } else {
    const { docs } = await payload.find({
      collection: "contacts",
      where: { type: { equals: "newsletter" } },
      limit: MAX_RECIPIENTS,
      depth: 0,
      overrideAccess: true,
    });
    recipients = [
      ...new Set(docs.map((d) => d.email.trim().toLowerCase())),
    ].filter(Boolean);
  }

  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, note: "no subscribers" });
  }

  let sent = 0;
  const failed: string[] = [];

  // Batched so one bad address cannot stall the run, and so a large list does
  // not open thousands of simultaneous SMTP connections.
  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (email) => {
        try {
          const mail = await newsletterIssue(issue, email, footer);
          await payload.sendEmail({
            to: email,
            ...mail,
            headers: {
              "List-Unsubscribe": `<${unsubscribeUrl(serverUrl(), email)}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          });
          sent += 1;
        } catch (err) {
          failed.push(email);
          payload.logger.error(
            `Newsletter send failed for ${email}: ${(err as Error).message}`,
          );
        }
      }),
    );
  }

  if (!isTest && sent > 0) {
    await payload.update({
      collection: "newsletters",
      id: issueDoc.id,
      data: {
        status: "sent",
        sentAt: new Date().toISOString(),
        sentCount: sent,
      },
      overrideAccess: true,
    });
  }

  return NextResponse.json({
    issue: issueDoc.id,
    test: isTest,
    recipients: recipients.length,
    sent,
    failed: failed.length,
  });
}
