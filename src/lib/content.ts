import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { getPayload, type CollectionSlug, type GlobalSlug } from "payload";
import config from "@payload-config";
import { ALL_POSTS, type Post } from "./insights";
import type { Post as PostDoc } from "../payload-types";
import { mediaAlt, mediaUrl } from "./media";
import { blocksToLexical } from "./lexical";
import { ALL_CONTENT_TAG, tagFor } from "./revalidate";
import {
  EXAMPLE_PLACEMENTS,
  SITE_STATS_CONTENT,
  HOMEPAGE,
  LEGAL_PAGE,
  SITE_SETTINGS,
  TRACK_RECORD,
  CERTIFICATIONS as CERT_DEFAULT,
  FAQS_COMPANIES,
  FAQS_PROFESSIONALS,
  TESTIMONIAL_QUOTES,
  TESTIMONIAL_VIDEOS,
} from "./siteContent";

type CertItem = {
  code: string;
  ref: string;
  year: string;
  label: string;
  description: string;
  logoName: string;
};
type FaqItem = { question: string; answer: string };
type QuoteItem = {
  name: string;
  title: string;
  company: string;
  domain: string;
  quote: string;
  row?: string;
};
type VideoItem = {
  name: string;
  role: string;
  company: string;
  domain: string;
  duration: string;
  thumbnail?: string;
  row?: string;
};

export type PostView = Omit<Post, "content" | "cover"> & {
  content: unknown;
  
  cover?: string;
  
  publishedAt?: string;
  
  coverAlt?: string;
  faqs?: { question: string; answer: string }[];
};

async function client() {
  return getPayload({ config });
}

async function logReadFailure(what: string, err: unknown) {
  const message = `[content] ${what} read failed — serving bundled fallback: ${
    (err as Error)?.message ?? err
  }`;
  try {
    (await client()).logger.error(message);
  } catch {
    console.error(message);
  }
}

function cachedRead<T>(
  what: string,
  keyParts: string[],
  tags: string[],
  read: () => Promise<T>,
  fallback: () => T | Promise<T>,
  revalidate = 3600,
): () => Promise<T> {
  const persisted = unstable_cache(read, ["content", ...keyParts], {
    tags: [...tags, ALL_CONTENT_TAG],
    revalidate,
  });
  return cache(async () => {
    try {
      return await persisted();
    } catch (err) {
      await logReadFailure(what, err);
      return await fallback();
    }
  });
}

export const getPlacements = cachedRead(
  "placements",
  ["placements"],
  [tagFor("placements")],
  async () => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "placements",
      limit: 20,
      sort: "order",
    });
    if (!docs.length) return EXAMPLE_PLACEMENTS;
    return docs.map(
      ({ role, stack, candidate, company, companyName, location, pay, status }) => ({
        role,
        stack,
        candidate,
        company,
        companyName,
        location,
        pay,
        status,
      }),
    );
  },
  () => EXAMPLE_PLACEMENTS,
);

export const getSiteStats = cachedRead(
  "site-stats",
  ["global", "site-stats"],
  [tagFor("site-stats")],
  async () => {
    const payload = await client();
    const global = await payload.findGlobal({ slug: "site-stats" });
    const stats = (global.stats ?? []).map(
      ({ value, decimals, suffix, label, note }) => ({
        value,
        decimals,
        suffix: suffix ?? "",
        label,
        note,
      }),
    );
    return stats.length ? stats : SITE_STATS_CONTENT;
  },
  () => SITE_STATS_CONTENT,
);

function toPostView(d: PostDoc): PostView {
  return {
    id: d.articleId ?? String(d.id),
    date: d.date ?? "",
    publishedAt: d.publishedAt ?? undefined,
    updated: d.updated || undefined,
    tag: d.tag,
    title: d.title,
    author: d.author,
    authorTitle: d.authorTitle ?? "",
    authorBio: d.authorBio ?? "",
    authorLinkedIn: d.authorLinkedIn || undefined,
    authorAvatar: mediaUrl(d.authorAvatar),
    cover: mediaUrl(d.cover),
    coverAlt: mediaAlt(d.cover, d.title),
    readTime: d.readTime,
    excerpt: d.excerpt,
    content: d.content,
    faqs: (d.faqs ?? []).map(({ question, answer }) => ({ question, answer })),
  };
}

export type ReferralSettingsView = {
  defaultReward: number;
  currency: string;
  terms?: string;
};

export const getReferralSettings = cachedRead(
  "referral-settings",
  ["global", "referral-settings"],
  [tagFor("referral-settings")],
  async () => {
    const payload = await client();
    const global = await payload.findGlobal({ slug: "referral-settings" });
    return {
      defaultReward: global.defaultReward ?? 0,
      currency: global.currency ?? "USD",
      terms: global.terms ?? undefined,
    } satisfies ReferralSettingsView;
  },
  (): ReferralSettingsView => ({ defaultReward: 0, currency: "USD" }),
);

async function findAll<S extends CollectionSlug>(collection: S, sort = "order") {
  const payload = await client();
  const { docs } = await payload.find({ collection, limit: 200, sort });
  return docs;
}

async function findGlobal<S extends GlobalSlug>(slug: S) {
  const payload = await client();
  return payload.findGlobal({ slug });
}

