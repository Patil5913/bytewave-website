import { NextResponse } from "next/server";
import {
  getPayload,
  type CollectionSlug,
  type GlobalSlug,
  type RequiredDataFromCollectionSlug,
} from "payload";
import config from "@payload-config";
import { secretMatches } from "@/lib/routeGuards";
import { ALL_POSTS } from "@/lib/insights";
import { randomArticleId } from "@/collections/Posts";
import { blocksToLexical } from "@/lib/lexical";
import {
  SITE_STATS_CONTENT,
  SEED_PLACEMENTS,
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
  
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not available" }, { status: 404 });
  }

  const expected = process.env.SEED_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "SEED_SECRET is not set — seeding is disabled." },
      { status: 403 },
    );
  }

  if (!secretMatches(req.headers.get("x-seed-secret"), expected)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const payload = await getPayload({ config });
  const log: string[] = [];
  let failures = 0;

  const seedGlobal = async (
    slug: GlobalSlug,
    isEmpty: (current: Record<string, unknown>) => boolean,
    apply: () => Promise<unknown>,
  ) => {
    try {
      const current = (await payload.findGlobal({
        slug,
        overrideAccess: true,
      })) as unknown as Record<string, unknown>;
      if (!isEmpty(current)) {
        log.push(`${slug}: already set — skip`);
        return;
      }
      await apply();
      log.push(`${slug}: seeded`);
    } catch (err) {
      failures++;
      log.push(`${slug}: FAILED — ${(err as Error).message}`);
    }
  };

  const seedMany = async <S extends CollectionSlug>(
    collection: S,
    rows: RequiredDataFromCollectionSlug<S>[],
  ) => {
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      log.push(`${collection}: ${totalDocs} present — skip`);
      return;
    }
    let seeded = 0;
    for (const data of rows) {
      try {
        await payload.create({ collection, data, overrideAccess: true });
        seeded++;
      } catch (err) {
        failures++;
        log.push(`${collection}: row FAILED — ${(err as Error).message}`);
      }
    }
    log.push(`${collection}: seeded ${seeded}/${rows.length}`);
  };

  await seedMany("placements", SEED_PLACEMENTS);

  await seedMany(
    "client-quotes",
    TESTIMONIAL_QUOTES.map((t, i) => ({ ...t, order: i })),
  );
  await seedMany(
    "success-videos",
    TESTIMONIAL_VIDEOS.map((v, i) => ({ ...v, order: i })),
  );
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

  try {
    const { docs: unstatused } = await payload.find({
      collection: "posts",
      where: { _status: { exists: false } },
      limit: 500,
      overrideAccess: true,
    });
    for (const doc of unstatused) {
      await payload.update({
        collection: "posts",
        id: doc.id,
        data: { _status: "published" },
        overrideAccess: true,
      });
    }
    if (unstatused.length) {
      log.push(`posts: backfilled _status on ${unstatused.length}`);
    }
  } catch (err) {
    failures++;
    log.push(`posts: _status backfill FAILED — ${(err as Error).message}`);
  }

  const { totalDocs: postCount } = await payload.count({ collection: "posts" });
  if (postCount === 0) {
    
    let seededPosts = 0;
    for (const [i, post] of ALL_POSTS.entries()) {
      try {
        const { content, faqs } = await blocksToLexical(post.content);
        const parsed = Date.parse(post.date);
        const publishedAt = new Date(
          Number.isNaN(parsed) ? Date.now() - i * 86_400_000 : parsed,
        ).toISOString();
        await payload.create({
          collection: "posts",
          overrideAccess: true,
          data: {
            
            _status: "published",
            articleId: randomArticleId(),
            title: post.title,
            tag: post.tag,
            date: post.date,
            publishedAt,
            updated: post.updated ?? false,
            readTime: post.readTime,
            excerpt: post.excerpt,
            author: post.author,
            authorTitle: post.authorTitle,
            authorBio: post.authorBio,
            authorLinkedIn: post.authorLinkedIn,
            content,
            faqs,
          },
        });
        seededPosts++;
      } catch (err) {
        failures++;
        log.push(`posts: "${post.title}" FAILED — ${(err as Error).message}`);
      }
    }
    log.push(`posts: seeded ${seededPosts}/${ALL_POSTS.length}`);
  } else {
    log.push(`posts: ${postCount} present — skip`);
  }

  await seedGlobal(
    "site-stats",
    (c) => !(c.stats as unknown[] | undefined)?.length,
    () =>
      payload.updateGlobal({
        slug: "site-stats",
        overrideAccess: true,
        data: { stats: SITE_STATS_CONTENT },
      }),
  );

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
    (c) => !c.manifestoHeadline,
    () =>
      payload.updateGlobal({
        slug: "homepage",
        overrideAccess: true,
        data: homepageCms,
      }),
  );
  await seedGlobal(
    "site-settings",
    (c) => !c.tagline,
    () =>
      payload.updateGlobal({
        slug: "site-settings",
        overrideAccess: true,
        data: SITE_SETTINGS,
      }),
  );
  await seedGlobal(
    "legal-page",
    (c) => !(c.documents as unknown[] | undefined)?.length,
    () =>
      payload.updateGlobal({
        slug: "legal-page",
        overrideAccess: true,
        data: LEGAL_PAGE,
      }),
  );
  await seedGlobal(
    "track-record",
    (c) => !(c.stats as unknown[] | undefined)?.length,
    () =>
      payload.updateGlobal({
        slug: "track-record",
        overrideAccess: true,
        data: TRACK_RECORD,
      }),
  );

  return NextResponse.json(
    { ok: failures === 0, failures, log },
    { status: failures === 0 ? 200 : 207 },
  );
}
