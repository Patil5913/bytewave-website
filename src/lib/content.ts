import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import { ALL_POSTS, type Post } from "./insights";
import { blocksToMarkdown } from "./markdown";
import { mdToLexical } from "./lexical";
import {
  HOMEPAGE,
  SITE_SETTINGS,
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

// A post as consumed by the article page: identical to Post but `content` is a
// Lexical editor state (rich text) instead of the legacy block array.
export type PostView = Omit<Post, "content"> & {
  content: unknown;
  faqs?: { question: string; answer: string }[];
};

// Static fallbacks — used verbatim if Payload/DB is unreachable so the site
// (and the production build) never hard-fails on a data source.
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

const FALLBACK_PLACEMENTS: Placement[] = [
  { role: "Backend Developer", stack: "Python, FastAPI, SQLAlchemy", candidate: "M. Davis", company: "stripe.com", companyName: "Stripe", location: "New York, NY", pay: "$165k Base", status: "Placed" },
  { role: "Product Designer", stack: "Figma, Design Systems", candidate: "A. Chen", company: "notion.so", companyName: "Notion", location: "Remote", pay: "$140k Base", status: "Offer" },
  { role: "Frontend Engineer", stack: "React, TypeScript, Next.js", candidate: "J. Okafor", company: "linear.app", companyName: "Linear", location: "San Francisco, CA", pay: "$155k Base", status: "Interviewing" },
  { role: "Data Analyst", stack: "SQL, Python, Looker", candidate: "R. Foster", company: "figma.com", companyName: "Figma", location: "Austin, TX", pay: "$120k Base", status: "Placed" },
  { role: "DevOps Engineer", stack: "Kubernetes, Terraform, AWS", candidate: "S. Kim", company: "vercel.com", companyName: "Vercel", location: "Seattle, WA", pay: "$175k Base", status: "Negotiating" },
];

export type SiteStat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  note: string;
};

const FALLBACK_STATS: SiteStat[] = [
  { value: 94, decimals: 0, suffix: "%", label: "Placement Success Rate", note: "of matched roles close on the first shortlist." },
  { value: 14, decimals: 0, suffix: "d", label: "Avg. Time-to-Placement", note: "from first intro to signed offer." },
  { value: 1.2, decimals: 1, suffix: "k", label: "Verified Professionals", note: "skills confirmed, not keyword-matched." },
  { value: 150, decimals: 0, suffix: "+", label: "Partner Organizations", note: "hiring directly through the network." },
];

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
    if (!docs.length) return FALLBACK_PLACEMENTS;
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
  } catch {
    return FALLBACK_PLACEMENTS;
  }
}

export async function getSiteStats(): Promise<SiteStat[]> {
  try {
    const payload = await client();
    const global = (await payload.findGlobal({
      slug: "site-stats",
    })) as Record<string, unknown>;
    const stats = (global?.stats ?? []) as SiteStat[];
    return stats.length ? stats : FALLBACK_STATS;
  } catch {
    return FALLBACK_STATS;
  }
}

// Maps a Payload post doc to the article-page view. `content` is Lexical rich
// text stored as-is; `faqs` is a structured side array.
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
    authorAvatar: (d.authorAvatar as string) || undefined,
    readTime: d.readTime as string,
    cover: d.cover as string,
    excerpt: d.excerpt as string,
    content: d.content,
    faqs: (d.faqs as { question: string; answer: string }[]) ?? [],
  };
}

// --- generic helpers for CMS-or-default content -------------------------

async function findAll(collection: string, sort = "order") {
  try {
    const payload = await client();
    const { docs } = await payload.find({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: collection as any,
      limit: 200,
      sort,
    });
    return docs as Record<string, unknown>[];
  } catch {
    return [];
  }
}

async function findGlobalSafe(slug: string) {
  try {
    const payload = await client();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await payload.findGlobal({ slug: slug as any })) as Record<
      string,
      unknown
    > | null;
  } catch {
    return null;
  }
}

export const getTestimonials = () => findAll("testimonials");
export const getFaqs = () => findAll("faqs");
export const getCertifications = () => findAll("certifications");
export const getPartners = () => findAll("partners");

// Merge a CMS global over the static default: scalar CMS values win when
// present; arrays win when non-empty; otherwise the default is used.
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
  const docs = await findAll(
    audience === "companies" ? "faqs-companies" : "faqs-professionals",
  );
  if (!docs.length)
    return audience === "companies" ? FAQS_COMPANIES : FAQS_PROFESSIONALS;
  return docs.map((d) => ({
    question: d.question as string,
    answer: d.answer as string,
  }));
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
    thumbnail: (d.thumbnail as string) ?? "",
    row: (d.row as string) ?? "one",
  }));
}

// Fallback: convert legacy block-array posts to Lexical so the article page
// still renders when the DB is empty/unreachable.
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
  } catch {
    return fallbackPosts();
  }
}
