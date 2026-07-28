"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "@components/Reveal";

export default function CallToAction() {
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-32 md:px-16">
      <Reveal className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <span className="mb-8 flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-ink/45 uppercase">
          Get Started
        </span>

        <h2 className="mb-6 font-instrument text-5xl leading-[1.05] font-medium text-balance text-ink md:text-7xl">
          Hiring for <span className="text-brand">scale</span>?
          <br />
          Let&apos;s talk.
        </h2>

        <p className="mb-12 max-w-xl text-lg leading-relaxed text-ink/60">
          Whether you&apos;re scaling your workforce or advancing your career,
          connect with us to bypass the noise and find your exact match.
        </p>

        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <button className="group flex w-full items-center justify-center gap-2 bg-ink px-6 py-3 font-medium text-canvas transition-colors hover:bg-ink/90 sm:w-auto">
            Book a Strategy Call
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button className="w-full border border-ink/20 px-6 py-3 text-ink transition-colors hover:border-ink/40 hover:bg-ink/5 sm:w-auto">
            Message Our Team
          </button>
        </div>

        <span className="mt-8 flex items-center gap-2 text-xs tracking-wider text-ink/40 uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          Avg. response under 4 hours
        </span>
      </Reveal>
    </section>
  );
}
