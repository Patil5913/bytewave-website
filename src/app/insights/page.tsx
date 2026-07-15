import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ARTICLES = [
  {
    slug: "article-1",
    date: "October 12, 2026",
    tag: "Market Analysis",
    title: "The changing baseline for senior DevOps compensation in Q4.",
    author: "R. Fischer",
    description:
      "Compensation bands are shifting fast as demand for platform engineers outpaces supply across every major market.",
  },
  {
    slug: "article-2",
    date: "October 08, 2026",
    tag: "Operations",
    title:
      "Why traditional HR screening fails at identifying actual engineering talent.",
    author: "L. Marsh",
    description:
      "Keyword filters and resume scoring miss the signals that actually predict on-the-job performance.",
  },
  {
    slug: "article-3",
    date: "September 29, 2026",
    tag: "Infrastructure",
    title: "Structuring your data science team for early-stage scaling.",
    author: "T. Nakamura",
    description:
      "The right ratio of generalists to specialists changes at every stage of growth — here's how to plan for it.",
  },
];

export default function InsightsIndex() {
  return (
    <>
      <Navbar />
      <section className="w-full bg-black px-6 pt-32 pb-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col gap-4 md:max-w-2xl">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
              <span className="text-emerald-400">[ 05 ]</span>
              Insights
            </span>
            <h1 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
              Intelligence & Insights.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-white/50">
              Market data, hiring analysis, and field notes from inside the
              network.
            </p>
          </div>

          <div className="border-t border-white/10">
            {ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/insights/${article.slug}`}
                className="group grid grid-cols-1 gap-x-8 gap-y-3 border-b border-white/10 py-8 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-baseline"
              >
                <div className="flex items-center gap-2 text-xs tracking-widest text-white/40 uppercase md:col-span-3 md:flex-col md:items-start md:gap-2">
                  <span className="text-emerald-400">{article.date}</span>
                  <span className="text-white/50">{article.tag}</span>
                </div>

                <div className="flex flex-col gap-3 md:col-span-8">
                  <h2 className="text-xl leading-snug font-medium text-white/80 transition-colors group-hover:text-white md:text-2xl">
                    {article.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-white/40">
                    {article.description}
                  </p>
                  <span className="mt-1 text-xs tracking-wider text-white/30 uppercase">
                    {article.author}
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
