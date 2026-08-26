"use client";

import { Fragment } from "react";
import Reveal from "@components/Reveal";
import { ArrowRight, BadgeCheck, Play } from "lucide-react";

type Video = {
  name: string;
  role: string;
  company: string;
  domain: string;
  duration: string;
  thumbnail?: string;
  row?: string;
};

function VideoRow({ items, anim }: { items: Video[]; anim: string }) {
  return (
    <div className="marquee-fade-soft w-full overflow-hidden">
      <div className={`${anim} flex w-max gap-6 px-6 max-sm:px-5 md:px-16`}>
        {[0, 1].map((dup) => (
          <Fragment key={dup}>
            {items.map((video, i) => (
              <div
                key={`${dup}-${i}`}
                className="group relative aspect-video w-[300px] shrink-0 overflow-hidden rounded-xl bg-black sm:w-[360px]"
              >
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.name}
                    className="h-full w-full object-cover opacity-75 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-0.5 h-4 w-4 fill-white text-white transition-colors group-hover:fill-brand group-hover:text-brand" />
                  </div>
                </div>

                {video.duration && (
                  <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2 py-1 font-mono text-[10px] text-white/80 tabular-nums backdrop-blur-md">
                    {video.duration}
                  </span>
                )}

                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md">
                  <BadgeCheck className="h-3.5 w-3.5 fill-brand/20 text-brand" />
                  <span className="text-[10px] tracking-widest text-white uppercase">
                    Verified
                  </span>
                </div>

                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-white">
                      {video.name}
                    </span>
                    <span className="text-xs text-white/60">{video.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://img.logo.dev/${video.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}&size=40&format=png&theme=dark`}
                      alt={video.company}
                      className="h-5 w-5 shrink-0 object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span className="text-xs font-medium text-white/70">
                      {video.company}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default function VideoTelemetry({ items }: { items: Video[] }) {
  const rowOne = items.filter((v) => v.row !== "two");
  const rowTwo = items.filter((v) => v.row === "two");
  const one = rowOne.length ? rowOne : items;
  const two = rowTwo.length ? rowTwo : items;

  return (
    <section className="relative flex min-h-screen max-sm:min-h-0 w-full flex-col justify-center overflow-hidden bg-canvas py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16">
        <div className="mb-14 max-sm:mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              Success Stories
            </span>
            <h2 className="font-instrument max-sm:text-3xl text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
              Verified execution. On record.
            </h2>
          </Reveal>

          <Reveal
            as="a"
            href="/insights"
            className="group flex w-fit items-center gap-2 text-xs tracking-wider text-ink/50 uppercase transition-colors hover:text-ink"
          >
            View Full Archive
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Reveal>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <VideoRow items={one} anim="animate-marquee-slow" />
        <VideoRow items={two} anim="animate-marquee-slow-reverse" />
      </div>
    </section>
  );
}
