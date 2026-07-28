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
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16">
        <Reveal className="flex max-w-3xl flex-col gap-5">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            The Advocacy Protocol
          </span>
          <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-6xl">
            We don&apos;t just place you. We engineer your leverage.
          </h2>
        </Reveal>

        <Reveal
          stagger={0.1}
          className="grid grid-cols-1 gap-x-16 gap-y-14 sm:grid-cols-2"
        >
          {PHASES.map((phase) => (
            <div key={phase.id} className="group flex flex-col gap-4">
              <span className="font-instrument text-5xl font-medium tabular-nums text-ink/15 transition-colors duration-300 group-hover:text-brand lg:text-7xl">
                {phase.id}
              </span>
              <h3 className="font-instrument text-2xl leading-tight font-medium text-ink lg:text-3xl">
                {phase.title}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-ink/50 lg:text-base">
                {phase.description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
