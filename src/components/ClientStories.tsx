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
    quote:
      "We filled a platform lead role in under two weeks, with a candidate who was already screened to our exact bar.",
  },
  {
    id: "02",
    name: "Tom R.",
    title: "Head of Talent",
    company: "Notion",
    domain: "notion.so",
    quote:
      "The screening quality meant every interview we ran actually went somewhere. No more wasted loops.",
  },
  {
    id: "03",
    name: "Alicia F.",
    title: "COO",
    company: "Vercel",
    domain: "vercel.com",
    quote:
      "Bytewave handled the entire back office. We just met candidates and made decisions.",
  },
  {
    id: "04",
    name: "Derek M.",
    title: "Engineering Manager",
    company: "Figma",
    domain: "figma.com",
    quote:
      "Every profile that reached us was a real fit. That never happened with job boards.",
  },
  {
    id: "05",
    name: "Nina W.",
    title: "Director of Operations",
    company: "Linear",
    domain: "linear.app",
    quote:
      "The replacement guarantee gave us the confidence to move fast on a critical hire.",
  },
];

// distinct testimonials for the second (reverse) lane
const ROW_TWO = [
  {
    id: "06",
    name: "Marcus B.",
    title: "CTO",
    company: "Ramp",
    domain: "ramp.com",
    quote:
      "We closed three senior backend seats in a month — each one pre-vetted to a standard our own loops rarely hit.",
  },
  {
    id: "07",
    name: "Sofia L.",
    title: "Head of People",
    company: "Retool",
    domain: "retool.com",
    quote:
      "No sourcing spreadsheets, no cold outreach. Qualified people just showed up in our pipeline.",
  },
  {
    id: "08",
    name: "Jamal K.",
    title: "VP Product",
    company: "Airtable",
    domain: "airtable.com",
    quote:
      "The match precision is the real story — we interviewed four people and hired two.",
  },
  {
    id: "09",
    name: "Elena V.",
    title: "Director of Engineering",
    company: "Neon",
    domain: "neon.tech",
    quote:
      "Time-to-offer dropped from months to days. Our roadmap stopped waiting on headcount.",
  },
  {
    id: "10",
    name: "Chris D.",
    title: "Founder",
    company: "Resend",
    domain: "resend.com",
    quote:
      "As a small team, the back-office handling alone paid for itself. We just met great people.",
  },
];

type Client = (typeof CLIENT_LOGS)[number];

function MarqueeRow({ items, anim }: { items: Client[]; anim: string }) {
  return (
    <div className="marquee-fade-soft w-full overflow-hidden">
      <div className={`${anim} flex w-max gap-6 px-6 md:px-16`}>
        {[0, 1].map((dup) => (
          <Fragment key={dup}>
            {items.map((client, i) => (
              <figure
                key={`${dup}-${i}`}
                className="group flex w-[300px] shrink-0 flex-col justify-between gap-6 bg-ink/[0.03] p-6 transition-colors duration-300 hover:bg-ink/[0.05] sm:w-[360px]"
              >
                <Quote className="h-5 w-5 shrink-0 text-brand/60" />
                <blockquote className="text-sm leading-relaxed text-ink/70 transition-colors duration-300 group-hover:text-ink/90">
                  &ldquo;{client.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <img
                    src={`https://img.logo.dev/${client.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}&size=40&format=png&theme=dark`}
                    alt={client.company}
                    className="h-6 w-6 shrink-0 object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-ink">
                      {client.name}
                    </span>
                    <span className="text-xs text-ink/50">
                      {client.title}, {client.company}
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default function ClientStories() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              Client Stories
            </span>
            <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
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

      {/* testimonial marquees — opposite directions */}
      <div className="flex flex-col gap-6">
        <MarqueeRow items={CLIENT_LOGS} anim="animate-marquee-slow" />
        <MarqueeRow items={ROW_TWO} anim="animate-marquee-slow-reverse" />
      </div>
    </section>
  );
}
