"use client";

import Link from "next/link";
import Reveal from "@components/Reveal";
import { ArrowRight } from "lucide-react";

const MODULES = [
  {
    id: "01",
    tag: "Resume & Portfolio",
    title: "Profile Rebuild",
    description:
      "We rework your resume and portfolio so it clears automated filters and actually gets read by the people making the hiring call.",
    price: "Custom quote",
  },
  {
    id: "02",
    tag: "Mock Interviews",
    title: "Interview Prep",
    description:
      "1-on-1 practice interviews with people who've worked the role, covering both the technical questions and the tough follow-ups.",
    price: "Priced per session",
  },
  {
    id: "03",
    tag: "IT Training",
    title: "Skills Training",
    description:
      "Hands-on training in the tools and workflows your target role actually uses, so nothing catches you off guard in the final rounds.",
    price: "Depends on stack",
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

export default function PricingReferral() {
  return (
    <section className="relative flex min-h-screen max-sm:min-h-0 w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 max-sm:px-5 max-sm:py-14 md:px-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 max-sm:gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal className="flex flex-col gap-6">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            Pricing
          </span>
          <h2 className="font-instrument max-sm:text-3xl text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-6xl">
            Free to start. Pay only for what helps.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink/50">
            Joining costs nothing and your first strategy call is free. Add-ons
            come later — only if there&apos;s a real gap between where you are
            and the offer you want.
          </p>
          <a
            href="#intake"
            className="group mt-2 flex w-fit max-sm:w-full max-sm:justify-center items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-canvas transition-colors hover:bg-ink/90"
          >
            Book your free strategy call
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
                  Career Statement
                </span>
              </div>

              <div className="flex flex-col gap-4 py-6">
                {MODULES.map((mod) => (
                  <div key={mod.id} className="flex flex-col gap-1">
                    <div className="flex items-end gap-2">
                      <span className="text-ink/80">{mod.title}</span>
                      <span className="mb-[5px] flex-1 border-b border-dotted border-ink/25" />
                      <span className="shrink-0 tabular-nums text-ink">
                        {mod.price}
                      </span>
                    </div>
                    <p className="max-w-[40ch] font-sans text-xs leading-relaxed text-ink/45">
                      {mod.description}
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
                — Join free · you keep 100% of your negotiated pay —
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

      <Reveal className="mx-auto mt-20 max-sm:mt-12 flex w-full max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center md:gap-12 max-sm:gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
            Referrals
          </span>
          <h3 className="font-instrument text-2xl leading-tight font-medium text-ink md:text-3xl">
            Know someone good? Get paid to say so.
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-ink/50">
            Refer someone strong — once they land a role through us, you get a
            cash reward. No cap.
          </p>
        </div>

        <Link
          href="/services#referral"
          className="group flex w-fit shrink-0 items-center gap-2 bg-ink/10 px-6 py-3 text-sm text-ink backdrop-blur-md transition-colors hover:bg-ink/20"
        >
          Get your referral link
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}
