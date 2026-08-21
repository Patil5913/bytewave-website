import { NextResponse } from "next/server";
import { generateTypes } from "payload/node";
import config from "@payload-config";
import { requireDevSecret } from "@/lib/routeGuards";

export async function POST(req: Request) {
  const denied = requireDevSecret(req);
  if (denied) return denied.response;

  try {
    const sanitized = await config;
    await generateTypes(sanitized, { log: false });
    return NextResponse.json({
      ok: true,
      outputFile: sanitized.typescript.outputFile,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
