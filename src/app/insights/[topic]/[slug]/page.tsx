import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import {
  ALL_POSTS,
  buildHref,
  findPost,
  slugify,
  topicSlug,
  type Block,
  type Span,
} from "@/lib/insights";

function renderSpans(spans: Span[]): ReactNode {
  return spans.map((span, i) => {
    let node: ReactNode = span.text;

    if (span.code) {
      node = (
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-emerald-300">
          {node}
        </code>
      );
    }
    if (span.highlight) {
      node = (
        <mark className="bg-emerald-400/20 px-1 text-white">{node}</mark>
      );
    }
    if (span.bold) {
      node = <strong className="font-semibold text-white">{node}</strong>;
    }
    if (span.italic) {
      node = <em className="italic">{node}</em>;
    }
    if (span.href) {
      node = (
        <Link
          href={span.href}
          className="text-emerald-400 underline underline-offset-4 transition-colors hover:text-emerald-300"
        >
          {node}
        </Link>
      );
    }

    return <span key={i}>{node}</span>;
  });
}

export function generateStaticParams() {
  return ALL_POSTS.map((post) => ({
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
  const post = findPost(topic, slug);

  if (!post) {
    notFound();
  }

  const toc = post.content
    .filter(
      (block): block is Extract<Block, { type: "heading" }> =>
        block.type === "heading" && block.level !== 4,
    )
    .map((block) => ({
      id: slugify(block.text),
      text: block.text,
      level: block.level,
    }));

  return (
    <>
      <Navbar />
      <article className="w-full bg-black px-6 pt-32 pb-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-2 text-xs tracking-wide text-white/40">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/insights/${topic}`}
              className="text-white/60 transition-colors hover:text-white"
            >
              {post.tag}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate text-white/60">{post.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="mx-auto w-full max-w-3xl lg:col-span-9 lg:mx-0">
              <Link
                href="/insights"
                className="group mb-10 flex w-fit items-center gap-2 text-xs tracking-wider text-white/50 uppercase transition-colors hover:text-white lg:hidden"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Insights
              </Link>

              <div className="mb-8 flex flex-col gap-4">
                <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50 uppercase">
                  <span className="text-emerald-400">{post.tag}</span>
                  {post.updated ? "Updated " : ""}
                  {post.date}
                  <span className="text-white/30">·</span>
                  {post.readTime}
                </span>
                <h1 className="font-instrument text-3xl leading-tight font-medium text-white sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>
                <span className="text-sm tracking-wider text-white/40 uppercase">
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

              <div className="flex flex-col gap-8">
                {post.content.map((block, i) => {
                  if (block.type === "heading") {
                    const id = slugify(block.text);
                    if (block.level === 2) {
                      return (
                        <h2
                          key={i}
                          id={id}
                          className="scroll-mt-28 font-instrument text-2xl font-medium text-white md:text-3xl"
                        >
                          {block.text}
                        </h2>
                      );
                    }
                    if (block.level === 3) {
                      return (
                        <h3
                          key={i}
                          id={id}
                          className="scroll-mt-28 font-instrument text-xl font-medium text-white md:text-2xl"
                        >
                          {block.text}
                        </h3>
                      );
                    }
                    return (
                      <h4
                        key={i}
                        id={id}
                        className="scroll-mt-28 text-sm font-semibold tracking-widest text-white/70 uppercase"
                      >
                        {block.text}
                      </h4>
                    );
                  }

                  if (block.type === "quote") {
                    return (
                      <p
                        key={i}
                        className="border-l-2 border-emerald-400/40 pl-6 text-lg leading-relaxed text-white/80 italic"
                      >
                        {block.text}
                      </p>
                    );
                  }

                  if (block.type === "list") {
                    const ListTag = block.ordered ? "ol" : "ul";
                    return (
                      <ListTag key={i} className="flex flex-col gap-3">
                        {block.items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 text-base leading-relaxed text-white/60"
                          >
                            {block.ordered ? (
                              <span className="mt-0.5 shrink-0 text-sm font-medium text-emerald-400">
                                {j + 1}.
                              </span>
                            ) : (
                              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                            )}
                            {item}
                          </li>
                        ))}
                      </ListTag>
                    );
                  }

                  if (block.type === "image") {
                    return (
                      <figure key={i} className="flex flex-col gap-3">
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                          <Image
                            src={block.src}
                            alt={block.alt}
                            fill
                            sizes="(min-width: 768px) 768px, 100vw"
                            className="object-cover"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="text-xs tracking-wide text-white/40">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  if (block.type === "code") {
                    return (
                      <pre
                        key={i}
                        className="overflow-x-auto bg-white/[0.04] p-5 text-sm leading-relaxed text-white/70"
                      >
                        <code>{block.code}</code>
                      </pre>
                    );
                  }

                  if (block.type === "faq") {
                    return (
                      <div key={i} className="flex flex-col">
                        {block.items.map((faq, j) => (
                          <details
                            key={j}
                            className="group border-b border-white/10 py-5 first:pt-0"
                          >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-white/80 transition-colors group-open:text-white">
                              {faq.question}
                              <span className="shrink-0 text-lg leading-none text-white/40 transition-transform duration-300 group-open:rotate-45 group-open:text-emerald-400">
                                +
                              </span>
                            </summary>
                            <p className="mt-4 text-sm leading-relaxed text-white/50">
                              {faq.answer}
                            </p>
                          </details>
                        ))}
                      </div>
                    );
                  }

                  if (block.type === "divider") {
                    return (
                      <div key={i} className="my-2 h-px w-full bg-white/10" />
                    );
                  }

                  return (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-white/60 md:text-lg"
                    >
                      {renderSpans(block.spans)}
                    </p>
                  );
                })}
              </div>

              <div className="mt-20 flex flex-col gap-4 bg-white/[0.03] p-6">
                <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 font-instrument text-lg font-medium text-white">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-medium text-white">
                      {post.author}
                    </span>
                    <span className="text-xs text-white/40">
                      {post.authorTitle}
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/50">
                  {post.authorBio}
                </p>
                {post.authorLinkedIn && (
                  <a
                    href={post.authorLinkedIn}
                    className="group flex w-fit items-center gap-2 text-xs tracking-wider text-white/50 uppercase transition-colors hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>

            <aside className="hidden lg:col-span-3 lg:block">
              <nav className="sticky top-28 flex flex-col gap-6 border-l border-white/10 pl-6">
                <Link
                  href="/insights"
                  className="group flex w-fit items-center gap-2 text-xs tracking-wider text-white/50 uppercase transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  Back to Insights
                </Link>

                {toc.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
                      On this page
                    </span>
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`text-sm leading-snug text-white/50 transition-colors hover:text-white ${
                          item.level === 3 ? "pl-3" : ""
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </div>
                )}
              </nav>
            </aside>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
