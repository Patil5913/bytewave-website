import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin, the Payload REST/GraphQL surface, and the seed endpoint are not
      // content and must never be indexed.
      disallow: ["/ops/", "/api/", "/seed-content"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
