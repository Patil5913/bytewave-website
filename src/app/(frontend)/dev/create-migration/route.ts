import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { requireDevSecret } from "@/lib/routeGuards";

export async function POST(req: Request) {
  const denied = requireDevSecret(req);
  if (denied) return denied.response;

  const name = new URL(req.url).searchParams.get("name") ?? undefined;

  try {
    const payload = await getPayload({ config });
    await payload.db.createMigration({
      payload,
      migrationName: name,
      forceAcceptWarning: true,
    });
    return NextResponse.json({ ok: true, migrationName: name ?? "(auto)" });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
