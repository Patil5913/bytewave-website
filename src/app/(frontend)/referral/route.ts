import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { errorResponse } from "@/lib/routeGuards";

import { absoluteUrl } from "@/lib/seo";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 4 * 1024;
const MIN_FILL_MS = 1500;

export async function POST(req: Request) {
  const raw = await req.text();
  if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
    return errorResponse("Submission too large.", 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return errorResponse("Malformed request.", 400);
  }

  if (typeof body.companyUrl === "string" && body.companyUrl.trim()) {
    return NextResponse.json({ ok: true });
  }
  const renderedAt = Number(body.renderedAt);
  if (Number.isFinite(renderedAt) && Date.now() - renderedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!name || name.length > 120) return errorResponse("Enter your name.", 400);
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return errorResponse("Enter a valid email address.", 400);
  }

  try {
    const payload = await getPayload({ config });

    const existing = await payload.find({
      collection: "referrers",
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const referrer =
      existing.docs[0] ??
      (await payload.create({
        collection: "referrers",
        overrideAccess: true,
        data: { name, email, status: "active" },
      }));

    if (referrer.status !== "active" || !referrer.code) {
      return errorResponse(
        "This referral account is not active. Contact us and we'll sort it out.",
        403,
      );
    }

    return NextResponse.json({
      ok: true,
      code: referrer.code,
      link: absoluteUrl(`/r/${referrer.code}`),
    });
  } catch (err) {
    console.error("[referral] sign-up failed:", err);
    return errorResponse("Could not create your referral link. Try again.", 500);
  }
}
