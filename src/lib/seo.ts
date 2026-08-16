import type { Metadata } from "next";

import { SITE_SETTINGS } from "./siteContent";

/**
 * Public origin of the site, without a trailing slash. Every absolute URL we
 * emit (canonical, Open Graph, sitemap, robots) is built from this, so it must
 * be set in production — a localhost og:image breaks every social preview.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const SITE_NAME = "find & hire";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type SeoSettings = typeof SITE_SETTINGS.seo;

/** Resolve a Payload upload field (id, or populated doc) to a URL. */
function uploadUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const url = (value as { url?: unknown }).url;
  return typeof url === "string" && url ? url : undefined;
}

/**
 * Turn the CMS SEO group into Next metadata. Blank admin fields fall back to
 * the defaults in siteContent, so clearing a field in the admin can never ship
 * an empty <title>.
 */
export function metadataFromSettings(
  seo: SeoSettings | undefined,
  overrides: {
    title?: string;
    description?: string;
    path?: string;
    /** Page-specific social image (e.g. an article cover). */
    image?: string;
    /** Present for articles; emits og:type=article plus byline and date. */
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
  // Only set images explicitly when we actually have one. With no value, Next
  // falls back to the generated opengraph-image route, whose URL is hashed and
  // therefore can't be hardcoded here.
  const image = overrides.image || uploadUrl(seo?.ogImage);
  const url = absoluteUrl(overrides.path ?? "/");

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: { canonical: url },
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
