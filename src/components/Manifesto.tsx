"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle2, ScanLine } from "lucide-react";
import PixelBackdrop from "@components/PixelBackdrop";
import Reveal from "@components/Reveal";

const SKILLS = [
  { name: "React", score: 92, verified: true },
  { name: "TypeScript", score: 88, verified: true },
  { name: "System Design", score: 85, verified: true },
  { name: "Node.js", score: 76, verified: true },
  { name: "GraphQL", score: 64, verified: false },
];

const OVERALL = 93;

// Friendly panel: watch a resume get read, skills verified, and scored.
// Driven by one smooth, looping GSAP timeline. Markup defaults to the final
// state, so reduced-motion / no-JS users see the completed result.
function ScanFeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll(".skill-row"),
        );
        const bars = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll(".skill-bar"),
        );
        const checks = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll(".skill-check"),
        );
        const scoreEl = root.querySelector<HTMLElement>(".score-num");
        const proxy = { val: 0 };

        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 1.4,
          defaults: { ease: "power3.out" },
        });

        tl.set(rows, { opacity: 0.2, y: 8 }, 0)
          .set(bars, { width: 0 }, 0)
          .set(checks, { scale: 0, opacity: 0 }, 0)
          .set(".progress-fill", { width: "0%" }, 0)
          .set(".status-analyzing", { opacity: 1 }, 0)
          .set(".status-complete", { opacity: 0 }, 0)
          .set(".score-block", { opacity: 0.15 }, 0)
          .add(() => {
            if (scoreEl) scoreEl.textContent = "0";
          }, 0);

        const step = 0.5;
        const scanDur = rows.length * step + 0.4;
        tl.to(
          ".progress-fill",
          { width: "100%", duration: scanDur, ease: "none" },
          0,
        );

        rows.forEach((row, i) => {
          const at = i * step;
          tl.to(row, { opacity: 1, y: 0, duration: 0.4 }, at)
            .to(
              bars[i],
              {
                width: `${SKILLS[i].score}%`,
                duration: 0.7,
                ease: "power2.out",
              },
              at,
            )
            .to(
              checks[i],
              { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
              at + 0.4,
            );
        });

        const endAt = rows.length * step + 0.2;
        tl.to(".status-analyzing", { opacity: 0, duration: 0.3 }, endAt)
          .to(".status-complete", { opacity: 1, duration: 0.3 }, endAt)
          .to(".score-block", { opacity: 1, duration: 0.5 }, endAt)
          .to(
            proxy,
            {
              val: OVERALL,
              duration: 0.9,
              ease: "power2.out",
              onUpdate: () => {
                if (scoreEl)
                  scoreEl.textContent = Math.round(proxy.val).toString();
              },
            },
            endAt,
          );
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <ScanLine className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-white">
            Reading the resume
          </span>
        </div>
        <span className="inline-grid rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium">
          <span
            className="status-analyzing col-start-1 row-start-1 text-white/50"
            style={{ opacity: 0 }}
          >
            Analyzing
          </span>
          <span className="status-complete col-start-1 row-start-1 text-emerald-400">
            Complete
          </span>
        </span>
      </div>

      {/* scan progress */}
      <div className="h-0.5 w-full bg-white/5">
        <div
          className="progress-fill h-full bg-emerald-400"
          style={{ width: "100%" }}
        />
      </div>

      <div className="flex flex-col gap-4 p-5">
        <p className="text-xs text-white/40">
          Skills we found — and confirmed against real work.
        </p>

        <div className="flex flex-col gap-3.5">
          {SKILLS.map((s) => (
            <div key={s.name} className="skill-row flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-sm text-white/80 sm:w-28">
                {s.name}
              </span>
              <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="skill-bar absolute inset-y-0 left-0 rounded-full bg-emerald-400"
                  style={{ width: `${s.score}%` }}
                />
              </span>
              <span className="w-9 shrink-0 text-right text-sm text-white/50">
                {s.score}%
              </span>
              <span className="skill-check flex w-5 shrink-0 justify-center">
                {s.verified ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="score-block mt-1 flex items-end justify-between border-t border-white/10 pt-4">
          <div>
            <div className="font-instrument text-3xl font-medium text-white">
              <span className="score-num">{OVERALL}</span>%
            </div>
            <div className="text-xs text-white/40">Overall match</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-emerald-400">
              Strong fit
            </div>
            <div className="text-xs text-white/40">Senior Frontend roles</div>
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
              <span className="text-emerald-400">[ 01 ]</span>
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
            <ScanFeed />
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
