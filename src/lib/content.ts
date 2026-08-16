import "server-only";
import { getPayload, type CollectionSlug, type GlobalSlug } from "payload";
import config from "@payload-config";
import { ALL_POSTS, type Post } from "./insights";
import { blocksToMarkdown } from "./markdown";
import { mdToLexical } from "./lexical";
import {
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

export type CertItem = {
  code: string;
  ref: string;
  year: string;
  label: string;
  description: string;
  logoName: string;
};
export type FaqItem = { question: string; answer: string };
export type QuoteItem = {
  name: string;
  title: string;
  company: string;
  domain: string;
  quote: string;
  row?: string;
};
export type VideoItem = {
  name: string;
  role: string;
  company: string;
  domain: string;
  duration: string;
  thumbnail: string;
  row?: string;
};

export type PostView = Omit<Post, "content"> & {
  content: unknown;
  /** Alt text from the uploaded cover, falling back to the title. */
  coverAlt?: string;
  faqs?: { question: string; answer: string }[];
};

export type Placement = {
  role: string;
  stack: string;
  candidate: string;
  company: string;
  companyName: string;
  location: string;
  pay: string;
  status: string;
};

/**
 * Illustrative rows shown when the placements collection is empty or the DB is
 * unreachable. Deliberately generic — never put a real client or candidate
 * name in here, it renders in production.
 */
const EXAMPLE_PLACEMENTS: Placement[] = [
  {
    role: "Backend Developer",
    stack: "Python, FastAPI, PostgreSQL",
    candidate: "Candidate A",
    company: "example.com",
    companyName: "Fintech Platform",
    location: "New York, NY",
    pay: "Example listing",
    status: "Placed",
  },
  {
    role: "Product Designer",
    stack: "Figma, Design Systems",
    candidate: "Candidate B",
    company: "example.com",
    companyName: "Productivity Startup",
    location: "Remote",
    pay: "Example listing",
    status: "Offer",
  },
  {
    role: "Frontend Engineer",
    stack: "React, TypeScript, Next.js",
    candidate: "Candidate C",
    company: "example.com",
    companyName: "Developer Tools Co.",
    location: "San Francisco, CA",
    pay: "Example listing",
    status: "Interviewing",
  },
  {
    role: "Data Analyst",
    stack: "SQL, Python, Looker",
    candidate: "Candidate D",
    company: "example.com",
    companyName: "Marketplace Co.",
    location: "Austin, TX",
    pay: "Example listing",
    status: "Placed",
  },
  {
    role: "DevOps Engineer",
    stack: "Kubernetes, Terraform, AWS",
    candidate: "Candidate E",
    company: "example.com",
    companyName: "Infrastructure Co.",
    location: "Seattle, WA",
    pay: "Example listing",
    status: "Negotiating",
  },
];

export type SiteStat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  note: string;
};

/** Illustrative figures for an empty database — see EXAMPLE_PLACEMENTS. */
const EXAMPLE_STATS: SiteStat[] = [
  {
    value: 94,
    decimals: 0,
    suffix: "%",
    label: "Placement Success Rate",
    note: "of matched roles close on the first shortlist.",
  },
  {
    value: 14,
    decimals: 0,
    suffix: "d",
    label: "Avg. Time-to-Placement",
    note: "from first intro to signed offer.",
  },
  {
    value: 1.2,
    decimals: 1,
    suffix: "k",
    label: "Verified Professionals",
    note: "skills confirmed, not keyword-matched.",
  },
  {
    value: 150,
    decimals: 0,
    suffix: "+",
    label: "Partner Organizations",
    note: "hiring directly through the network.",
  },
];

/**
 * Resolve a Payload upload field to a URL. Depending on query depth the value
 * is either a populated media doc or a bare id; legacy rows may still hold a
 * plain URL string, so all three are handled.
 */
function mediaUrl(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const url = (value as { url?: unknown }).url;
    if (typeof url === "string") return url;
  }
  return "";
}

/** Alt text stored alongside an uploaded image, when the doc is populated. */
function mediaAlt(value: unknown, fallback: string): string {
  if (value && typeof value === "object") {
    const alt = (value as { alt?: unknown }).alt;
    if (typeof alt === "string" && alt) return alt;
  }
  return fallback;
}

async function client() {
  return getPayload({ config });
}

export async function getPlacements(): Promise<Placement[]> {
  try {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "placements",
      limit: 20,
      sort: "order",
    });
    if (!docs.length) return EXAMPLE_PLACEMENTS;
    return (docs as Record<string, unknown>[]).map((d) => ({
      role: d.role as string,
      stack: d.stack as string,
      candidate: d.candidate as string,
      company: d.company as string,
      companyName: d.companyName as string,
      location: d.location as string,
      pay: d.pay as string,
      status: d.status as string,
    }));
  } catch (err) {
    console.error("[content] placements query failed, using examples:", err);
    return EXAMPLE_PLACEMENTS;
  }
}

export async function getSiteStats(): Promise<SiteStat[]> {
  try {
    const payload = await client();
    const global = (await payload.findGlobal({
      slug: "site-stats",
    })) as Record<string, unknown>;
    const stats = (global?.stats ?? []) as SiteStat[];
    return stats.length ? stats : EXAMPLE_STATS;
  } catch (err) {
    console.error("[content] site-stats query failed, using examples:", err);
    return EXAMPLE_STATS;
  }
}

