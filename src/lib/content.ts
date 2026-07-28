import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import { ALL_POSTS, type Post } from "./insights";

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

// Maps a Payload post doc back to the shared `Post` shape the renderer uses.
function toPost(d: Record<string, unknown>): Post {
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
    content: d.content as Post["content"],
  };
}

export async function getPosts(): Promise<Post[]> {
  try {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "posts",
      limit: 100,
      sort: "articleId",
    });
    if (!docs.length) return ALL_POSTS;
    return docs.map((d) => toPost(d as Record<string, unknown>));
  } catch {
    return ALL_POSTS;
  }
}
