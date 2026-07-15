import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

// Placeholder content shape mirrors what a markdown frontmatter + body
// pipeline will produce later (title/meta fields + an array of blocks).
// Inline spans cover the common markdown inline marks (bold, italic, code,
// highlight, link) so the renderer below is a drop-in target once real
// markdown parsing is wired up.
type Span = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  highlight?: boolean;
  href?: string;
};

type Block =
  | { type: "paragraph"; spans: Span[] }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "code"; language: string; code: string }
  | { type: "divider" };

type Post = {
  slug: string;
  date: string;
  tag: string;
  title: string;
  author: string;
  readTime: string;
  cover: string;
  excerpt: string;
  content: Block[];
};

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

const POSTS: Record<string, Post> = {
  "article-1": {
    slug: "article-1",
    date: "October 12, 2026",
    tag: "Market Analysis",
    title: "The changing baseline for senior DevOps compensation in Q4.",
    author: "R. Fischer",
    readTime: "6 min read",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    excerpt:
      "Compensation bands are shifting fast as demand for platform engineers outpaces supply across every major market.",
    content: [
      {
        type: "paragraph",
        spans: [
          {
            text: "Compensation bands are shifting fast as demand for platform engineers outpaces supply across every major market. ",
          },
          {
            text: "Over the last two quarters",
            bold: true,
          },
          {
            text: ", we've tracked a consistent upward drift in senior DevOps offers, with the steepest gains concentrated in organizations running multi-cloud infrastructure at scale.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Why the baseline moved",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Three forces are compounding at once: a shrinking pool of engineers with production ",
          },
          { text: "Kubernetes", code: true },
          {
            text: " experience, a wave of cost-optimization mandates pushing companies to hire fewer but ",
          },
          { text: "more senior", italic: true },
          {
            text: " operators, and a growing willingness among candidates to hold out for roles that match their leverage.",
          },
        ],
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1800&auto=format&fit=crop",
        alt: "Compensation trend chart mockup",
        caption:
          "Trailing 90-day offer data across platform and infrastructure roles.",
      },
      {
        type: "quote",
        text: "The candidates who understand their own leverage are the ones setting the new floor for everyone else.",
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "What we're seeing in live placements confirms this. Base salary alone is no longer the full picture — ",
          },
          {
            text: "sign-on bonuses, accelerated equity vesting, and remote-first flexibility",
            highlight: true,
          },
          {
            text: " are all being used as levers to close offers that would have gone uncontested a year ago. For a breakdown of how we source this data, see our ",
          },
          {
            text: "methodology page",
            href: "/insights",
          },
          { text: "." },
        ],
      },
      {
        type: "heading",
        level: 3,
        text: "A sample band, for context",
      },
      {
        type: "code",
        language: "text",
        code: "Platform Engineer, Senior (5-8 yrs)\nBase:    $155k – $195k\nEquity:  0.02% – 0.08%\nBonus:   10% – 15% target",
      },
      {
        type: "divider",
      },
      {
        type: "heading",
        level: 2,
        text: "What this means for your next negotiation",
      },
      {
        type: "list",
        items: [
          "Anchor to trailing 90-day data, not last year's range.",
          "Treat equity and flexibility as negotiable line items, not fixed perks.",
          "Expect longer close cycles for senior platform roles — scarcity cuts both ways.",
        ],
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Pull the current band for your exact role and seniority.",
          "Separate your ask into base, equity, and flexibility — negotiate each on its own terms.",
          "Walk in prepared to justify the number with data, not sentiment.",
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "The takeaway isn't that every offer will land at the top of the range. It's that walking into the conversation with real, current data changes the shape of the negotiation entirely.",
          },
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export default async function InsightArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <article className="w-full bg-black px-6 pt-32 pb-24 md:px-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/insights"
            className="group mb-10 flex w-fit items-center gap-2 text-xs tracking-wider text-white/50 uppercase transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Insights
          </Link>

          <div className="mb-8 flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50 uppercase">
              <span className="text-emerald-400">{post.tag}</span>
              {post.date}
              <span className="text-white/30">·</span>
              {post.readTime}
            </span>
            <h1 className="font-instrument text-3xl leading-tight font-medium text-white sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <span className="text-sm tracking-wider text-white/40 uppercase">
              By {post.author}
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
                return block.level === 2 ? (
                  <h2
                    key={i}
                    className="font-instrument text-2xl font-medium text-white md:text-3xl"
                  >
                    {block.text}
                  </h2>
                ) : (
                  <h3
                    key={i}
                    className="font-instrument text-xl font-medium text-white md:text-2xl"
                  >
                    {block.text}
                  </h3>
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

              if (block.type === "divider") {
                return <div key={i} className="my-2 h-px w-full bg-white/10" />;
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
        </div>
      </article>
      <Footer />
    </>
  );
}
