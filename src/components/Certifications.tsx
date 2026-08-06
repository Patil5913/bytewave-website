"use client";

import { Check } from "lucide-react";
import Reveal from "@components/Reveal";

type Cert = {
  code: string;
  ref: string;
  year: string;
  label: string;
  description: string;
  logoName: string;
};

export default function Certifications({ items }: { items: Cert[] }) {
  const CERTIFICATIONS = items;
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal className="mb-14 flex max-w-2xl flex-col gap-4">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            Compliance
          </span>
          <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
            Certified where it counts.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-ink/50">
            Quality, security, and employment standards — independently audited
            and renewed every year.
          </p>
        </Reveal>

        <Reveal
          stagger={0.08}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.code}
              className="group relative flex flex-col justify-between gap-8 overflow-hidden bg-canvas p-6 transition-colors duration-300 hover:bg-ink/[0.02] lg:p-7"
            >
              <img
                src={`https://img.logo.dev/name/${cert.logoName}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}&format=png&theme=light&greyscale=true&fallback=404`}
                alt=""
                aria-hidden
                className="pointer-events-none absolute -top-8 -right-8 z-0 h-40 w-40 translate-x-4 -translate-y-4 object-contain opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-20"
              />

              <div className="relative z-10 flex items-start justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] text-ink/30 uppercase">
                  {cert.ref}
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/15 bg-canvas text-ink/40 transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-canvas">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-1.5">
                <h3 className="font-instrument text-3xl leading-none font-medium text-ink">
                  {cert.code}
                </h3>
                <span className="text-xs tracking-wider text-ink/45 uppercase">
                  {cert.label}
                </span>
              </div>

              <p className="relative z-10 text-sm leading-relaxed text-ink/50">
                {cert.description}
              </p>

              <div className="relative z-10 flex items-center justify-between border-t border-ink/10 pt-4 text-[11px] tracking-widest text-ink/35 uppercase">
                <span>Verified</span>
                <span className="tabular-nums">Since {cert.year}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
