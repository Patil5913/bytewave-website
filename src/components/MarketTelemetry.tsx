"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@components/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FLOOR = 80;
const CEILING = 220;
const TICKS = [80, 115, 150, 185, 220];

const STACKS = [
  { label: "Backend / Python", min: 120, max: 175 },
  { label: "Frontend / React", min: 110, max: 165 },
  { label: "Platform / K8s", min: 140, max: 200 },
  { label: "Data / Analytics", min: 95, max: 145 },
  { label: "Product Design", min: 105, max: 155 },
  { label: "Product Management", min: 130, max: 190 },
  { label: "Supply Chain Ops", min: 90, max: 140 },
  { label: "Finance / FP&A", min: 100, max: 160 },
];

function toPercent(value: number) {
  return ((value - FLOOR) / (CEILING - FLOOR)) * 100;
}

export default function MarketTelemetry() {
  const [active, setActive] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = chartRef.current;
      if (!el) return;
      const wipes = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll("[data-bar-wipe]"),
      );
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          wipes,
          { scaleX: 1 },
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.09,
            delay: 0.15,
            scrollTrigger: { trigger: el, start: "top 40%", once: true },
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(wipes, { scaleX: 0 });
      });
      return () => mm.revert();
    },
    { scope: chartRef },
  );

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
        <Reveal className="flex flex-col gap-4 md:max-w-3xl">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            Market Telemetry
          </span>
          <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
            We show you the real range, not a guess.
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-ink/50">
            Every compensation band below is pulled from live placements
            across our network. Transparency here means leverage — walk into
            every conversation knowing exactly where you stand.
          </p>
          <p className="mt-2 text-xs font-medium tracking-widest text-ink/40 uppercase">
            USD base / year · trailing 90 days
          </p>
        </Reveal>

        <Reveal delay={0.15} className="w-full">
          <div ref={chartRef} className="flex gap-4 sm:gap-6">
            {/* Row labels */}
            <div className="flex w-28 shrink-0 flex-col gap-3 sm:w-36 lg:w-44">
              {STACKS.map((stack, i) => (
                <div
                  key={stack.label}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="flex h-9 items-center"
                >
                  <span
                    className={`truncate text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors lg:text-sm xl:text-[11px] ${
                      active === i ? "text-ink" : "text-ink/60"
                    }`}
                  >
                    {stack.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="relative flex-1">
              {/* Vertical gridlines + tick labels */}
              {TICKS.map((tick) => {
                const pos = toPercent(tick);
                const edge = tick === FLOOR || tick === CEILING;
                return (
                  <div
                    key={tick}
                    className="pointer-events-none absolute top-0 bottom-6 flex flex-col"
                    style={{ left: `${pos}%` }}
                  >
                    <div
                      className={`h-full border-l ${
                        edge
                          ? "border-dashed border-ink/20"
                          : "border-ink/6"
                      }`}
                    />
                  </div>
                );
              })}

              {/* Bars */}
              <div className="flex flex-col gap-3">
                {STACKS.map((stack, i) => {
                  const left = toPercent(stack.min);
                  const width = toPercent(stack.max) - left;
                  const isActive = active === i;

                  return (
                    <div
                      key={stack.label}
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                      className="relative h-9"
                    >
                      <div className="absolute inset-x-0 top-1/2 border-t border-ink/6" />
                      <div
                        style={{ left: `${left}%`, width: `${width}%` }}
                        className={`absolute inset-y-0 flex items-center justify-between overflow-hidden border-l-2 bg-linear-to-r px-2.5 backdrop-blur-md transition-all duration-300 ${
                          isActive
                            ? "border-brand/60 from-brand/70 via-amber-300/55 to-rose-300/60"
                            : "border-brand/30 from-brand/12 via-amber-300/10 to-rose-300/[0.07] hover:from-brand/25 hover:via-amber-300/18 hover:to-rose-300/12"
                        }`}
                      >
                        <span
                          className={`text-[10px] tracking-wide whitespace-nowrap transition-colors ${
                            isActive ? "text-ink" : "text-ink/60"
                          }`}
                        >
                          ${stack.min}k
                        </span>
                        <span
                          className={`text-[10px] font-medium tracking-wide whitespace-nowrap transition-colors ${
                            isActive ? "text-ink" : "text-ink/80"
                          }`}
                        >
                          ${stack.max}k
                        </span>
                        <div
                          data-bar-wipe
                          className="absolute inset-0 origin-right bg-canvas"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Axis tick labels */}
              <div className="relative mt-2 h-4">
                {TICKS.map((tick) => (
                  <span
                    key={tick}
                    className="absolute -translate-x-1/2 text-[10px] tracking-wide text-ink/30"
                    style={{ left: `${toPercent(tick)}%` }}
                  >
                    ${tick}k
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
