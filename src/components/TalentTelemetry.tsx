"use client";

import Reveal from "@components/Reveal";

const STATS = [
  { value: "12d", label: "Avg. Time-to-Hire" },
  { value: "97%", label: "1-Year Retention" },
  { value: "3.4x", label: "Fewer Bad-Fit Hires" },
  { value: "600+", label: "Roles Filled" },
];

const ROLES = [
  {
    id: "01",
    label: "Backend / Python",
    days: "11d",
    note: "Screened against production-grade system design rounds.",
  },
  {
    id: "02",
    label: "Frontend / React",
    days: "9d",
    note: "Fastest-moving category — deep bench of pre-verified candidates.",
  },
  {
    id: "03",
    label: "Platform / K8s",
    days: "14d",
    note: "Longer cycle reflects the seniority bar for infra roles.",
  },
  {
    id: "04",
    label: "Data / Analytics",
    days: "12d",
    note: "Matched on both tooling and domain context.",
  },
  {
    id: "05",
    label: "Product Design",
    days: "10d",
    note: "Portfolio-reviewed before any introduction is made.",
  },
  {
    id: "06",
    label: "Product Management",
    days: "16d",
    note: "Slower close, higher scrutiny on stakeholder track record.",
  },
];

export default function TalentTelemetry() {
  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 flex flex-col gap-4 md:max-w-2xl">
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
            <span className="text-white/40">[ 02 ]</span>
            Talent Telemetry
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
            Fill roles fast, without the guesswork.
          </h2>
        </Reveal>

        <Reveal className="mb-16 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-3">
              <span className="font-instrument text-4xl font-medium text-white sm:text-5xl">
                {stat.value}
              </span>
              <span className="text-xs tracking-widest text-white/40 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>

        <span className="mb-8 block text-xs font-medium tracking-widest text-white/50 uppercase">
          Avg. Time-to-Hire by Role
        </span>

        <Reveal
          stagger={0.06}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ROLES.map((role) => (
            <div key={role.id} className="group flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-white">
                  {role.label}
                </span>
                <span className="text-2xl font-semibold text-emerald-400 transition-colors duration-300 group-hover:text-emerald-400">
                  {role.days}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-white/40">
                {role.note}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
