import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  REFERRAL_CODE_RE,
  REFERRAL_COOKIE,
} from "@/lib/referrals";

const DEFAULT_LANDING = "/";

const ALLOWED_LANDINGS = new Set([
  "/",
  "/companies",
  "/professionals",
  "/services",
  "/insights",
]);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const to = new URL(req.url).searchParams.get("to");
  const landing =
    to && ALLOWED_LANDINGS.has(to) ? to : DEFAULT_LANDING;

  const redirectTo = new URL(landing, req.url);
  const response = NextResponse.redirect(redirectTo, 307);

  const normalized = code.trim().toUpperCase();
  if (!REFERRAL_CODE_RE.test(normalized)) return response;

  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "referrers",
      where: {
        and: [
          { code: { equals: normalized } },
          { status: { equals: "active" } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const referrer = docs[0];
    if (!referrer) return response;

    const settings = await payload.findGlobal({
      slug: "referral-settings",
      overrideAccess: true,
    });
    const days = settings.cookieDays ?? 30;

    await payload.update({
      collection: "referrers",
      id: referrer.id,
      data: { clicks: (referrer.clicks ?? 0) + 1 },
      overrideAccess: true,
    });

    response.cookies.set({
      name: REFERRAL_COOKIE,
      value: normalized,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: days * 24 * 60 * 60,
    });
  } catch (err) {
    console.error("[referral] click tracking failed:", err);
  }

  return response;
}
