"use client";

import Reveal from "@components/Reveal";
import { ArrowRight } from "lucide-react";

const TERMS = [
  {
    id: "01",
    tag: "Standard Placement",
    title: "Success Fee",
    description:
      "A single percentage of first-year base salary, billed only once your hire starts. No retainer, no upfront cost, no fee if the role doesn't close.",
    price: "% of base salary",
  },
  {
    id: "02",
    tag: "High-Volume Hiring",
    title: "Retained Search",
    description:
      "For teams filling several seats, a flat monthly retainer covers dedicated sourcing at a discounted rate.",
    price: "Flat monthly rate",
  },
  {
    id: "03",
    tag: "Risk Coverage",
    title: "Replacement Window",
    description:
      "If a hire doesn't work out in the first 90 days, we source a replacement at no additional charge — no exceptions, no fine print.",
    price: "Included, 90 days",
  },
];

export default function EnterpriseEconomics() {
  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 flex flex-col gap-4 md:max-w-2xl">
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
            <span className="text-emerald-400">[ 07 ]</span>
            Pricing
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
            Pay for outcomes, not applications.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-white/50">
            No job board fees, no per-post charges. You pay when a verified
            specialist actually joins your team — and we stand behind every
            placement.
          </p>
        </Reveal>

        {/* Core entry point */}
        <Reveal className="mb-10 flex flex-col justify-between gap-8 md:flex-row md:items-center md:gap-12">
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Where we start
            </span>
            <h3 className="font-instrument text-2xl font-medium text-white md:text-3xl">
              Free hiring consultation
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-white/50">
              A conversation about the roles you're trying to fill, your
              timeline, and whether we're the right fit before anything is
              signed.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex items-baseline gap-2">
              <span className="font-instrument text-3xl font-medium text-white">
                $0.00
              </span>
              <span className="text-xs tracking-widest text-white/40 uppercase">
                Always free
              </span>
            </div>
            <a
              href="#"
              className="group flex w-fit items-center gap-2 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>

        {/* Fee structure — segmented strip */}
        <Reveal
          stagger={0.08}
          className="flex flex-col gap-10 md:flex-row md:gap-12"
        >
          {TERMS.map((term) => (
            <div
              key={term.id}
              className="group flex-1 transition-colors duration-300"
            >
              <span className="mb-6 flex items-center gap-2 text-3xl font-medium text-white/15 transition-colors duration-300 group-hover:text-emerald-400/60">
                {term.id}
                <span className="h-1.5 w-1.5 rounded-full bg-white/15 transition-colors duration-300 group-hover:bg-emerald-400" />
              </span>
              <span className="mb-2 block text-xs tracking-widest text-white/40 uppercase">
                {term.tag}
              </span>
              <h4 className="mb-3 text-base font-medium text-white/90 transition-colors duration-300 group-hover:text-white">
                {term.title}
              </h4>
              <p className="mb-4 text-sm leading-relaxed text-white/50">
                {term.description}
              </p>
              <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
                {term.price}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
