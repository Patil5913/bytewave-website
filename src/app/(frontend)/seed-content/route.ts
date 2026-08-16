import { NextResponse } from "next/server";
import { getPayload, type CollectionSlug } from "payload";
import config from "@payload-config";
import { ALL_POSTS } from "@/lib/insights";
import { randomArticleId } from "@/collections/Posts";
import { blocksToMarkdown } from "@/lib/markdown";
import { mdToLexical } from "@/lib/lexical";
import {
  HOMEPAGE,
  SITE_SETTINGS,
  TRACK_RECORD,
  CERTIFICATIONS,
  FAQS_COMPANIES,
  LEGAL_PAGE,
  FAQS_PROFESSIONALS,
  TESTIMONIAL_QUOTES,
  TESTIMONIAL_VIDEOS,
} from "@/lib/siteContent";

export async function POST(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== (process.env.SEED_SECRET ?? "dev-seed")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const payload = await getPayload({ config });
  type GlobalData = Parameters<typeof payload.updateGlobal>[0]["data"];
  const log: string[] = [];

  /**
   * Pull a bundled remote image into the Media collection and return its id,
   * so seeded posts and videos satisfy the upload fields. Results are cached
   * per URL because the same cover is reused across fixtures.
   */
  const mediaCache = new Map<string, string | number>();
  const ensureMedia = async (url: string | undefined, alt: string) => {
    if (!url) return undefined;
    const cached = mediaCache.get(url);
    if (cached !== undefined) return cached;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = Buffer.from(await res.arrayBuffer());
      const mimetype = res.headers.get("content-type") ?? "image/jpeg";
      const name = `${alt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60)}.${mimetype.split("/")[1]?.split(";")[0] ?? "jpg"}`;
      const doc = await payload.create({
        collection: "media",
        overrideAccess: true,
        data: { alt },
        file: { data, mimetype, name, size: data.byteLength },
      });
      mediaCache.set(url, doc.id);
      return doc.id;
    } catch (err) {
      log.push(`media: failed to import ${url} — ${(err as Error).message}`);
      return undefined;
    }
  };

  /**
   * Globals are seeded once. Re-running the seed must never clobber content
   * the client has since edited in the admin, so a global that already holds
   * data is left alone.
   */
  const seedGlobal = async (
    slug: Parameters<typeof payload.updateGlobal>[0]["slug"],
    data: GlobalData,
    isEmpty: (current: Record<string, unknown>) => boolean,
  ) => {
    const current = (await payload.findGlobal({
      slug,
      overrideAccess: true,
    })) as Record<string, unknown>;
    if (!isEmpty(current)) {
      log.push(`${slug}: already set — skip`);
      return;
    }
    await payload.updateGlobal({ slug, overrideAccess: true, data });
    log.push(`${slug}: seeded`);
  };

  const seedMany = async (
    collection: CollectionSlug,
    rows: Record<string, unknown>[],
  ) => {
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      log.push(`${collection}: ${totalDocs} present — skip`);
      return;
    }
    for (const data of rows) {
      await payload.create({
        collection,
        data: data as Parameters<typeof payload.create>[0]["data"],
        overrideAccess: true,
      });
    }
    log.push(`${collection}: seeded ${rows.length}`);
  };

  await seedMany("placements", [
    {
      role: "Backend Developer",
      stack: "Python, FastAPI, SQLAlchemy",
      candidate: "M. Davis",
      company: "stripe.com",
      companyName: "Stripe",
      location: "New York, NY",
      pay: "$165k Base",
      status: "Placed",
      order: 0,
    },
    {
      role: "Product Designer",
      stack: "Figma, Design Systems",
      candidate: "A. Chen",
      company: "notion.so",
      companyName: "Notion",
      location: "Remote",
      pay: "$140k Base",
      status: "Offer",
      order: 1,
    },
    {
      role: "Frontend Engineer",
      stack: "React, TypeScript, Next.js",
      candidate: "J. Okafor",
      company: "linear.app",
      companyName: "Linear",
      location: "San Francisco, CA",
      pay: "$155k Base",
      status: "Interviewing",
      order: 2,
    },
    {
      role: "Data Analyst",
      stack: "SQL, Python, Looker",
      candidate: "R. Foster",
      company: "figma.com",
      companyName: "Figma",
      location: "Austin, TX",
      pay: "$120k Base",
      status: "Placed",
      order: 3,
    },
    {
      role: "DevOps Engineer",
      stack: "Kubernetes, Terraform, AWS",
      candidate: "S. Kim",
      company: "vercel.com",
      companyName: "Vercel",
      location: "Seattle, WA",
      pay: "$175k Base",
      status: "Negotiating",
      order: 4,
    },
  ]);

  await seedMany(
    "client-quotes",
    TESTIMONIAL_QUOTES.map((t, i) => ({ ...t, order: i })),
  );
  const { totalDocs: videoCount } = await payload.count({
    collection: "success-videos",
  });
  if (videoCount === 0) {
    for (const [i, video] of TESTIMONIAL_VIDEOS.entries()) {
      const thumbnail = await ensureMedia(
        video.thumbnail,
        `${video.name} — ${video.company}`,
      );
      if (!thumbnail) continue;
      await payload.create({
        collection: "success-videos",
        overrideAccess: true,
        data: { ...video, thumbnail, order: i } as Parameters<
          typeof payload.create
        >[0]["data"],
      });
    }
    log.push(`success-videos: seeded ${TESTIMONIAL_VIDEOS.length}`);
  } else {
    log.push(`success-videos: ${videoCount} present — skip`);
  }
  await seedMany(
    "certifications",
    CERTIFICATIONS.map((c, i) => ({ ...c, order: i })),
  );
  await seedMany(
    "company-faqs",
    FAQS_COMPANIES.map((f, i) => ({ ...f, order: i })),
  );
  await seedMany(
    "professional-faqs",
    FAQS_PROFESSIONALS.map((f, i) => ({ ...f, order: i })),
  );

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
          cover: await ensureMedia(post.cover, post.title),
          excerpt: post.excerpt,
          author: post.author,
          authorTitle: post.authorTitle,
          authorBio: post.authorBio,
          authorLinkedIn: post.authorLinkedIn,
          authorAvatar: await ensureMedia(post.authorAvatar, post.author),
          content,
          faqs,
        } as Parameters<typeof payload.create>[0]["data"],
      });
    }
    log.push(`posts: seeded ${ALL_POSTS.length}`);
  } else {
    log.push(`posts: ${postCount} present — skip`);
  }

  await seedGlobal(
    "site-stats",
    {
      stats: [
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
      ],
    } as GlobalData,
    (c) => !(c.stats as unknown[] | undefined)?.length,
  );

  // The hero is code-only, so only the editable sections are seeded.
  const homepageCms = {
    manifestoHeadline: HOMEPAGE.manifestoHeadline,
    manifestoBody: HOMEPAGE.manifestoBody,
    manifestoPoints: HOMEPAGE.manifestoPoints,
    agentParagraphs: HOMEPAGE.agentParagraphs,
    storyPanels: HOMEPAGE.storyPanels,
    ctaHeadline: HOMEPAGE.ctaHeadline,
    ctaBody: HOMEPAGE.ctaBody,
    ctaResponseNote: HOMEPAGE.ctaResponseNote,
  };

  await seedGlobal(
    "homepage",
    homepageCms as GlobalData,
    (c) => !c.manifestoHeadline,
  );
  await seedGlobal(
    "site-settings",
    SITE_SETTINGS as GlobalData,
    (c) => !c.tagline,
  );
  await seedGlobal(
    "legal-page",
    LEGAL_PAGE as GlobalData,
    (c) => !(c.documents as unknown[] | undefined)?.length,
  );
  await seedGlobal(
    "track-record",
    TRACK_RECORD as GlobalData,
    (c) => !(c.stats as unknown[] | undefined)?.length,
  );

  return NextResponse.json({ ok: true, log });
}
