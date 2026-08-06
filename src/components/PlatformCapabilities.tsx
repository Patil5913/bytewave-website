"use client";

import Reveal from "@components/Reveal";

type Capability = {
  id: string;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
};

const CAPABILITIES: Capability[] = [
  {
    id: "01",
    title: "SLA & Risk Mitigation",
    metric: "90d",
    metricLabel: "Replacement window",
    description:
      "Every placement is backed by a replacement guarantee. If a hire doesn't work out within the window, we source a replacement at no additional cost.",
  },
  {
    id: "02",
    title: "Permanent Infrastructure Only",
    metric: "100%",
    metricLabel: "Full-time seats",
    description:
      "We don't run contract or temp desks. Every specialist we route is evaluated and matched for a long-term, full-time seat on your team.",
  },
  {
    id: "03",
    title: "Accelerated Routing",
    metric: "0",
    metricLabel: "First-round filtering",
    description:
      "Verified profiles are pre-screened before they ever reach you, so your team spends time on final decisions, not first-round filtering.",
  },
  {
    id: "04",
    title: "Back-Office Handled",
    metric: "Done",
    metricLabel: "Before intro",
    description:
      "Background checks, reference verification, and compliance documentation are handled before an introduction is ever made.",
  },
];

export default function PlatformCapabilities() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="flex flex-col gap-6 lg:col-span-4 lg:sticky lg:top-32">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            Platform Capabilities
          </span>
          <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
            Hiring infrastructure, not a job board.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink/50">
            Every guarantee, screen, and compliance step runs before a single
            introduction lands in your inbox — so your team only touches the
            final decision.
          </p>
          <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.02] px-3 py-1.5 text-xs tracking-wider text-ink/50 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            SOC 2 · fully managed
          </span>
        </Reveal>

        <Reveal stagger={0.08} className="border-t border-ink/10 lg:col-span-8">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.id}
              className="group grid grid-cols-1 gap-x-6 gap-y-4 border-b border-ink/10 py-8 md:grid-cols-12 md:items-start"
            >
              <div className="flex items-baseline gap-4 md:col-span-5">
                <span className="font-instrument text-lg tabular-nums text-ink/25 transition-colors duration-500 group-hover:text-ink/50">
                  {cap.id}
                </span>
                <h3 className="font-instrument text-xl leading-tight font-medium text-ink lg:text-2xl">
                  {cap.title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-ink/50 md:col-span-4">
                {cap.description}
              </p>

              <div className="flex items-baseline justify-between gap-2 md:col-span-3 md:flex-col md:items-end md:justify-start md:text-right">
                <span className="font-instrument text-2xl font-medium text-ink tabular-nums">
                  {cap.metric}
                </span>
                <span className="text-[11px] tracking-wider text-ink/40 uppercase">
                  {cap.metricLabel}
                </span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
