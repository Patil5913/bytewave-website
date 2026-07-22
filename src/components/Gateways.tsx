"use client";

import { ArrowRight } from "lucide-react";
import PixelBackdrop from "@components/PixelBackdrop";
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
    action: "Bypass Traditional Filters",
  },
];

export default function Gateways() {
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-black px-6 py-24 md:px-16">
      <PixelBackdrop variant="scan" className="absolute inset-0 z-0" />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <span className="mb-12 flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
          <span className="text-emerald-400">[ 03 ]</span>
          Choose Your Path
        </span>

        <Reveal
          stagger={0.12}
          className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 md:grid-cols-2"
        >
          {ROUTES.map((route, i) => (
            <a
              key={route.href}
              href={route.href}
              className={`group relative flex min-h-[420px] flex-col justify-center gap-12 overflow-hidden p-12 md:min-h-[60svh] transition-colors duration-500 hover:bg-white/[0.04] md:p-16 ${
                i === 0
                  ? "border-b border-white/10 md:border-r md:border-b-0"
                  : ""
              }`}
            >
              <span className="pointer-events-none absolute -top-10 -right-4 font-instrument text-[13rem] leading-none font-medium text-white/[0.03] transition-colors duration-500 group-hover:text-white/[0.06]">
                {route.index}
              </span>

              <div className="relative flex items-start justify-between">
                <span className="text-xs tracking-widest text-white/40 uppercase">
                  Path // {route.index}
                </span>
                <span className="text-xs text-white/40 transition-colors duration-300 group-hover:text-white">
                  [ {route.tag} ]
                </span>
              </div>

              <div className="relative flex flex-col gap-6">
                <h2 className="font-instrument text-4xl leading-tight font-medium text-white transition-colors duration-300 lg:text-5xl">
                  {route.headline}
                </h2>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm tracking-wider text-white/70 uppercase transition-colors duration-300 group-hover:text-white">
                    {route.action}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </div>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
