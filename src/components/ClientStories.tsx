"use client";

import { Fragment } from "react";
import { ArrowRight, Quote } from "lucide-react";
import Reveal from "@components/Reveal";

const CLIENT_LOGS = [
  {
    id: "01",
    name: "Priya N.",
    title: "VP Engineering",
    company: "Stripe",
    domain: "stripe.com",
    quote: "We filled a platform lead role in under two weeks, with a candidate who was already screened to our exact bar.",
  },
  {
    id: "02",
    name: "Tom R.",
    title: "Head of Talent",
    company: "Notion",
    domain: "notion.so",
    quote: "The screening quality meant every interview we ran actually went somewhere. No more wasted loops.",
  },
  {
    id: "03",
    name: "Alicia F.",
    title: "COO",
    company: "Vercel",
    domain: "vercel.com",
    quote: "Bytewave handled the entire back office. We just met candidates and made decisions.",
  },
  {
    id: "04",
    name: "Derek M.",
    title: "Engineering Manager",
    company: "Figma",
    domain: "figma.com",
    quote: "Every profile that reached us was a real fit. That never happened with job boards.",
  },
  {
    id: "05",
    name: "Nina W.",
    title: "Director of Operations",
    company: "Linear",
    domain: "linear.app",
    quote: "The replacement guarantee gave us the confidence to move fast on a critical hire.",
  },
];

export default function ClientStories() {
  return (
    <section className="w-full bg-canvas px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              Client Stories
            </span>
            <h2 className="font-instrument text-4xl leading-tight font-medium text-ink lg:text-5xl">
              Teams that stopped guessing.
            </h2>
          </Reveal>

          <Reveal
            as="a"
            href="#"
            className="group flex w-fit items-center gap-2 text-xs tracking-wider text-ink/50 uppercase transition-colors hover:text-ink"
          >
            Read All Case Studies
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Reveal>
        </div>
      </div>

      <div className="marquee-fade-soft w-full overflow-hidden">
        <div className="animate-marquee-slow flex w-max gap-6 px-6 md:px-16">
          {[0, 1].map((dup) => (
            <Fragment key={dup}>
              {CLIENT_LOGS.map((client, i) => (
                <div
                  key={`${dup}-${i}`}
                  className="flex w-[300px] shrink-0 flex-col justify-between gap-6 bg-ink/[0.03] p-6 sm:w-[360px]"
                >
                  <Quote className="h-5 w-5 text-brand/60" />
                  <p className="text-sm leading-relaxed text-ink/70">
                    &ldquo;{client.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://img.logo.dev/${client.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}&size=40&format=png&theme=dark`}
                      alt={client.company}
                      className="h-6 w-6 shrink-0 object-contain opacity-80"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-ink">
                        {client.name}
                      </span>
                      <span className="text-xs text-ink/50">
                        {client.title}, {client.company}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <Reveal className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-5 px-6 text-center md:mt-20 md:px-16">
        <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          Now onboarding companies
        </span>
        <h3 className="font-instrument text-3xl font-medium text-ink sm:text-4xl md:text-5xl">
          Your next hire could be this easy.
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-ink/50 sm:text-base">
          Tell us what you're hiring for and we'll route verified specialists
          straight to your team.
        </p>
        <a
          href="#"
          className="group mt-2 flex w-full max-w-xs items-center justify-center gap-2 bg-ink/10 px-6 py-3 text-sm text-ink backdrop-blur-md transition hover:bg-ink/20 sm:w-auto"
        >
          Start Hiring
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </Reveal>
    </section>
  );
}
