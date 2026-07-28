"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ALL_POSTS, buildHref } from "@/lib/insights";
import Reveal from "@components/Reveal";

const ARTICLES = ALL_POSTS.slice(0, 4);
const [LEAD, ...REST] = ARTICLES;

export default function Insights() {
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <Reveal className="mb-14 flex items-end justify-between">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
              Insights
            </span>
            <h2 className="font-instrument text-4xl font-medium text-ink md:text-5xl">
              Intelligence &amp; Insights.
            </h2>
          </div>
          <a
            href="/insights"
            className="group hidden items-center gap-2 text-xs tracking-wider text-ink/50 uppercase transition-colors hover:text-ink sm:flex"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
          {/* lead story */}
          {LEAD && (
            <Reveal className="lg:col-span-7">
              <a
                href={buildHref(LEAD)}
                className="group flex h-full flex-col gap-6 border-t-2 border-ink pt-8"
              >
                <div className="flex items-center gap-3 text-xs tracking-widest text-ink/40 uppercase">
                  <span className="text-brand">Featured</span>
                  <span className="text-ink/20">/</span>
                  <span>{LEAD.tag}</span>
                </div>

                <h3 className="font-instrument text-3xl leading-[1.1] font-medium text-balance text-ink transition-colors group-hover:text-brand md:text-5xl">
                  {LEAD.title}
                </h3>

                <p className="max-w-xl text-base leading-relaxed text-ink/50">
                  {LEAD.excerpt}
                </p>

                <div className="mt-auto flex items-center gap-3 pt-4 text-xs tracking-wider text-ink/40 uppercase">
                  <span className="text-ink/60">{LEAD.author}</span>
                  <span className="text-ink/20">·</span>
                  <span>{LEAD.date}</span>
                  <span className="text-ink/20">·</span>
                  <span>{LEAD.readTime}</span>
                  <ArrowUpRight className="ml-1 h-4 w-4 text-ink/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                </div>
              </a>
            </Reveal>
          )}

          {/* secondary list */}
          <Reveal stagger={0.1} className="flex flex-col border-t border-ink/10 lg:col-span-5">
            {REST.map((article, i) => (
              <a
                key={article.id}
                href={buildHref(article)}
                className="group flex items-start gap-5 border-b border-ink/10 py-6"
              >
                <span className="font-instrument text-lg leading-none text-ink/25 tabular-nums transition-colors group-hover:text-brand">
                  0{i + 2}
                </span>
                <div className="flex flex-1 flex-col gap-2">
                  <h4 className="leading-snug font-medium text-ink/70 transition-colors group-hover:text-brand">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2.5 text-[11px] tracking-wider text-ink/45 uppercase">
                    <span>{article.tag}</span>
                    <span className="text-ink/20">·</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 -translate-x-1 text-ink/30 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
