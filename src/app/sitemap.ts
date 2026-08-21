import type { MetadataRoute } from "next";

import { getPublishedPosts, getSiteSettingsContent } from "@/lib/content";
import { buildHref, topicSlug } from "@/lib/insights";
import { absoluteUrl } from "@/lib/seo";

const CORE_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/companies", priority: 0.9 },
  { path: "/professionals", priority: 0.9 },
  { path: "/insights", priority: 0.8 },
  
  { path: "/services", priority: 0.7 },
  { path: "/legal", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, settings] = await Promise.all([
    getPublishedPosts(),
    getSiteSettingsContent(),
  ]);
  const now = new Date();

  const corePaths = new Set(CORE_ROUTES.map((r) => r.path));
  const footerPaths = Array.from(
    new Set(
      settings.footerGroups
        .flatMap((group) => group.links.map((link) => link.href))
        .filter((href) => href.startsWith("/"))
        .map((href) => href.split("#")[0])
        .filter((path) => path && !corePaths.has(path)),
    ),
  );

  const topicPaths = Array.from(new Set(posts.map((p) => topicSlug(p)))).map(
    (topic) => `/insights/${topic}`,
  );

  return [
    ...CORE_ROUTES.map(({ path, priority }) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...footerPaths.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...topicPaths.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    
    ...posts.map((post) => ({
      url: absoluteUrl(buildHref(post)),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
