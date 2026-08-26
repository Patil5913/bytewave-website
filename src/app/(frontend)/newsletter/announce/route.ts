import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { emailFooter, serverUrl } from "@/lib/email/render";
import { postAnnouncement, type AnnouncePost } from "@/lib/email/templates";
import { unsubscribeUrl } from "@/lib/email/unsubscribe";
import { buildHref } from "@/lib/insights";
import { errorResponse, secretMatches } from "@/lib/routeGuards";

/**
 * Announces a published post to newsletter subscribers.
 *
 *   POST /newsletter/announce
 *   x-newsletter-secret: <NEWSLETTER_SEND_SECRET>
 *   { "id": 4 }                       -> sends once, stamps announcedAt
 *   { "id": 4, "test": "me@you.com" } -> single copy, no stamp
 *
 * Same shape as /newsletter/send: an explicit call, never a publish hook, so
 * hitting Save in the CMS cannot mail the list.
 */

const BATCH = 20;
const MAX_RECIPIENTS = 5000;
const RELATED = 3;

type PostRow = {
  id: number | string;
  title: string;
  excerpt?: string | null;
  tag?: string | null;
  articleId?: string | null;
  author?: string | null;
  readTime?: string | null;
  date?: string | null;
  cover?: unknown;
  announcedAt?: string | null;
  _status?: string | null;
};

function coverUrl(cover: unknown): string | undefined {
  if (typeof cover === "string") return cover || undefined;
  if (cover && typeof cover === "object") {
    const url = (cover as { url?: unknown }).url;
    if (typeof url === "string" && url) return url;
  }
  return undefined;
}

function coverAlt(cover: unknown, fallback: string): string {
  if (cover && typeof cover === "object") {
    const alt = (cover as { alt?: unknown }).alt;
    if (typeof alt === "string" && alt) return alt;
  }
  return fallback;
}

function toAnnounce(row: PostRow): AnnouncePost {
  return {
    title: row.title,
    excerpt: row.excerpt ?? null,
    tag: row.tag ?? null,
    cover: coverUrl(row.cover) ?? null,
    coverAlt: coverAlt(row.cover, row.title),
    author: row.author ?? null,
    readTime: row.readTime ?? null,
    date: row.date ?? null,
    href: buildHref({
      id: row.articleId ?? String(row.id),
      title: row.title,
      tag: row.tag ?? "insights",
    }),
  };
}

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

  const doc = (await payload
    .findByID({
      collection: "posts",
      id: body.id,
      depth: 1,
      overrideAccess: true,
    })
    .catch(() => null)) as PostRow | null;

  if (!doc) return errorResponse("post not found", 404);

  const isTest = typeof body.test === "string" && body.test.includes("@");

  if (doc._status !== "published") {
    return errorResponse(
      "This post is still a draft. Publish it before announcing.",
      409,
    );
  }
  if (!isTest && doc.announcedAt) {
    return errorResponse(
      `Already announced on ${doc.announcedAt}. Duplicate announcements are refused.`,
      409,
    );
  }

  // Newest other published posts, for the "more from the archive" strip.
  const { docs: others } = await payload.find({
    collection: "posts",
    where: {
      and: [
        { _status: { equals: "published" } },
        { id: { not_equals: doc.id } },
      ],
    },
    sort: "-publishedAt",
    limit: RELATED,
    depth: 1,
    overrideAccess: true,
  });

  const post = toAnnounce(doc);
  const related = (others as unknown as PostRow[]).map(toAnnounce);
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

  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (email) => {
        try {
          const mail = await postAnnouncement(post, related, email, footer);
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
            `Announcement failed for ${email}: ${(err as Error).message}`,
          );
        }
      }),
    );
  }

  if (!isTest && sent > 0) {
    await payload.update({
      collection: "posts",
      id: doc.id,
      data: { announcedAt: new Date().toISOString() },
      overrideAccess: true,
    });
  }

  return NextResponse.json({
    post: doc.id,
    test: isTest,
    related: related.length,
    recipients: recipients.length,
    sent,
    failed: failed.length,
  });
}
