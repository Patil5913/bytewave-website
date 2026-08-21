import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { secretMatches } from "@/lib/routeGuards";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") ?? "/insights";

  if (!path.startsWith("/insights")) {
    return NextResponse.json({ error: "unsupported path" }, { status: 400 });
  }

  let authorized = false;
  try {
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: req.headers });
    const role = (user as { role?: string } | null)?.role;
    authorized = role === "admin" || role === "editor";
  } catch {
    authorized = false;
  }

  const expected = process.env.PREVIEW_SECRET;
  if (!authorized && expected) {
    authorized = secretMatches(searchParams.get("secret"), expected);
  }

  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  (await draftMode()).enable();

  redirect(path);
}
