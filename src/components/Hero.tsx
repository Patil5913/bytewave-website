"use client";

import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import AsciiHero, { type AsciiConfig } from "@components/AsciiHero";
import heroVariants from "@/config/heroVariants.json";

type HeroVariant = {
  label: string;
  src: string;
  rotateDeg: number;
  fit: "cover" | "contain";
  zoom: number;
  plane: boolean;
  config?: Partial<AsciiConfig>;
};

const VARIANTS = heroVariants.variants as HeroVariant[];
const ACTIVE = VARIANTS[heroVariants.active] ?? VARIANTS[0];
const ASCII_ENABLED = heroVariants.asciiEnabled !== false;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-svh w-full flex-col overflow-hidden">
      {ASCII_ENABLED ? (
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
        <>
          <img
            src={ACTIVE.src}
            alt=""
            className={`absolute inset-0 h-full w-full saturate-150 ${ACTIVE.fit === "contain" ? "object-contain" : "object-cover"}`}
            style={ACTIVE.rotateDeg ? { transform: `rotate(${ACTIVE.rotateDeg}deg) scale(${ACTIVE.zoom})` } : undefined}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
            }}
          />
        </>
      )}
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      <motion.div
        className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 pt-28 pb-8 sm:gap-6 sm:pt-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          variants={itemVariants}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {/* show message that says going to live soon or something like that */}
          Launching Soon
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="max-w-4xl text-center font-instrument text-4xl font-medium text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-8xl"
        >
          The frictionless way to hire and get hired.
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          className="max-w-2xl text-center text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-base lg:text-lg"
        >
          Skip the endless resume reviews and generic job boards. We connect
          verified candidates directly with companies actively looking for
          their exact skills.
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="mt-2 flex w-full max-w-xs flex-col items-center gap-3 text-sm sm:w-auto sm:max-w-none sm:flex-row sm:gap-4 sm:text-base"
        >
          <a
            href="/professionals"
            className="group flex w-full items-center justify-center gap-2 bg-white/10 px-4 py-2.5 text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto sm:py-1.5"
          >
            Advance Your Career
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="/companies"
            className="border-b border-white/60 pb-1 text-white transition-colors duration-300 hover:border-white/20 hover:text-white/70"
          >
            Build Your Team
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 }}
        className="relative z-10 flex w-full flex-col items-center justify-center gap-2 pb-8 sm:pb-12"
      >
        <p className="px-6 text-center text-xs font-medium text-white/70 sm:text-sm lg:text-base">
          Compatible with your existing hiring stack
        </p>
        <div className="marquee-fade w-full sm:w-3/4">
          <div className="overflow-hidden">
            <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
              {[
                { name: "Workday", slug: "workday" },
                { name: "Greenhouse", slug: "greenhouse" },
                { name: "Lever", slug: "lever" },
                { name: "Ashby", slug: "ashby" },
                { name: "Indeed", slug: "indeed" },
                { name: "Glassdoor", slug: "glassdoor" },
                { name: "BambooHR", slug: "bamboohr" },
                { name: "Paylocity", slug: "paylocity" },
                { name: "SmartRecruiters", slug: "smartrecruiters" },
                { name: "iCIMS", slug: "icims" },
                { name: "Workable", slug: "workable" },
                { name: "Paycom", slug: "paycom" },
                { name: "ZipRecruiter", slug: "ziprecruiter" },
                { name: "SuccessFactors", slug: "successfactors" },
                { name: "Personio", slug: "personio" },
              ]
                .concat([
                  { name: "Workday", slug: "workday" },
                  { name: "Greenhouse", slug: "greenhouse" },
                  { name: "Lever", slug: "lever" },
                  { name: "Ashby", slug: "ashby" },
                  { name: "Indeed", slug: "indeed" },
                  { name: "Glassdoor", slug: "glassdoor" },
                  { name: "BambooHR", slug: "bamboohr" },
                  { name: "Paylocity", slug: "paylocity" },
                  { name: "SmartRecruiters", slug: "smartrecruiters" },
                  { name: "iCIMS", slug: "icims" },
                  { name: "Workable", slug: "workable" },
                  { name: "Paycom", slug: "paycom" },
                  { name: "ZipRecruiter", slug: "ziprecruiter" },
                  { name: "SuccessFactors", slug: "successfactors" },
                  { name: "Personio", slug: "personio" },
                ])
                .map((platform, i) => (
                  <span
                    key={i}
                    className="group flex items-center gap-2.5 text-base font-medium text-white transition-colors duration-200 hover:text-white/80"
                  >
                    <span className="relative h-5 w-5">
                      <img
                        src={`https://jobspipe.dev/favicons/${platform.slug}.png`}
                        alt={platform.name}
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
      </motion.div>
    </section>
  );
}
