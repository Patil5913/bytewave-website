import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ReadingProgress from "@components/ReadingProgress";
import ArticleToc from "@components/ArticleToc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { buildHref, topicSlug } from "@/lib/insights";
import { getPosts, getSiteSettingsContent } from "@/lib/content";
import { ArticleRichText, extractToc, hasHeading } from "@/lib/richtext";
import { metadataFromSettings } from "@/lib/seo";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}): Promise<Metadata> {
  const { topic, slug } = await params;
  const [allPosts, settings] = await Promise.all([
    getPosts(),
    getSiteSettingsContent(),
  ]);
  const post = allPosts.find(
    (p) =>
      topicSlug(p) === topic && (slug === p.id || slug.startsWith(`${p.id}-`)),
  );
  if (!post) return metadataFromSettings(settings.seo);

  return metadataFromSettings(settings.seo, {
    title: `${post.title} · find & hire`,
    description: post.excerpt,
    path: buildHref(post),
    image: post.cover,
    article: {
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
    },
  });
}

export async function generateStaticParams() {
  const all = await getPosts();
  return all.map((post) => ({
    topic: topicSlug(post),
    slug: buildHref(post).split("/").pop() as string,
  }));
}

export default async function InsightArticle({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic, slug } = await params;
  const [allPosts, settings] = await Promise.all([
    getPosts(),
    getSiteSettingsContent(),
  ]);
  const post = allPosts.find(
    (p) =>
      topicSlug(p) === topic && (slug === p.id || slug.startsWith(`${p.id}-`)),
  );

  if (!post) {
    notFound();
  }

  const toc = extractToc(post.content);
  const faqs = post.faqs ?? [];
  const faqHeadingInBody = hasHeading(
    post.content,
    /^\s*frequently asked questions\s*$/i,
  );

  const related = [
    ...allPosts.filter(
      (p) => p.id !== post.id && topicSlug(p) === topicSlug(post),
    ),
    ...allPosts.filter(
      (p) => p.id !== post.id && topicSlug(p) !== topicSlug(post),
    ),
  ].slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <Navbar ctaLabel={settings.navCtaLabel} />
      <article className="w-full bg-canvas px-6 pt-32 pb-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-2 text-xs tracking-wide text-ink/40">
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/insights/${topic}`}
              className="text-ink/60 transition-colors hover:text-ink"
            >
              {post.tag}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate text-ink/60">{post.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="mx-auto w-full max-w-3xl lg:col-span-9 lg:mx-0">
              <Link
                href="/insights"
                className="group mb-10 flex w-fit items-center gap-2 text-xs tracking-wider text-ink/50 uppercase transition-colors hover:text-ink lg:hidden"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Insights
              </Link>

              <div className="mb-8 flex flex-col gap-4">
                <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45 uppercase">
                  <span className="text-brand">{post.tag}</span>
                  {post.updated ? "Updated " : ""}
                  {post.date}
                  <span className="text-ink/30">·</span>
                  {post.readTime}
                </span>
                <h1 className="font-instrument text-3xl leading-tight font-medium text-ink sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>
                <span className="text-sm tracking-wider text-ink/40 uppercase">
                  Written by {post.author}
                </span>
              </div>

              <div className="relative mb-16 aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                />
              </div>

              <ArticleRichText data={post.content} />

              {faqs.length > 0 && (
                <div
                  className={
                    faqHeadingInBody ? "flex flex-col" : "mt-12 flex flex-col"
                  }
                >
                  {!faqHeadingInBody && (
                    <h2
                      id="frequently-asked-questions"
                      className="mb-4 scroll-mt-28 font-instrument text-2xl font-medium text-ink md:text-3xl"
                    >
                      Frequently asked questions
                    </h2>
                  )}
                  {faqs.map((faq, j) => (
                    <details
                      key={j}
                      className="group border-b border-ink/10 py-5 first:pt-0"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink/80 transition-colors group-open:text-ink">
                        {faq.question}
                        <span className="shrink-0 text-lg leading-none text-ink/40 transition-transform duration-300 group-open:rotate-45 group-open:text-brand">
                          +
                        </span>
                      </summary>
                      <p className="mt-4 text-sm leading-relaxed text-ink/60">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              )}

              <div className="mt-20 flex flex-col gap-4 bg-ink/[0.03] p-6">
                <span className="text-xs font-medium tracking-widest text-ink/40 uppercase">
                  About the Author
                </span>
                <div className="flex items-start gap-4">
                  {post.authorAvatar ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={post.authorAvatar}
                        alt={post.author}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink/10 font-instrument text-lg font-medium text-ink">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-medium text-ink">
                      {post.author}
                    </span>
                    <span className="text-xs text-ink/40">
                      {post.authorTitle}
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-ink/50">
                  {post.authorBio}
                </p>
                {post.authorLinkedIn && (
                  <a
                    href={post.authorLinkedIn}
                    className="group flex w-fit items-center gap-2 text-xs tracking-wider text-ink/50 uppercase transition-colors hover:text-ink"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}
              </div>

              {related.length > 0 && (
                <div className="mt-20 flex flex-col gap-8 border-t border-ink/10 pt-10">
                  <div className="flex items-end justify-between">
                    <span className="text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
                      Keep Reading
                    </span>
                    <Link
                      href="/insights"
                      className="group flex items-center gap-2 text-xs tracking-wider text-ink/50 uppercase transition-colors hover:text-ink"
                    >
                      All Insights
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={buildHref(r)}
                        className="group flex flex-col gap-3"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <Image
                            src={r.cover}
                            alt={r.title}
                            fill
                            sizes="(min-width: 640px) 240px, 100vw"
                            className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                          />
                        </div>
                        <span className="text-[11px] tracking-widest text-brand uppercase">
                          {r.tag}
                        </span>
                        <h3 className="font-instrument text-lg leading-snug font-medium text-ink transition-colors group-hover:text-brand">
                          {r.title}
                        </h3>
                        <span className="text-xs tracking-wider text-ink/40 uppercase">
                          {r.readTime}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="hidden lg:col-span-3 lg:block">
              <nav className="sticky top-28 flex flex-col gap-6 border-l border-ink/10 pl-6">
                <Link
                  href="/insights"
                  className="group flex w-fit items-center gap-2 text-xs tracking-wider text-ink/50 uppercase transition-colors hover:text-ink"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  Back to Insights
                </Link>

                <ArticleToc items={toc} />
              </nav>
            </aside>
          </div>
        </div>
      </article>
      <Footer settings={settings} />
    </>
  );
}
