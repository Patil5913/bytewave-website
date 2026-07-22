"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BadgeCheck, Check, MapPin } from "lucide-react";
import PixelBackdrop from "@components/PixelBackdrop";
import Reveal from "@components/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SKILLS = [
  { name: "React", verified: true },
  { name: "TypeScript", verified: true },
  { name: "System Design", verified: true },
  { name: "Node.js", verified: true },
  { name: "GraphQL", verified: false },
];

const OVERALL = 93;

// A real product screen — a candidate match card the way a hiring team sees it.
// Reveals + score count-up once on scroll (GSAP). Markup defaults to the final
// state for reduced-motion / no-JS.
function CandidateCard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scoreEl = root.querySelector<HTMLElement>(".score-num");
        const proxy = { val: 0 };

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
          defaults: { ease: "power3.out" },
        });

        if (scoreEl) scoreEl.textContent = "0";
        tl.from(".rise", { opacity: 0, y: 14, duration: 0.5, stagger: 0.07 });
        tl.from(
          ".chip",
          { opacity: 0, scale: 0.85, duration: 0.35, stagger: 0.05 },
          "-=0.3",
        );
        tl.to(
          proxy,
          {
            val: OVERALL,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
              if (scoreEl) scoreEl.textContent = Math.round(proxy.val).toString();
            },
          },
          0.1,
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 shadow-2xl shadow-black/60 backdrop-blur-sm"
    >
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50">
        {/* window title bar */}
        <div className="relative flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 font-mono text-xs tracking-wider text-white/40">
            find &amp; hire — candidate
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Available
          </span>
        </div>

        <div className="flex flex-col gap-5 p-5">
          {/* candidate header */}
          <div className="rise flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15 font-medium text-emerald-400">
                  JR
                </div>
                <BadgeCheck className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-black text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-white">Jordan Rivera</span>
                <span className="text-sm text-white/50">
                  Senior Frontend Engineer
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
                  <MapPin className="h-3 w-3" />
                  Remote · San Francisco
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-instrument text-3xl leading-none font-medium text-emerald-400">
                <span className="score-num">{OVERALL}</span>%
              </div>
              <div className="mt-1 text-xs text-white/40">match</div>
            </div>
          </div>

          {/* verified skills */}
          <div className="rise flex flex-col gap-2">
            <span className="text-xs tracking-wider text-white/40 uppercase">
              Verified skills
            </span>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <span
                  key={s.name}
                  className={`chip flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                    s.verified
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                      : "border-white/10 text-white/50"
                  }`}
                >
                  {s.verified && <Check className="h-3 w-3" />}
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          {/* quick facts */}
          <div className="rise grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
            {[
              { k: "Experience", v: "8 yrs" },
              { k: "Notice", v: "2 weeks" },
              { k: "Target", v: "$180k" },
            ].map((f) => (
              <div key={f.k} className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white">{f.v}</span>
                <span className="text-xs text-white/40">{f.k}</span>
              </div>
            ))}
          </div>

          {/* actions */}
          <div className="rise flex items-center gap-3">
            <button className="group flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90">
              Request intro
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button className="rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white transition hover:bg-white/5">
              View profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Manifesto() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden border-t border-white/10 bg-black px-6 py-24 md:px-16">
      <PixelBackdrop variant="grid" className="absolute inset-0 z-0" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="flex flex-col gap-6 md:col-span-6">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
              <span className="text-white/40">[ 01 ]</span>
              Why We Exist
            </span>
            <h2 className="font-instrument text-4xl leading-tight font-medium text-balance text-white lg:text-5xl xl:text-6xl">
              The traditional hiring loop is broken. We built a better
              mechanism.
            </h2>
            <p className="max-w-prose text-base leading-relaxed text-white/60 md:text-lg">
              Most staffing agencies rely on keyword matching and endless
              resume piles, frustrating companies and candidates alike. We see
              hiring as a matching problem — connecting real needs directly
              with a network of verified professionals, cutting out the noise.
            </p>
          </Reveal>

          <Reveal className="md:col-span-6">
            <CandidateCard />
          </Reveal>
        </div>

        <Reveal className="grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-2 md:gap-16">
          <div>
            <h4 className="mb-2 text-sm font-medium tracking-wider text-white uppercase">
              01. No Guesswork
            </h4>
            <p className="text-sm leading-snug text-white/50">
              Every match is backed by verified skills, not a keyword-stuffed
              resume.
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium tracking-wider text-white uppercase">
              02. Straight to the Point
            </h4>
            <p className="text-sm leading-snug text-white/50">
              Skip the application black hole and talk directly to the people
              making the hire.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
