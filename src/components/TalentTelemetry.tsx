"use client";

import { BadgeCheck, Search } from "lucide-react";
import Reveal from "@components/Reveal";

const STATS = [
  { value: "12d", label: "Avg. Time-to-Hire" },
  { value: "97%", label: "1-Year Retention" },
  { value: "3.4x", label: "Fewer Bad-Fit Hires" },
  { value: "600+", label: "Roles Filled" },
];

// candidates surfaced for one open requisition
const SHORTLIST = [
  { who: "M. Davis", tag: "Backend · Python", match: 96, top: true },
  { who: "A. Chen", tag: "Backend · Go", match: 92, top: false },
  { who: "J. Okafor", tag: "Platform · K8s", match: 90, top: false },
  { who: "R. Foster", tag: "Backend · Node", match: 87, top: false },
];

function ShortlistWindow() {
  return (
    <div className="w-full rounded-2xl border border-ink/10 bg-ink/[0.04] p-1.5 backdrop-blur-sm">
      <div className="overflow-hidden rounded-xl border border-ink/10 bg-canvas/50">
        {/* window title bar */}
        <div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-ink/[0.02] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink/40">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            shortlist · ready
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5">
          {/* requisition header */}
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs tracking-wider text-ink/40 uppercase">
                Open Requisition
              </span>
              <span className="font-instrument text-xl font-medium text-ink">
                Senior Backend Engineer
              </span>
            </div>
            <span className="shrink-0 rounded-full border border-ink/10 bg-ink/[0.03] px-2.5 py-1 text-[11px] tracking-wider text-ink/50 uppercase">
              4 verified
            </span>
          </div>

          {/* search / match bar (decorative) */}
          <div className="flex items-center gap-2.5 rounded-lg border border-ink/10 bg-ink/[0.02] px-3 py-2.5 text-sm text-ink/40">
            <Search className="h-4 w-4 shrink-0" />
            Python · FastAPI · 5+ yrs · remote
          </div>

          {/* candidate shortlist */}
          <div className="flex flex-col divide-y divide-ink/5 rounded-lg border border-ink/10">
            {SHORTLIST.map((c) => (
              <div
                key={c.who}
                className="flex items-center justify-between gap-3 px-3 py-3"
              >
                <div className="flex items-center gap-2.5">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-brand" />
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 text-sm text-ink/90">
                      {c.who}
                      {c.top && (
                        <span className="rounded-full bg-brand/15 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-brand uppercase">
                          Top match
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-ink/40">{c.tag}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="hidden h-1 w-16 overflow-hidden rounded-full bg-ink/10 sm:block">
                    <div
                      className="h-full rounded-full bg-brand/70"
                      style={{ width: `${c.match}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-brand tabular-nums">
                    {c.match}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TalentTelemetry() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
        {/* left — heading + stats */}
        <div className="flex flex-col gap-10 md:col-span-6">
          <div className="flex flex-col gap-6">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              Talent Telemetry
            </span>
            <h2 className="font-instrument text-4xl leading-tight font-medium text-balance text-ink lg:text-5xl xl:text-6xl">
              A shortlist, not a search.
            </h2>
            <p className="max-w-prose text-base leading-relaxed text-ink/60 md:text-lg">
              Post a role and get back a handful of pre-verified people matched
              to your exact stack and seniority — not a thousand résumés to sift
              through.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-ink/10 pt-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <span className="font-instrument text-4xl font-medium text-ink tabular-nums lg:text-5xl">
                  {stat.value}
                </span>
                <span className="text-xs font-medium tracking-wider text-ink/50 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* right — shortlist window */}
        <Reveal x={24} y={0} className="md:col-span-6">
          <ShortlistWindow />
        </Reveal>
      </div>
    </section>
  );
}
