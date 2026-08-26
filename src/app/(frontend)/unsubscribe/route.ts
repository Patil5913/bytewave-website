import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe";

/**
 * One-click unsubscribe for newsletter mail. GET so it works from an email
 * client, and it responds with a page rather than JSON because a human clicked.
 */
function page(title: string, body: string, status: number) {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title} · find &amp; hire</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0a;color:#f7f6f3;
       font:15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif}
  main{max-width:34rem;padding:32px 24px;text-align:center}
  h1{margin:0 0 12px;font:500 26px/1.2 Georgia,serif}
  p{margin:0 0 20px;color:rgba(247,246,243,.6)}
  a{color:#2191fb;text-decoration:none}
</style></head>
<body><main><h1>${title}</h1><p>${body}</p><a href="/">Back to find &amp; hire</a></main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("e")?.trim().toLowerCase() ?? "";
  const token = url.searchParams.get("t") ?? "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return page(
      "Link not valid",
      "This unsubscribe link is incomplete or has expired. Reply to any of our emails and we will remove you by hand.",
      400,
    );
  }

  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "contacts",
      where: {
        and: [{ email: { equals: email } }, { type: { equals: "newsletter" } }],
      },
      limit: 50,
      depth: 0,
      overrideAccess: true,
    });

    for (const doc of docs) {
      await payload.delete({
        collection: "contacts",
        id: doc.id,
        overrideAccess: true,
      });
    }
  } catch {
    // A failed lookup must not tell the visitor whether the address existed.
    return page(
      "Something went wrong",
      "We could not process that just now. Reply to any of our emails and we will remove you by hand.",
      500,
    );
  }

  // Always the same wording, subscribed or not — the page must not confirm
  // whether an address is on the list.
  return page(
    "You're unsubscribed",
    "You will not receive the find &amp; hire newsletter again. Intake and account emails you asked for are unaffected.",
    200,
  );
}
