import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ALL_POSTS, buildHref, postsByTopic, topicSlug } from "@/lib/insights";

export function generateStaticParams() {
  const topics = new Set(ALL_POSTS.map((post) => topicSlug(post)));
  return Array.from(topics).map((topic) => ({ topic }));
}

export default async function InsightsTopic({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const posts = postsByTopic(topic);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <section className="w-full bg-black px-6 pt-32 pb-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-2 text-xs tracking-wide text-white/40">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/insights"
              className="transition-colors hover:text-white"
            >
              Insights
            </Link>
            <span>/</span>
            <span className="text-white/60">{posts[0].tag}</span>
          </div>

          <div className="mb-16 flex flex-col gap-4 md:max-w-2xl">
            <span className="flex items-center gap-2 text-sm font-medium tracking-widest text-white/60">
              <span className="text-white/40">[ Topic ]</span>
              {posts[0].tag}
            </span>
            <h1 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
              {posts[0].tag}.
            </h1>
          </div>

          <div className="border-t border-white/10">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={buildHref(post)}
                className="group grid grid-cols-1 gap-x-8 gap-y-3 border-b border-white/10 py-8 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-baseline"
              >
                <div className="flex items-center gap-2 text-xs tracking-widest text-white/40 uppercase md:col-span-3 md:flex-col md:items-start md:gap-2">
                  <span className="text-emerald-400">{post.date}</span>
                  <span className="text-white/50">{post.tag}</span>
                </div>

                <div className="flex flex-col gap-3 md:col-span-8">
                  <h2 className="text-xl leading-snug font-medium text-white/80 transition-colors group-hover:text-white md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-white/40">
                    {post.excerpt}
                  </p>
                  <span className="mt-1 text-xs tracking-wider text-white/30 uppercase">
                    {post.author}
                  </span>
                </div>

                <div className="hidden items-center justify-end md:col-span-1 md:flex">
                  <ArrowRight className="h-4 w-4 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
