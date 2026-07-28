"use client";

import { RefreshRouteOnSave as PayloadRefresh } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

// Inside the admin live-preview iframe, refresh the route when a document is
// saved so the preview reflects the latest content. No-op on the public site.
export default function RefreshOnSave() {
  const router = useRouter();
  return (
    <PayloadRefresh
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"}
      refresh={() => router.refresh()}
    />
  );
}
