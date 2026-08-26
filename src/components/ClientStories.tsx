"use client";

import { Fragment } from "react";
import { ArrowRight, Quote } from "lucide-react";
import Reveal from "@components/Reveal";

type Client = {
  name: string;
  title: string;
  company: string;
  domain: string;
  quote: string;
  row?: string;
};

function MarqueeRow({ items, anim }: { items: Client[]; anim: string }) {
  return (
    <div className="marquee-fade-soft w-full overflow-hidden">
      <div className={`${anim} flex w-max gap-6 px-6 max-sm:px-5 md:px-16`}>
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

export default function ClientStories({ items }: { items: Client[] }) {
  const rowOne = items.filter((c) => c.row !== "two");
  const rowTwo = items.filter((c) => c.row === "two");
  const one = rowOne.length ? rowOne : items;
  const two = rowTwo.length ? rowTwo : items;

  return (
    <section className="relative flex min-h-screen max-sm:min-h-0 w-full flex-col justify-center overflow-hidden bg-canvas py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16">
        <div className="mb-14 max-sm:mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              Client Stories
            </span>
            <h2 className="font-instrument max-sm:text-3xl text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
              Teams that stopped guessing.
            </h2>
          </Reveal>

          <Reveal
            as="a"
            href="/insights"
            className="group flex w-fit items-center gap-2 text-xs tracking-wider text-ink/50 uppercase transition-colors hover:text-ink"
          >
            Read All Case Studies
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Reveal>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <MarqueeRow items={one} anim="animate-marquee-slow" />
        <MarqueeRow items={two} anim="animate-marquee-slow-reverse" />
      </div>
    </section>
  );
}