function merge<T extends Record<string, unknown>>(
  base: T,
  cms: object | null,
): T {
  if (!cms) return base;
  const source = cms as Record<string, unknown>;
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base)) {
    const v = source[key];
    if (Array.isArray(base[key])) {
      if (Array.isArray(v) && v.length) out[key] = v;
    } else if (v !== undefined && v !== null && v !== "") {
      out[key] = v;
    }
  }
  return out as T;
}

export const getHomepageContent = cachedRead(
  "homepage",
  ["global", "homepage"],
  [tagFor("homepage")],
  async () => merge(HOMEPAGE, await findGlobal("homepage")),
  () => HOMEPAGE,
);

export const getSiteSettingsContent = cachedRead(
  "site-settings",
  ["global", "site-settings"],
  [tagFor("site-settings")],
  async () => merge(SITE_SETTINGS, await findGlobal("site-settings")),
  () => SITE_SETTINGS,
);

export const getLegalPageContent = cachedRead(
  "legal-page",
  ["global", "legal-page"],
  [tagFor("legal-page")],
  async () => merge(LEGAL_PAGE, await findGlobal("legal-page")),
  () => LEGAL_PAGE,
);

export const getTrackRecordContent = cachedRead(
  "track-record",
  ["global", "track-record"],
  [tagFor("track-record")],
  async () => merge(TRACK_RECORD, await findGlobal("track-record")),
  () => TRACK_RECORD,
);

export const getCertificationsContent = cachedRead(
  "certifications",
  ["certifications"],
  [tagFor("certifications")],
  async () => {
    const docs = await findAll("certifications");
    if (!docs.length) return CERT_DEFAULT;
    return docs.map((d) => ({
      code: d.code,
      ref: d.ref,
      year: d.year,
      label: d.label,
      description: d.description,
      logoName: d.logoName,
    })) as CertItem[];
  },
  () => CERT_DEFAULT,
);

const faqReaders = {
  companies: cachedRead(
    "company-faqs",
    ["faqs", "companies"],
    [tagFor("company-faqs")],
    async () => {
      const docs = await findAll("company-faqs", "order");
      if (!docs.length) return FAQS_COMPANIES as FaqItem[];
      return docs.map((d) => ({
        question: d.question,
        answer: d.answer,
      }));
    },
    () => FAQS_COMPANIES as FaqItem[],
  ),
  professionals: cachedRead(
    "professional-faqs",
    ["faqs", "professionals"],
    [tagFor("professional-faqs")],
    async () => {
      const docs = await findAll("professional-faqs", "order");
      if (!docs.length) return FAQS_PROFESSIONALS as FaqItem[];
      return docs.map((d) => ({
        question: d.question,
        answer: d.answer,
      }));
    },
    () => FAQS_PROFESSIONALS as FaqItem[],
  ),
};

export function getFaqsContent(
  audience: "companies" | "professionals",
): Promise<FaqItem[]> {
  return faqReaders[audience]();
}

export const getTestimonialQuotes = cachedRead(
  "client-quotes",
  ["client-quotes"],
  [tagFor("client-quotes")],
  async () => {
    const docs = await findAll("client-quotes");
    if (!docs.length) return TESTIMONIAL_QUOTES as QuoteItem[];
    return docs.map((d) => ({
      name: d.name,
      title: d.title ?? "",
      company: d.company,
      domain: d.domain,
      quote: d.quote,
      row: d.row ?? "one",
    }));
  },
  () => TESTIMONIAL_QUOTES as QuoteItem[],
);

export const getTestimonialVideos = cachedRead(
  "success-videos",
  ["success-videos"],
  [tagFor("success-videos")],
  async () => {
    const docs = await findAll("success-videos");
    if (!docs.length) return TESTIMONIAL_VIDEOS as VideoItem[];
    return docs.map((d) => ({
      name: d.name,
      role: d.role ?? "",
      company: d.company,
      domain: d.domain,
      duration: d.duration ?? "",
      thumbnail: mediaUrl(d.thumbnail),
      row: d.row ?? "one",
    }));
  },
  () => TESTIMONIAL_VIDEOS as VideoItem[],
);

let fallbackPostsPromise: Promise<PostView[]> | undefined;

function fallbackPosts(): Promise<PostView[]> {
  fallbackPostsPromise ??= Promise.all(
    ALL_POSTS.map(async (p) => {
      const { content: _drop, ...rest } = p;
      void _drop;
      const { content, faqs } = await blocksToLexical(p.content).catch(() => ({
        content: null,
        faqs: [] as { question: string; answer: string }[],
      }));
      return { ...rest, content, faqs } as PostView;
    }),
  );
  return fallbackPostsPromise;
}

export const getPublishedPosts = cachedRead(
  "posts",
  ["posts", "published"],
  [tagFor("posts")],
  async () => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "posts",
      limit: 100,
      sort: "-publishedAt",
      where: { _status: { equals: "published" } },
      overrideAccess: false,
    });
    if (!docs.length) return fallbackPosts();
    return docs.map(toPostView);
  },
  () => fallbackPosts(),
  300,
);

const getDraftPosts = cache(async (): Promise<PostView[]> => {
  try {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "posts",
      limit: 100,
      sort: "-publishedAt",
      draft: true,
      overrideAccess: true,
    });
    if (!docs.length) return fallbackPosts();
    return docs.map(toPostView);
  } catch (err) {
    await logReadFailure("posts (draft)", err);
    return fallbackPosts();
  }
});

export async function getPosts(): Promise<PostView[]> {
  const { isEnabled } = await draftMode();
  return isEnabled ? getDraftPosts() : getPublishedPosts();
}
