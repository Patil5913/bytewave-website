"use client";

import { Fragment } from "react";
import Reveal from "@components/Reveal";
import { ArrowRight, BadgeCheck, Play } from "lucide-react";

const VIDEO_LOGS = [
  {
    id: "01",
    name: "David K.",
    role: "Backend Developer",
    company: "Stripe",
    domain: "stripe.com",
    duration: "02:45",
    thumbnail:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "02",
    name: "Sarah M.",
    role: "Cloud Engineer",
    company: "Notion",
    domain: "notion.so",
    duration: "03:12",
    thumbnail:
      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "03",
    name: "Marcus T.",
    role: "Operations Manager",
    company: "Vercel",
    domain: "vercel.com",
    duration: "01:58",
    thumbnail:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "04",
    name: "Elena R.",
    role: "Data Analyst",
    company: "Figma",
    domain: "figma.com",
    duration: "02:20",
    thumbnail:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "05",
    name: "James O.",
    role: "Frontend Developer",
    company: "Linear",
    domain: "linear.app",
    duration: "03:40",
    thumbnail:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  },
];

export default function VideoTelemetry() {
  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
              <span className="text-emerald-400">[ 05 ]</span>
              Success Stories
            </span>
            <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
              Verified execution. On record.
            </h2>
          </Reveal>

          <Reveal
            as="a"
            href="#"
            className="group flex w-fit items-center gap-2 text-xs tracking-wider text-white/50 uppercase transition-colors hover:text-white"
          >
            View Full Archive
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Reveal>
        </div>

      </div>

      <div className="marquee-fade-soft w-full overflow-hidden">
        <div className="animate-marquee-slow flex w-max gap-6 px-6 md:px-16">
          {[0, 1].map((dup) => (
            <Fragment key={dup}>
              {VIDEO_LOGS.map((video, i) => (
                <a
                  key={`${dup}-${i}`}
                  href="#"
              className="group relative aspect-video w-[300px] shrink-0 cursor-pointer overflow-hidden rounded-xl bg-black sm:w-[360px]"
            >
              <img
                src={video.thumbnail}
                alt={video.name}
                className="h-full w-full object-cover opacity-75 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
              />

              {/* Gradient scrim for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-0.5 h-4 w-4 fill-white text-white transition-colors group-hover:fill-emerald-400 group-hover:text-emerald-400" />
                </div>
              </div>

              {/* Verified badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md">
                <BadgeCheck className="h-3.5 w-3.5 fill-emerald-400/20 text-emerald-400" />
                <span className="text-[10px] tracking-widest text-white uppercase">
                  Verified
                </span>
              </div>

              {/* Metadata overlay */}
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
                </a>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <Reveal className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-5 px-6 text-center md:mt-20 md:px-16">
        <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Now onboarding
        </span>
        <h3 className="font-instrument text-3xl font-medium text-white sm:text-4xl md:text-5xl">
          Your placement is the next one on record.
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
          Get verified once. Skip the applications, and let the right companies
          come to you.
        </p>
        <a
          href="#"
          className="group mt-2 flex w-full max-w-xs items-center justify-center gap-2 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto"
        >
          Apply for Verification
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </Reveal>
    </section>
  );
}
