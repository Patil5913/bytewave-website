"use client";

import { ArrowRight } from "lucide-react";
import AsciiHero, { type AsciiConfig } from "@components/AsciiHero";
import Reveal from "@components/Reveal";
import heroVariants from "@/config/heroVariants.json";
import { HOMEPAGE, PARTNERS_HERO } from "@/lib/siteContent";

type HeroVariant = {
  label: string;
  src: string;
  rotateDeg: number;
  fit: "cover" | "contain";
  zoom: number;
  plane: boolean;
  bg?: "ascii" | "image";
  config?: Partial<AsciiConfig>;
};

const VARIANTS = heroVariants.variants as HeroVariant[];
const ACTIVE = VARIANTS[heroVariants.active] ?? VARIANTS[0];
const ASCII_ENABLED = heroVariants.asciiEnabled ?? true;
// Per-variant override wins; else fall back to the global ascii toggle.
const BG_MODE = ACTIVE.bg ?? (ASCII_ENABLED ? "ascii" : "image");

type Partner = { name: string; slug: string };

export default function Hero({
  content = HOMEPAGE,
  partners = [],
}: {
  content?: typeof HOMEPAGE;
  partners?: Partner[];
}) {
  const PLATFORMS: Partner[] = partners.length ? partners : PARTNERS_HERO;
  return (
    <section className="relative flex min-h-svh w-full flex-col overflow-hidden">
      {BG_MODE === "ascii" ? (
        <AsciiHero
          key={ACTIVE.src}
          src={ACTIVE.src}
          config={ACTIVE.config}
          rotateDeg={ACTIVE.rotateDeg}
          fit={ACTIVE.fit}
          zoom={ACTIVE.zoom}
          plane={ACTIVE.plane}
          className="absolute inset-0"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ACTIVE.src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: ACTIVE.rotateDeg
              ? `rotate(${ACTIVE.rotateDeg}deg) scale(${ACTIVE.zoom})`
              : ACTIVE.zoom !== 1
                ? `scale(${ACTIVE.zoom})`
                : undefined,
          }}
        />
      )}
      <div aria-hidden className="absolute inset-0 z-[1] bg-black/50" />
      <Reveal
        scroll={false}
        stagger={0.15}
        delay={0.2}
        y={20}
        className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 pt-28 pb-8 sm:gap-6 sm:pt-32"
      >
        <span
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          {content.heroBadge}
        </span>

        <h1
          className="max-w-4xl text-center font-instrument text-4xl font-medium text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-8xl"
        >
          {content.heroHeadline}
        </h1>

        <h2
          className="max-w-2xl text-center text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-base lg:text-lg"
        >
          {content.heroSub}
        </h2>

        <div
          className="mt-2 flex w-full max-w-xs flex-col items-center gap-3 text-sm sm:w-auto sm:max-w-none sm:flex-row sm:gap-4 sm:text-base"
        >
          <a
            href={content.heroPrimaryHref}
            className="group flex w-full items-center justify-center gap-2 bg-white/10 px-4 py-2.5 text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto sm:py-1.5"
          >
            {content.heroPrimaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href={content.heroSecondaryHref}
            className="border-b border-white/60 pb-1 text-white transition-colors duration-300 hover:border-white/20 hover:text-white/70"
          >
            {content.heroSecondaryLabel}
          </a>
        </div>
      </Reveal>

      <Reveal
        scroll={false}
        delay={0.8}
        y={20}
        className="relative z-10 flex w-full flex-col items-center justify-center gap-2 pb-8 sm:pb-12"
      >
        <p className="px-6 text-center text-xs font-medium text-white/70 sm:text-sm lg:text-base">
          {content.heroMarqueeNote}
        </p>
        <div className="marquee-fade w-full sm:w-3/4">
          <div className="overflow-hidden">
            <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
              {PLATFORMS.concat(PLATFORMS).map((platform, i) => (
                  <span
                    key={i}
                    className="group flex items-center gap-2.5 text-base font-medium text-white transition-colors duration-200 hover:text-white/80"
                  >
                    <span className="relative h-5 w-5">
                      <img
                        src={`https://jobspipe.dev/favicons/${platform.slug}.png`}
                        alt={platform.name}
                        onError={(e) => {
                          e.currentTarget.parentElement?.style.setProperty(
                            "display",
                            "none",
                          );
                        }}
                        className="absolute inset-0 h-5 w-5 grayscale invert opacity-70 transition-opacity duration-200 group-hover:opacity-0"
                      />
                      <img
                        src={`https://jobspipe.dev/favicons/${platform.slug}.png`}
                        alt=""
                        className="absolute inset-0 h-5 w-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      />
                    </span>
                    {platform.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
