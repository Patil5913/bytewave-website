import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { ALL_POSTS } from "@/lib/insights";
import { randomArticleId } from "@/collections/Posts";
import { blocksToMarkdown } from "@/lib/markdown";
import { mdToLexical } from "@/lib/lexical";
import {
  HOMEPAGE,
  SITE_SETTINGS,
  FAQS_COMPANIES,
  FAQS_PROFESSIONALS,
  CERTIFICATIONS,
  TESTIMONIAL_QUOTES,
  TESTIMONIAL_VIDEOS,
  PARTNERS_HERO,
} from "@/lib/siteContent";

// Server-side seed (runs in the Next runtime so lexical/markdown conversion
// works — bun/tsx can't load the lexical graph). Guarded by a secret.
//   curl -X POST "http://localhost:3000/seed-content?secret=dev-seed"
export async function POST(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== (process.env.SEED_SECRET ?? "dev-seed")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const payload = await getPayload({ config });
  const log: string[] = [];

  const seedMany = async (
    collection: string,
    rows: Record<string, unknown>[],
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { totalDocs } = await payload.count({ collection: collection as any });
    if (totalDocs > 0) {
      log.push(`${collection}: ${totalDocs} present — skip`);
      return;
    }
    for (const data of rows) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection: collection as any, data, overrideAccess: true });
    }
    log.push(`${collection}: seeded ${rows.length}`);
  };

  // --- collections -------------------------------------------------------
  await seedMany(
    "placements",
    [
      { role: "Backend Developer", stack: "Python, FastAPI, SQLAlchemy", candidate: "M. Davis", company: "stripe.com", companyName: "Stripe", location: "New York, NY", pay: "$165k Base", status: "Placed", order: 0 },
      { role: "Product Designer", stack: "Figma, Design Systems", candidate: "A. Chen", company: "notion.so", companyName: "Notion", location: "Remote", pay: "$140k Base", status: "Offer", order: 1 },
      { role: "Frontend Engineer", stack: "React, TypeScript, Next.js", candidate: "J. Okafor", company: "linear.app", companyName: "Linear", location: "San Francisco, CA", pay: "$155k Base", status: "Interviewing", order: 2 },
      { role: "Data Analyst", stack: "SQL, Python, Looker", candidate: "R. Foster", company: "figma.com", companyName: "Figma", location: "Austin, TX", pay: "$120k Base", status: "Placed", order: 3 },
      { role: "DevOps Engineer", stack: "Kubernetes, Terraform, AWS", candidate: "S. Kim", company: "vercel.com", companyName: "Vercel", location: "Seattle, WA", pay: "$175k Base", status: "Negotiating", order: 4 },
    ],
  );

  await seedMany(
    "client-quotes",
    TESTIMONIAL_QUOTES.map((t, i) => ({ ...t, order: i })),
  );
  await seedMany(
    "success-videos",
    TESTIMONIAL_VIDEOS.map((t, i) => ({ ...t, order: i })),
  );
  await seedMany(
    "faqs-companies",
    FAQS_COMPANIES.map((f, i) => ({ ...f, order: i })),
  );
  await seedMany(
    "faqs-professionals",
    FAQS_PROFESSIONALS.map((f, i) => ({ ...f, order: i })),
  );

  await seedMany(
    "certifications",
    CERTIFICATIONS.map((c, i) => ({ ...c, order: i })),
  );

  await seedMany("partners", PARTNERS_HERO);

  // --- posts (markdown -> lexical) --------------------------------------
  const { totalDocs: postCount } = await payload.count({ collection: "posts" });
  if (postCount === 0) {
    for (const post of ALL_POSTS) {
      const { md, faqs } = blocksToMarkdown(post.content);
      const content = await mdToLexical(md);
      await payload.create({
        collection: "posts",
        overrideAccess: true,
        data: {
          articleId: randomArticleId(),
          title: post.title,
          tag: post.tag,
          date: post.date,
          updated: post.updated ?? false,
          readTime: post.readTime,
          cover: post.cover,
          excerpt: post.excerpt,
          author: post.author,
          authorTitle: post.authorTitle,
          authorBio: post.authorBio,
          authorLinkedIn: post.authorLinkedIn,
          authorAvatar: post.authorAvatar,
          content,
          faqs,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      });
    }
    log.push(`posts: seeded ${ALL_POSTS.length}`);
  } else {
    log.push(`posts: ${postCount} present — skip`);
  }

  // --- globals -----------------------------------------------------------
  await payload.updateGlobal({
    slug: "site-stats",
    overrideAccess: true,
    data: {
      stats: [
        { value: 94, decimals: 0, suffix: "%", label: "Placement Success Rate", note: "of matched roles close on the first shortlist." },
        { value: 14, decimals: 0, suffix: "d", label: "Avg. Time-to-Placement", note: "from first intro to signed offer." },
        { value: 1.2, decimals: 1, suffix: "k", label: "Verified Professionals", note: "skills confirmed, not keyword-matched." },
        { value: 150, decimals: 0, suffix: "+", label: "Partner Organizations", note: "hiring directly through the network." },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await payload.updateGlobal({ slug: "homepage", overrideAccess: true, data: HOMEPAGE as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await payload.updateGlobal({ slug: "site-settings", overrideAccess: true, data: SITE_SETTINGS as any });
  log.push("globals: site-stats, homepage, site-settings updated");

  return NextResponse.json({ ok: true, log });
}
