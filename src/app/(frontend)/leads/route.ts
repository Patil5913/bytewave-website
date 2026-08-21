import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { errorResponse } from "@/lib/routeGuards";
import type { Contact } from "@/payload-types";
import { REFERRAL_COOKIE, readCookie } from "@/lib/referrals";

const TYPES = ["talent", "enterprise", "lead", "newsletter"] as const;
type LeadType = (typeof TYPES)[number];

const SURFACES = ["contact-terminal", "cta", "footer"] as const;

const TEXT_FIELDS = {
  name: 120,
  role: 120,
  experience: 120,
  company: 120,
  headcount: 120,
  stack: 120,
  message: 4000,
} as const;

type TextField = keyof typeof TEXT_FIELDS;

const MAX_BODY_BYTES = 16 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_PER_EMAIL = 2;

const MIN_FILL_MS = 1500;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

function hashIp(ip: string): string {
  
  return createHash("sha256")
    .update(`${ip}:${process.env.PAYLOAD_SECRET ?? ""}`)
    .digest("hex");
}

function derivePath(req: Request): string | undefined {
  const referer = req.headers.get("referer");
  if (!referer) return undefined;
  try {
    const url = new URL(referer);
    const origin = process.env.NEXT_PUBLIC_SERVER_URL;
    if (origin && new URL(origin).host !== url.host) return undefined;
    return `${url.pathname}${url.search}`;
  } catch {
    return undefined;
  }
}

async function attributeReferral(
  payload: Awaited<ReturnType<typeof getPayload>>,
  req: Request,
  contactId: number,
  landingPath: string | null | undefined,
) {
  const code = readCookie(req.headers.get("cookie"), REFERRAL_COOKIE);
  if (!code) return;

  try {
    const { docs } = await payload.find({
      collection: "referrers",
      where: {
        and: [
          { code: { equals: code.toUpperCase() } },
          { status: { equals: "active" } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const referrer = docs[0];
    if (!referrer) return;

    const settings = await payload.findGlobal({
      slug: "referral-settings",
      overrideAccess: true,
    });

    await payload.create({
      collection: "referrals",
      overrideAccess: true,
      data: {
        referrer: referrer.id,
        contact: contactId,
        status: "pending",
        rewardAmount: referrer.rewardOverride ?? settings.defaultReward,
        landingPath: landingPath ?? undefined,
      },
    });
  } catch (err) {
    console.error("[leads] referral attribution failed:", err);
  }
}

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

  const type = body.type;
  if (typeof type !== "string" || !TYPES.includes(type as LeadType)) {
    return errorResponse("Unrecognised enquiry type.", 400);
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return errorResponse("Enter a valid email address.", 400);
  }

  const data: Partial<Contact> & { type: Contact["type"]; email: string } = {
    type: type as Contact["type"],
    email,
  };
  for (const field of Object.keys(TEXT_FIELDS) as TextField[]) {
    const max = TEXT_FIELDS[field];
    const value = body[field];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (trimmed.length > max) {
      return errorResponse(`${field} is too long (max ${max} characters).`, 400);
    }
    data[field] = trimmed;
  }

  const surface =
    typeof body.surface === "string" &&
    SURFACES.includes(body.surface as (typeof SURFACES)[number])
      ? body.surface
      : "unknown";
  const path = derivePath(req);
  data.source = path ? `${surface}:${path}` : surface;

  const ip = clientIp(req);
  const ipHash = hashIp(ip);
  data.ipHash = ipHash;

  try {
    const payload = await getPayload({ config });
    const since = new Date(Date.now() - WINDOW_MS).toISOString();

    const [byIp, byEmail] = await Promise.all([
      payload.count({
        collection: "contacts",
        overrideAccess: true,
        where: {
          and: [
            { ipHash: { equals: ipHash } },
            { createdAt: { greater_than: since } },
          ],
        },
      }),
      payload.count({
        collection: "contacts",
        overrideAccess: true,
        where: {
          and: [
            { email: { equals: email } },
            { createdAt: { greater_than: since } },
          ],
        },
      }),
    ]);

    const ipLimit = ip === "unknown" ? MAX_PER_IP * 2 : MAX_PER_IP;
    if (byIp.totalDocs >= ipLimit || byEmail.totalDocs >= MAX_PER_EMAIL) {
      return NextResponse.json(
        { errors: [{ message: "Too many submissions. Try again shortly." }] },
        { status: 429, headers: { "Retry-After": String(WINDOW_MS / 1000) } },
      );
    }

    if (type === "newsletter") {
      const { totalDocs } = await payload.count({
        collection: "contacts",
        overrideAccess: true,
        where: {
          and: [{ type: { equals: "newsletter" } }, { email: { equals: email } }],
        },
      });
      if (totalDocs > 0) return NextResponse.json({ ok: true });
    }

    const contact = await payload.create({
      collection: "contacts",
      overrideAccess: true,
      data,
    });

    await attributeReferral(payload, req, contact.id, data.source);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[leads] submission failed:", err);
    return errorResponse("Could not save your submission. Try again.", 500);
  }
}
