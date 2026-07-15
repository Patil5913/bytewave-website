"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const ARTICLES = [
  {
    href: "/insights/article-1",
    date: "October 12, 2026",
    tag: "Market Analysis",
    title: "The changing baseline for senior DevOps compensation in Q4.",
    author: "R. Fischer",
    description:
      "Compensation bands are shifting fast as demand for platform engineers outpaces supply across every major market.",
  },
  {
    href: "/insights/article-2",
    date: "October 08, 2026",
    tag: "Operations",
    title:
      "Why traditional HR screening fails at identifying actual engineering talent.",
    author: "L. Marsh",
    description:
      "Keyword filters and resume scoring miss the signals that actually predict on-the-job performance.",
  },
  {
    href: "/insights/article-3",
    date: "September 29, 2026",
    tag: "Infrastructure",
    title: "Structuring your data science team for early-stage scaling.",
    author: "T. Nakamura",
    description:
      "The right ratio of generalists to specialists changes at every stage of growth — here's how to plan for it.",
  },
];

export default function Insights() {
  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="mb-12 flex items-end justify-between"
        >
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
              <span className="text-emerald-400">[ 05 ]</span>
              Insights
            </span>
            <h2 className="font-instrument text-3xl font-medium text-white md:text-4xl">
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
        </motion.div>

        <div className="flex flex-col gap-10">
          {ARTICLES.map((article, i) => (
            <motion.a
              key={article.href}
              href={article.href}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="group -mx-4 flex flex-col gap-3 rounded-lg px-4 py-4 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex items-center justify-between text-xs tracking-widest text-white/40 uppercase">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">{article.date}</span>
                  <span className="text-white/20">/</span>
                  {article.tag}
                </span>
                <span className="normal-case">{article.author}</span>
              </div>

              <h3 className="text-2xl leading-snug font-medium text-white/80 transition-colors group-hover:text-white md:text-3xl">
                {article.title}
              </h3>

              <p className="truncate text-sm leading-relaxed text-white/40">
                {article.description}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
