"use client";

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

export default function PricingReferral() {
  return (
    <section className="w-full bg-canvas px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 flex flex-col gap-4 md:max-w-2xl">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            Pricing
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-ink lg:text-5xl">
            Free to start. Pay only for what helps.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink/50">
            Joining costs nothing, and your first strategy call is free.
            Afterward, we&apos;ll point you toward specific add-ons — but
            only if there&apos;s a real gap between where you are and the
            offer you want.
          </p>
        </Reveal>

        {/* Core entry point */}
        <Reveal className="mb-10 flex flex-col justify-between gap-8 md:flex-row md:items-center md:gap-12">
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Where we start
            </span>
            <h3 className="font-instrument text-2xl font-medium text-ink md:text-3xl">
              Free strategy call
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-ink/50">
              A 1-on-1 conversation about your background, the roles and pay
              you&apos;re aiming for, and what&apos;s standing between you and
              your next offer.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex items-baseline gap-2">
              <span className="font-instrument text-3xl font-medium text-ink">
                $0.00
              </span>
              <span className="text-xs tracking-widest text-ink/40 uppercase">
                Always free
              </span>
            </div>
            <a
              href="#"
              className="group flex w-fit items-center gap-2 bg-ink/10 px-6 py-3 text-sm text-ink backdrop-blur-md transition hover:bg-ink/20"
            >
              Book your call
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>

        {/* Modular add-ons — segmented strip, matches Advocacy Protocol */}
        <Reveal
          stagger={0.08}
          className="flex flex-col gap-10 md:flex-row md:gap-12"
        >
          {MODULES.map((mod) => (
            <div
              key={mod.id}
              className="group flex-1 transition-colors duration-300"
            >
              <span className="mb-6 flex items-center gap-2 text-3xl font-medium text-ink/15 transition-colors duration-300 group-hover:text-brand/60">
                {mod.id}
                <span className="h-1.5 w-1.5 rounded-full bg-ink/15 transition-colors duration-300 group-hover:bg-brand" />
              </span>
              <span className="mb-2 block text-xs tracking-widest text-ink/40 uppercase">
                {mod.tag}
              </span>
              <h4 className="mb-3 text-base font-medium text-ink/90 transition-colors duration-300 group-hover:text-ink">
                {mod.title}
              </h4>
              <p className="mb-4 text-sm leading-relaxed text-ink/50">
                {mod.description}
              </p>
              <span className="text-xs font-medium tracking-widest text-ink/40 uppercase">
                {mod.price}
              </span>
            </div>
          ))}
        </Reveal>

        {/* Referral */}
        <Reveal className="mt-16 flex flex-col justify-between gap-8 md:flex-row md:items-center md:gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium tracking-widest text-ink/60 uppercase">
              Referrals
            </span>
            <h3 className="font-instrument text-2xl font-medium text-ink md:text-3xl">
              Know someone good? Get paid to say so.
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-ink/50">
              Most of our best candidates come through people already in our
              network. Refer someone strong, and once they land a role
              through us, you get a cash reward — no cap.
            </p>
          </div>

          <a
            href="#"
            className="group flex w-fit shrink-0 items-center gap-2 bg-ink/10 px-6 py-3 text-sm text-ink backdrop-blur-md transition hover:bg-ink/20"
          >
            Get your referral link
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
