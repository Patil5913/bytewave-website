import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export function secretMatches(
  provided: string | null,
  expected: string,
): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ errors: [{ message }] }, { status });
}

export type GuardFailure = { response: NextResponse };

export function requireDevSecret(req: Request): GuardFailure | null {
  if (process.env.NODE_ENV === "production") {
    return {
      response: NextResponse.json({ error: "not available" }, { status: 404 }),
    };
  }

  const expected = process.env.SEED_SECRET;
  if (!expected) {
    return {
      response: NextResponse.json(
        { error: "SEED_SECRET is not set — this endpoint is disabled." },
        { status: 403 },
      ),
    };
  }

  if (!secretMatches(req.headers.get("x-seed-secret"), expected)) {
    return {
      response: NextResponse.json({ error: "forbidden" }, { status: 403 }),
    };
  }

  return null;
}
