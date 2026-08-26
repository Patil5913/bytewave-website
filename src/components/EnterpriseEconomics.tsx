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

const TORN_TOP: React.CSSProperties = {
  maskImage: "radial-gradient(7px at 12px 3px, transparent 96%, black 100%)",
  maskSize: "24px 100%",
  maskRepeat: "repeat-x",
  WebkitMaskImage:
    "radial-gradient(7px at 12px 3px, transparent 96%, black 100%)",
  WebkitMaskSize: "24px 100%",
  WebkitMaskRepeat: "repeat-x",
};
const TORN_BOTTOM: React.CSSProperties = {
  maskImage: "radial-gradient(7px at 12px 9px, transparent 96%, black 100%)",
  maskSize: "24px 100%",
  maskRepeat: "repeat-x",
  WebkitMaskImage:
    "radial-gradient(7px at 12px 9px, transparent 96%, black 100%)",
  WebkitMaskSize: "24px 100%",
  WebkitMaskRepeat: "repeat-x",
};

export default function EnterpriseEconomics() {
  return (
    <section className="relative flex min-h-screen max-sm:min-h-0 w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 max-sm:px-5 max-sm:py-14 md:px-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 max-sm:gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal className="flex flex-col gap-6">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            Pricing
          </span>
          <h2 className="font-instrument max-sm:text-3xl text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-6xl">
            Pay for outcomes, not applications.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink/50">
            No job board fees, no per-post charges. You pay when a verified
            specialist joins your team — and we stand behind every placement.
          </p>
          <a
            href="#intake"
            className="group mt-2 flex w-fit max-sm:w-full max-sm:justify-center items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-canvas transition-colors hover:bg-ink/90"
          >
            Book a free consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Reveal>

        <Reveal x={24} y={0}>
          <div className="ml-auto w-full max-w-md font-mono text-sm">
            <div aria-hidden className="h-3 bg-ink/[0.04]" style={TORN_TOP} />

            <div className="bg-ink/[0.04] px-7 py-6 max-sm:px-4 max-sm:py-5">
              <div className="flex items-center justify-between border-b border-dashed border-ink/20 pb-5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-base tracking-tight text-ink/70 lowercase">
                    find <span className="text-brand">&amp;</span> hire
                  </span>
                  <span className="whitespace-nowrap text-[9px] tracking-normal text-ink/35 lowercase">
                    a bytewave company
                  </span>
                </div>
                <span className="text-right text-[9px] tracking-[0.25em] text-ink/40 uppercase">
                  Hiring Statement
                </span>
              </div>

              <div className="flex flex-col gap-4 py-6">
                {TERMS.map((term) => (
                  <div key={term.id} className="flex flex-col gap-1">
                    <div className="flex items-end gap-2">
                      <span className="text-ink/80">{term.title}</span>
                      <span className="mb-[5px] flex-1 border-b border-dotted border-ink/25" />
                      <span className="shrink-0 tabular-nums text-ink">
                        {term.price}
                      </span>
                    </div>
                    <p className="max-w-[40ch] font-sans text-xs leading-relaxed text-ink/45">
                      {term.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-ink/20 pt-5">
                <span className="tracking-widest text-ink/50 uppercase">
                  Due today
                </span>
                <span className="font-instrument text-3xl font-medium text-brand tabular-nums">
                  $0.00
                </span>
              </div>

              <p className="mt-5 text-center font-sans text-[11px] leading-relaxed text-ink/40">
                — Success fee billed only once your hire starts —
              </p>
            </div>

            <div
              aria-hidden
              className="h-3 bg-ink/[0.04]"
              style={TORN_BOTTOM}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
