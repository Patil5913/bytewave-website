import type { Metadata } from "next";

import { mediaUrl } from "./media";
import { SITE_SETTINGS } from "./siteContent";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const SITE_NAME = "find & hire";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type SeoSettings = typeof SITE_SETTINGS.seo;

export function metadataFromSettings(
  seo: SeoSettings | undefined,
  overrides: {
    title?: string;
    description?: string;
    path?: string;
    
    image?: string;
    
    article?: { publishedTime?: string; authors?: string[] };
  } = {},
): Metadata {
  const fallback = SITE_SETTINGS.seo;
  const title =
    overrides.title || seo?.metaTitle || fallback.metaTitle || SITE_NAME;
  const description =
    overrides.description ||
    seo?.metaDescription ||
    fallback.metaDescription ||
    undefined;
  const keywords = (seo?.keywords || fallback.keywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  
  const image = overrides.image || mediaUrl(seo?.ogImage);
  const url = absoluteUrl(overrides.path ?? "/");

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: {
      canonical: url,
      
      types: { "application/rss+xml": absoluteUrl("/feed.xml") },
    },
    openGraph: {
      siteName: SITE_NAME,
      title,
      description,
      url,
      ...(image ? { images: [image] } : {}),
      ...(overrides.article
        ? { type: "article" as const, ...overrides.article }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
