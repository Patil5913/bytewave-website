import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { buildHref } from "@/lib/insights";
import { getPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

const PER_PAGE = 5;
const pageHref = (n: number) => (n <= 1 ? "/insights" : `/insights?page=${n}`);

export default async function InsightsIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const ALL_POSTS = await getPosts();
  const TOTAL_PAGES = Math.max(1, Math.ceil(ALL_POSTS.length / PER_PAGE));

  const { page: pageParam } = await searchParams;
  const page = Math.min(
    TOTAL_PAGES,
    Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1),
  );

  const slice = ALL_POSTS.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const LEAD = page === 1 ? slice[0] : null;
  const REST = page === 1 ? slice.slice(1) : slice;

  return (
    <>
      <Navbar />
      <section className="w-full bg-canvas px-6 pt-32 pb-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col gap-4 md:max-w-2xl">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              Insights
            </span>
            <h1 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-6xl">
              Intelligence &amp; Insights.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-ink/50">
              Market data, hiring analysis, and field notes from inside the
              network.
            </p>
          </div>

          {LEAD && (
            <Link
              href={buildHref(LEAD)}
              className="group grid grid-cols-1 gap-8 border-t-2 border-ink pt-8 lg:grid-cols-2 lg:gap-14"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={LEAD.cover}
                  alt={LEAD.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <div className="flex flex-col justify-center gap-4">
                <span className="flex items-center gap-2.5 text-xs tracking-widest uppercase">
                  <span className="text-brand">Latest</span>
                  <span className="text-ink/40">{LEAD.tag}</span>
                </span>
                <h2 className="font-instrument text-3xl leading-tight font-medium text-balance text-ink transition-colors group-hover:text-brand lg:text-5xl">
                  {LEAD.title}
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-ink/50">
                  {LEAD.excerpt}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs tracking-wider text-ink/40 uppercase">
                  <span>{LEAD.author}</span>
                  <span className="text-ink/20">·</span>
                  <span>{LEAD.date}</span>
                  <span className="text-ink/20">·</span>
                  <span>{LEAD.readTime}</span>
                </div>
              </div>
            </Link>
          )}

          <div className={LEAD ? "mt-20" : ""}>
            <span className="mb-6 block text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
              {LEAD ? "More Insights" : `Insights · Page ${page}`}
            </span>
            <div className="border-t border-ink/10">
              {REST.map((post) => (
                <Link
                  key={post.id}
                  href={buildHref(post)}
                  className="group grid grid-cols-1 gap-x-6 gap-y-4 border-b border-ink/10 py-6 sm:grid-cols-12 sm:items-center"
                >
                  <div className="relative aspect-[16/10] w-40 overflow-hidden sm:col-span-3 sm:w-full">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      sizes="200px"
                      className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:col-span-8">
                    <div className="flex items-center gap-2.5 text-[11px] tracking-widest text-ink/40 uppercase">
                      <span>{post.tag}</span>
                      <span className="text-ink/20">·</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="font-instrument text-xl leading-snug font-medium text-ink transition-colors group-hover:text-brand md:text-2xl">
                      {post.title}
                    </h2>
                    <p className="line-clamp-1 text-sm leading-relaxed text-ink/45">
                      {post.excerpt}
                    </p>
                    <span className="text-[11px] tracking-wider text-ink/35 uppercase">
                      {post.author} · {post.readTime}
                    </span>
                  </div>

                  <div className="hidden items-center justify-end sm:col-span-1 sm:flex">
                    <ArrowUpRight className="h-4 w-4 -translate-x-1 text-ink/25 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>

            {TOTAL_PAGES > 1 && (
              <nav className="mt-12 flex items-center justify-between text-xs tracking-widest uppercase">
                {page > 1 ? (
                  <Link
                    href={pageHref(page - 1)}
                    className="group flex items-center gap-2 text-ink/60 transition-colors hover:text-ink"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                    Prev
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-ink/20">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Prev
                  </span>
                )}

                <div className="flex items-center gap-5">
                  {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(
                    (n) => (
                      <Link
                        key={n}
                        href={pageHref(n)}
                        aria-current={n === page ? "page" : undefined}
                        className={`tabular-nums transition-colors ${
                          n === page
                            ? "text-brand"
                            : "text-ink/40 hover:text-ink"
                        }`}
                      >
                        {String(n).padStart(2, "0")}
                      </Link>
                    ),
                  )}
                </div>

                {page < TOTAL_PAGES ? (
                  <Link
                    href={pageHref(page + 1)}
                    className="group flex items-center gap-2 text-ink/60 transition-colors hover:text-ink"
                  >
                    Next
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-ink/20">
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </nav>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
