import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  (await draftMode()).disable();
  const path = new URL(req.url).searchParams.get("path");
  redirect(path?.startsWith("/insights") ? path : "/insights");
}
