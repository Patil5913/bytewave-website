"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@components/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "1.7k+", label: "Total Placements" },
  { value: "97.8%", label: "Success Rate" },
  { value: "600+", label: "Partner Orgs" },
];

const GROWTH_LOG = [
  { year: "2021", value: 130 },
  { year: "2022", value: 188 },
  { year: "2023", value: 234 },
  { year: "2024", value: 376 },
  { year: "2025", value: 385 },
  { year: "2026", value: 437, label: "YTD" },
];

const CHART_W = 600;
const CHART_H = 200;
const PADDING = 12;

const FLOOR = 100;
const CEILING = 450;
const Y_TICKS = [100, 200, 300, 400, 450];

function valueToY(value: number) {
  return (
    CHART_H -
    PADDING -
    ((value - FLOOR) / (CEILING - FLOOR)) * (CHART_H - PADDING * 2)
  );
}

const points = GROWTH_LOG.map((log, i) => {
  const x = (i / (GROWTH_LOG.length - 1)) * (CHART_W - PADDING * 2) + PADDING;
  const y = valueToY(log.value);
  return { x, y, ...log };
});

const linePath = points
  .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
  .join(" ");

const areaPath = `${linePath} L ${points[points.length - 1].x} ${CHART_H} L ${points[0].x} ${CHART_H} Z`;

export default function HistoricalTelemetry() {
  const chartRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = chartRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const area = el.querySelector<SVGPathElement>("[data-area]");
        const line = el.querySelector<SVGPathElement>("[data-line]");
        const dots = gsap.utils.toArray<HTMLElement>(
          el.querySelectorAll("[data-dot]"),
        );
        const st = { trigger: el, start: "top 85%", once: true } as const;
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.7,
          delay: 0.1,
          ease: "power3.out",
          scrollTrigger: st,
        });
        if (line)
          gsap.from(line, { opacity: 0, duration: 0.8, delay: 0.4, scrollTrigger: st });
        if (area)
          gsap.from(area, { opacity: 0, duration: 0.8, delay: 0.6, scrollTrigger: st });
        if (dots.length)
          gsap.from(dots, {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            delay: 0.3,
            stagger: 0.15,
            scrollTrigger: st,
          });
      });
      return () => mm.revert();
    },
    { scope: chartRef },
  );

  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 flex flex-col gap-4 md:max-w-2xl">
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
            <span className="text-white/40">[ 04 ]</span>
            Track Record
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
            Proven scale. Global reach.
          </h2>
        </Reveal>

        <Reveal className="mb-16 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="font-instrument text-2xl font-medium text-white">
                {stat.value}
              </span>
              <span className="text-xs tracking-widest text-white/40 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>

        <div ref={chartRef}>
          <span className="mb-8 block text-xs font-medium tracking-widest text-white/50 uppercase">
            Placement Volume, Year Over Year
          </span>

          <div className="relative h-52 w-full sm:h-64">
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="telemetry-fade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Blueprint: horizontal gridlines per tick */}
              {Y_TICKS.map((tick) => {
                const edge = tick === FLOOR || tick === CEILING;
                return (
                  <line
                    key={`h-${tick}`}
                    x1={0}
                    x2={CHART_W}
                    y1={valueToY(tick)}
                    y2={valueToY(tick)}
                    stroke={
                      edge ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"
                    }
                    strokeDasharray={edge ? "4 4" : undefined}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              {/* Blueprint: vertical gridline per year, edges dashed */}
              {points.map((p, i) => {
                const edge = i === 0 || i === points.length - 1;
                return (
                  <line
                    key={p.year}
                    x1={p.x}
                    x2={p.x}
                    y1={0}
                    y2={CHART_H}
                    stroke={
                      edge ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"
                    }
                    strokeDasharray={edge ? "4 4" : undefined}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              <path data-area d={areaPath} fill="url(#telemetry-fade)" />

              <path
                data-line
                d={linePath}
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Data dots (HTML overlay — stay round) */}
            {points.map((p) => (
              <span
                key={p.year}
                data-dot
                style={{
                  left: `${(p.x / CHART_W) * 100}%`,
                  top: `${(p.y / CHART_H) * 100}%`,
                }}
                className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400"
              />
            ))}
          </div>

          {/* X-axis labels */}
          <div className="relative mt-4 h-12">
            {points.map((p) => (
              <div
                key={p.year}
                style={{ left: `${(p.x / CHART_W) * 100}%` }}
                className="absolute flex -translate-x-1/2 flex-col items-center gap-1"
              >
                <span className="text-xs font-medium text-white sm:text-sm">
                  {p.value}+
                </span>
                <span className="text-[10px] text-white/40 sm:text-xs">
                  {p.year}
                  {p.label && (
                    <span className="ml-1 hidden text-white/25 sm:inline">
                      /{p.label}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
