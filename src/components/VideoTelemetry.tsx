"use client";

import { Fragment } from "react";
import Reveal from "@components/Reveal";
import { ArrowRight, BadgeCheck, Play } from "lucide-react";

type Video = {
  id: string;
  name: string;
  role: string;
  company: string;
  domain: string;
  duration: string;
  thumbnail: string;
};

const VIDEO_LOGS: Video[] = [
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

const ROW_TWO: Video[] = [
  {
    id: "06",
    name: "Priya S.",
    role: "Platform Engineer",
    company: "Ramp",
    domain: "ramp.com",
    duration: "02:08",
    thumbnail:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "07",
    name: "Leo B.",
    role: "Product Designer",
    company: "Retool",
    domain: "retool.com",
    duration: "03:05",
    thumbnail:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "08",
    name: "Amara D.",
    role: "ML Engineer",
    company: "Airtable",
    domain: "airtable.com",
    duration: "02:52",
    thumbnail:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "09",
    name: "Nikolai V.",
    role: "Database Engineer",
    company: "Neon",
    domain: "neon.tech",
    duration: "01:47",
    thumbnail:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "10",
    name: "Grace L.",
    role: "Fullstack Engineer",
    company: "Resend",
    domain: "resend.com",
    duration: "03:24",
    thumbnail:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
  },
];

function VideoRow({ items, anim }: { items: Video[]; anim: string }) {
  return (
    <div className="marquee-fade-soft w-full overflow-hidden">
      <div className={`${anim} flex w-max gap-6 px-6 md:px-16`}>
        {[0, 1].map((dup) => (
          <Fragment key={dup}>
            {items.map((video, i) => (
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
                    <Play className="ml-0.5 h-4 w-4 fill-white text-white transition-colors group-hover:fill-brand group-hover:text-brand" />
                  </div>
                </div>

                {/* Verified badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md">
                  <BadgeCheck className="h-3.5 w-3.5 fill-brand/20 text-brand" />
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
  );
}

export default function VideoTelemetry() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              Success Stories
            </span>
            <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
              Verified execution. On record.
            </h2>
          </Reveal>

          <Reveal
            as="a"
            href="#"
            className="group flex w-fit items-center gap-2 text-xs tracking-wider text-ink/50 uppercase transition-colors hover:text-ink"
          >
            View Full Archive
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Reveal>
        </div>
      </div>

      {/* video marquees — opposite directions */}
      <div className="flex flex-col gap-6">
        <VideoRow items={VIDEO_LOGS} anim="animate-marquee-slow" />
        <VideoRow items={ROW_TWO} anim="animate-marquee-slow-reverse" />
      </div>
    </section>
  );
}
