"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "@components/Reveal";

const ROUTES = [
  {
    href: "/companies",
    index: "01",
    tag: "Companies",
    headline: (
      <>
        Build your <br /> team.
      </>
    ),
    blurb:
      "Skip the résumé pile. Meet pre-verified professionals whose skills are proven before they reach your inbox.",
    action: "Access Vetted Talent",
  },
  {
    href: "/professionals",
    index: "02",
    tag: "Professionals",
    headline: (
      <>
        Find your <br /> next role.
      </>
    ),
    blurb:
      "Get verified once and let the right companies come to you — no cover letters, no application black hole.",
    action: "Bypass Traditional Filters",
  },
];

export default function Gateways() {
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <span className="mb-12 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
          Choose Your Path
        </span>

        <Reveal
          stagger={0.12}
          className="grid grid-cols-1 overflow-hidden rounded-2xl border border-ink/10 md:grid-cols-2"
        >
          {ROUTES.map((route, i) => (
            <a
              key={route.href}
              href={route.href}
              className={`group relative flex min-h-[440px] flex-col justify-between gap-12 overflow-hidden p-10 transition-colors duration-500 hover:bg-ink/[0.03] md:min-h-[60svh] md:p-14 ${
                i === 0 ? "border-b border-ink/10 md:border-r md:border-b-0" : ""
              }`}
            >
              {/* ghost index number */}
              <span className="pointer-events-none absolute -top-8 -right-2 font-instrument text-[13rem] leading-none font-medium text-ink/[0.03] transition-all duration-500 group-hover:-translate-y-1 group-hover:text-ink/[0.06]">
                {route.index}
              </span>

              {/* top row */}
              <div className="relative flex items-center justify-between">
                <span className="text-xs tracking-widest text-ink/40 uppercase">
                  Path // {route.index}
                </span>
                <span className="rounded-full border border-ink/15 px-3 py-1 text-xs tracking-wider text-ink/50 uppercase transition-colors duration-300 group-hover:border-ink/30 group-hover:text-ink">
                  {route.tag}
                </span>
              </div>

              {/* body */}
              <div className="relative flex flex-col gap-6">
                <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-ink lg:text-6xl">
                  {route.headline}
                </h2>
                <p className="max-w-sm text-sm leading-relaxed text-ink/50">
                  {route.blurb}
                </p>
              </div>

              {/* CTA row */}
              <div className="relative flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-canvas">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
                <span className="text-sm font-medium tracking-wider text-ink/70 uppercase transition-colors duration-300 group-hover:text-ink">
                  {route.action}
                </span>
              </div>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
