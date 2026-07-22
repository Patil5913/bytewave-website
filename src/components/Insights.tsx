"use client";

import { ArrowRight } from "lucide-react";
import { ALL_POSTS, buildHref } from "@/lib/insights";
import PixelBackdrop from "@components/PixelBackdrop";
import Reveal from "@components/Reveal";

const ARTICLES = ALL_POSTS.slice(0, 3);

export default function Insights() {
  return (
    <section className="relative w-full overflow-hidden bg-black px-6 py-24 md:px-16">
      <PixelBackdrop variant="grid" className="absolute inset-0 z-0" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal className="mb-12 flex items-end justify-between">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
              <span className="text-white/40">[ 05 ]</span>
              Insights
            </span>
            <h2 className="font-instrument text-4xl font-medium text-white md:text-5xl">
              Intelligence & Insights.
            </h2>
          </div>
          <a
            href="/insights"
            className="group flex items-center gap-2 text-xs tracking-wider text-white/50 uppercase transition-colors hover:text-white"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Reveal>

        <Reveal stagger={0.1} className="border-t border-white/10">
          {ARTICLES.map((article) => (
            <a
              key={article.id}
              href={buildHref(article)}
              className="group grid grid-cols-1 gap-x-8 gap-y-3 border-b border-white/10 py-8 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-baseline"
            >
              <div className="flex items-center gap-2 text-xs tracking-widest text-white/40 uppercase md:col-span-3 md:flex-col md:items-start md:gap-2">
                <span className="text-emerald-400">{article.date}</span>
                <span className="text-white/50">{article.tag}</span>
              </div>

              <div className="flex flex-col gap-3 md:col-span-8">
                <h3 className="text-xl leading-snug font-medium text-white/80 transition-colors group-hover:text-white md:text-2xl">
                  {article.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {article.excerpt}
                </p>
                <span className="mt-1 text-xs tracking-wider text-white/30 uppercase">
                  {article.author}
                </span>
              </div>

              <div className="hidden items-center justify-end md:col-span-1 md:flex">
                <ArrowRight className="h-4 w-4 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-400" />
              </div>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
