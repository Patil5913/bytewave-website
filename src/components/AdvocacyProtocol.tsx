"use client";

import Reveal from "@components/Reveal";

const PHASES = [
  {
    id: "01",
    title: "Ingestion & Strategy Mapping",
    description:
      "A deep-dive strategy call. We analyze your trajectory, comp goals, and the culture you thrive in.",
  },
  {
    id: "02",
    title: "Asset Architecture",
    description:
      "Your resume is rebuilt to pass technical screeners and executive reviews alike.",
  },
  {
    id: "03",
    title: "Precision Routing",
    description:
      "We bypass job boards entirely. Your profile is routed straight to decision-makers.",
  },
  {
    id: "04",
    title: "Interview Prep & Negotiation",
    description:
      "Briefed before every interview. When an offer lands, we negotiate your ceiling.",
  },
];

export default function AdvocacyProtocol() {
  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 flex flex-col gap-4 md:max-w-2xl">
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
            <span className="text-emerald-400">[ 03 ]</span>
            The Advocacy Protocol
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
            We don&apos;t just place you. We engineer your leverage.
          </h2>
        </Reveal>

        <Reveal stagger={0.1} className="flex flex-col gap-10 md:flex-row md:gap-12">
          {PHASES.map((phase) => (
            <div
              key={phase.id}
              className="group flex-1 transition-colors duration-300"
            >
              <span className="mb-6 flex items-center gap-2 text-3xl font-medium text-white/15 transition-colors duration-300 group-hover:text-emerald-400/60">
                {phase.id}
                <span className="h-1.5 w-1.5 rounded-full bg-white/15 transition-colors duration-300 group-hover:bg-emerald-400" />
              </span>
              <h3 className="mb-3 text-base font-medium text-white/90 transition-colors duration-300 group-hover:text-white">
                {phase.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                {phase.description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