function toPostView(d: Record<string, unknown>): PostView {
  return {
    id: d.articleId as string,
    date: d.date as string,
    updated: (d.updated as boolean) || undefined,
    tag: d.tag as string,
    title: d.title as string,
    author: d.author as string,
    authorTitle: (d.authorTitle as string) ?? "",
    authorBio: (d.authorBio as string) ?? "",
    authorLinkedIn: (d.authorLinkedIn as string) || undefined,
    authorAvatar: mediaUrl(d.authorAvatar) || undefined,
    readTime: d.readTime as string,
    cover: mediaUrl(d.cover),
    coverAlt: mediaAlt(d.cover, (d.title as string) ?? ""),
    excerpt: d.excerpt as string,
    content: d.content,
    faqs: (d.faqs as { question: string; answer: string }[]) ?? [],
  };
}

async function findAll(collection: string, sort = "order") {
  try {
    const payload = await client();
    const { docs } = await payload.find({
      collection: collection as CollectionSlug,
      limit: 200,
      sort,
    });
    return docs as Record<string, unknown>[];
  } catch (err) {
    console.error(`[content] ${collection} query failed:`, err);
    return [];
  }
}

async function findGlobalSafe(slug: string) {
  try {
    const payload = await client();
    return (await payload.findGlobal({ slug: slug as GlobalSlug })) as Record<
      string,
      unknown
    > | null;
  } catch (err) {
    console.error(`[content] global ${slug} query failed:`, err);
    return null;
  }
}

function merge<T extends Record<string, unknown>>(
  base: T,
  cms: Record<string, unknown> | null,
): T {
  if (!cms) return base;
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base)) {
    const v = cms[key];
    if (Array.isArray(base[key])) {
      if (Array.isArray(v) && v.length) out[key] = v;
    } else if (v !== undefined && v !== null && v !== "") {
      out[key] = v;
    }
  }
  return out as T;
}

export async function getHomepageContent(): Promise<typeof HOMEPAGE> {
  return merge(HOMEPAGE, await findGlobalSafe("homepage"));
}

export async function getSiteSettingsContent(): Promise<typeof SITE_SETTINGS> {
  return merge(SITE_SETTINGS, await findGlobalSafe("site-settings"));
}

export async function getLegalPageContent(): Promise<typeof LEGAL_PAGE> {
  return merge(LEGAL_PAGE, await findGlobalSafe("legal-page"));
}

export async function getTrackRecordContent(): Promise<typeof TRACK_RECORD> {
  return merge(TRACK_RECORD, await findGlobalSafe("track-record"));
}

export async function getCertificationsContent(): Promise<CertItem[]> {
  const docs = await findAll("certifications");
  if (!docs.length) return CERT_DEFAULT;
  return docs.map((d) => ({
    code: d.code as string,
    ref: d.ref as string,
    year: d.year as string,
    label: d.label as string,
    description: d.description as string,
    logoName: d.logoName as string,
  }));
}

export async function getFaqsContent(
  audience: "companies" | "professionals",
): Promise<FaqItem[]> {
  const fallback =
    audience === "companies" ? FAQS_COMPANIES : FAQS_PROFESSIONALS;
  try {
    const payload = await client();
    const { docs } = await payload.find({
      collection:
        audience === "companies" ? "company-faqs" : "professional-faqs",
      limit: 50,
      sort: "order",
    });
    if (!docs.length) return fallback;
    return (docs as Record<string, unknown>[]).map((d) => ({
      question: d.question as string,
      answer: d.answer as string,
    }));
  } catch (err) {
    console.error(`[content] faqs (${audience}) query failed:`, err);
    return fallback;
  }
}

export async function getTestimonialQuotes(): Promise<QuoteItem[]> {
  const docs = await findAll("client-quotes");
  if (!docs.length) return TESTIMONIAL_QUOTES;
  return docs.map((d) => ({
    name: d.name as string,
    title: (d.title as string) ?? "",
    company: d.company as string,
    domain: d.domain as string,
    quote: (d.quote as string) ?? "",
    row: (d.row as string) ?? "one",
  }));
}

export async function getTestimonialVideos(): Promise<VideoItem[]> {
  const docs = await findAll("success-videos");
  if (!docs.length) return TESTIMONIAL_VIDEOS;
  return docs.map((d) => ({
    name: d.name as string,
    role: (d.role as string) ?? "",
    company: d.company as string,
    domain: d.domain as string,
    duration: (d.duration as string) ?? "",
    thumbnail: mediaUrl(d.thumbnail),
    row: (d.row as string) ?? "one",
  }));
}

async function fallbackPosts(): Promise<PostView[]> {
  return Promise.all(
    ALL_POSTS.map(async (p) => {
      const { md, faqs } = blocksToMarkdown(p.content);
      const content = await mdToLexical(md).catch(() => null);
      const { content: _drop, ...rest } = p;
      void _drop;
      return { ...rest, content, faqs } as PostView;
    }),
  );
}

export async function getPosts(): Promise<PostView[]> {
  try {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "posts",
      limit: 100,
      sort: "articleId",
    });
    if (!docs.length) return fallbackPosts();
    return docs.map((d) => toPostView(d as Record<string, unknown>));
  } catch (err) {
    console.error("[content] posts query failed, using bundled posts:", err);
    return fallbackPosts();
  }
}
