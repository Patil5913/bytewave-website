"use client";

import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@components/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Stat = { value: string; label: string };
type GrowthPoint = { year: string; value: number; label?: string | null };

const CHART_W = 600;
const CHART_H = 200;
const PADDING = 12;

const TENSION = 0.07;

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return pts.length ? `M ${pts[0].x} ${pts[0].y}` : "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) * TENSION;
    const cp1y = p1.y + (p2.y - p0.y) * TENSION;
    const cp2x = p2.x - (p3.x - p1.x) * TENSION;
    const cp2y = p2.y - (p3.y - p1.y) * TENSION;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function HistoricalTelemetry({
  stats,
  growth,
}: {
  stats: Stat[];
  growth: GrowthPoint[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  const { points, linePath, yTicks, valueToY } = useMemo(() => {
    const values = growth.map((g) => g.value);
    const rawMin = values.length ? Math.min(...values) : 0;
    const rawMax = values.length ? Math.max(...values) : 1;
    const span = rawMax - rawMin || rawMax || 1;
    const floor = Math.max(0, Math.floor((rawMin - span * 0.15) / 50) * 50);
    const ceiling = Math.ceil((rawMax + span * 0.1) / 50) * 50 || 50;

    const toY = (value: number) =>
      CHART_H -
      PADDING -
      ((value - floor) / (ceiling - floor || 1)) * (CHART_H - PADDING * 2);

    const pts = growth.map((g, i) => {
      const x =
        (i / Math.max(1, growth.length - 1)) * (CHART_W - PADDING * 2) +
        PADDING;
      return { x, y: toY(g.value), ...g };
    });

    const ticks = Array.from({ length: 5 }, (_, i) =>
      Math.round(floor + ((ceiling - floor) * i) / 4),
    );

    return {
      points: pts,
      linePath: smoothPath(pts),
      yTicks: ticks,
      valueToY: toY,
    };
  }, [growth]);

  useGSAP(
    () => {
      const el = chartRef.current;
      if (!el) return;
      const line = el.querySelector<SVGPathElement>("[data-line]");
      const counts = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll("[data-count]"),
      );

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });

        if (line) {
          const reveal = (p: number) => {
            line.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
          };
          reveal(0);
          const obj = { p: 0 };
          tl.to(obj, { p: 1, duration: 1.3, onUpdate: () => reveal(obj.p) }, 0);
        }

        counts.forEach((node) => {
          const end = Number(node.dataset.count ?? "0");
          const obj = { v: 0 };
          tl.to(
            obj,
            {
              v: end,
              duration: 1.3,
              ease: "power1.out",
              onUpdate: () => {
                node.textContent = `${Math.round(obj.v)}+`;
              },
            },
            0,
          );
        });

        return () => tl.kill();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (line) line.style.clipPath = "inset(0 0% 0 0)";
        counts.forEach((node) => {
          node.textContent = `${node.dataset.count ?? "0"}+`;
        });
      });

      return () => mm.revert();
    },
    { scope: chartRef, dependencies: [linePath] },
  );

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:min-h-[78vh]">
        <Reveal className="mb-14 flex max-w-2xl flex-col gap-4">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            Track Record
          </span>
          <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink lg:text-5xl">
            Proven scale. Global reach.
          </h2>
        </Reveal>

        <Reveal className="mb-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="font-instrument text-2xl font-medium text-ink">
                {stat.value}
              </span>
              <span className="text-xs tracking-widest text-ink/40 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>

        <div ref={chartRef} className="flex flex-1 flex-col">
          <span className="mb-8 block text-sm font-medium tracking-widest text-ink/60 uppercase">
            Placement Volume, Year Over Year
          </span>

          <div className="relative min-h-[220px] w-full flex-1">
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="telemetryLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-brand)" />
                  <stop offset="55%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#fda4af" />
                </linearGradient>
              </defs>

              {yTicks.map((tick, i) => {
                const edge = i === 0 || i === yTicks.length - 1;
                return (
                  <line
                    key={`h-${tick}-${i}`}
                    x1={0}
                    x2={CHART_W}
                    y1={valueToY(tick)}
                    y2={valueToY(tick)}
                    stroke={edge ? "rgba(10,10,10,0.2)" : "rgba(10,10,10,0.06)"}
                    strokeDasharray={edge ? "4 4" : undefined}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              {points.map((p, i) => {
                const edge = i === 0 || i === points.length - 1;
                return (
                  <line
                    key={p.year}
                    x1={p.x}
                    x2={p.x}
                    y1={0}
                    y2={CHART_H}
                    stroke={edge ? "rgba(10,10,10,0.2)" : "rgba(10,10,10,0.06)"}
                    strokeDasharray={edge ? "4 4" : undefined}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              <path
                data-line
                d={linePath}
                fill="none"
                stroke="url(#telemetryLine)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="relative mt-4 h-12">
            {points.map((p) => (
              <div
                key={p.year}
                style={{ left: `${(p.x / CHART_W) * 100}%` }}
                className="absolute flex -translate-x-1/2 flex-col items-center gap-1"
              >
                <span
                  data-count={p.value}
                  className="text-xs font-medium text-ink tabular-nums sm:text-sm"
                >
                  {p.value}+
                </span>
                <span className="text-[10px] text-ink/40 sm:text-xs">
                  {p.year}
                  {p.label && (
                    <span className="ml-1 hidden text-ink/25 sm:inline">
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
