import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { buildHref, topicSlug } from "@/lib/insights";
import { getPosts, getSiteSettingsContent } from "@/lib/content";
import { metadataFromSettings } from "@/lib/seo";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const [all, settings] = await Promise.all([
    getPosts(),
    getSiteSettingsContent(),
  ]);
  const posts = all.filter((post) => topicSlug(post) === topic);
  if (!posts.length) return metadataFromSettings(settings.seo);

  const label = posts[0].tag;
  const count = `${posts.length} ${posts.length === 1 ? "article" : "articles"}`;
  return metadataFromSettings(settings.seo, {
    title: `${label} · Insights · find & hire`,
    description: `${count} on ${label} — hiring analysis and field notes from inside the network.`,
    path: `/insights/${topic}`,
  });
}

export async function generateStaticParams() {
  const all = await getPosts();
  const topics = new Set(all.map((post) => topicSlug(post)));
  return Array.from(topics).map((topic) => ({ topic }));
}

export default async function InsightsTopic({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const [all, settings] = await Promise.all([
    getPosts(),
    getSiteSettingsContent(),
  ]);
  const posts = all.filter((post) => topicSlug(post) === topic);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <Navbar ctaLabel={settings.navCtaLabel} />
      <section className="w-full bg-canvas px-6 pt-32 pb-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-2 text-xs tracking-wide text-ink/40">
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span>/</span>
            <Link href="/insights" className="transition-colors hover:text-ink">
              Insights
            </Link>
            <span>/</span>
            <span className="text-ink/60">{posts[0].tag}</span>
          </div>

          <div className="mb-16 flex flex-col gap-4 md:max-w-2xl">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              <span className="text-ink/40">[ Topic ]</span>
              {posts[0].tag}
            </span>
            <h1 className="font-instrument text-4xl leading-tight font-medium text-ink lg:text-5xl">
              {posts[0].tag}.
            </h1>
          </div>

          <div className="border-t border-ink/10">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={buildHref(post)}
                className="group grid grid-cols-1 gap-x-8 gap-y-3 border-b border-ink/10 py-8 transition-colors hover:bg-ink/[0.02] md:grid-cols-12 md:items-baseline"
              >
                <div className="flex items-center gap-2 text-xs tracking-widest text-ink/40 uppercase md:col-span-3 md:flex-col md:items-start md:gap-2">
                  <span className="text-ink/50">{post.date}</span>
                  <span className="text-ink/40">{post.tag}</span>
                </div>

                <div className="flex flex-col gap-3 md:col-span-8">
                  <h2 className="text-xl leading-snug font-medium text-ink/80 transition-colors group-hover:text-ink md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-ink/40">
                    {post.excerpt}
                  </p>
                  <span className="mt-1 text-xs tracking-wider text-ink/30 uppercase">
                    {post.author}
                  </span>
                </div>

                <div className="hidden items-center justify-end md:col-span-1 md:flex">
                  <ArrowRight className="h-4 w-4 text-ink/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer settings={settings} />
    </>
  );
}
