"use client";

import { useMemo, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "@components/Reveal";

const PALETTE = ["var(--color-brand)", "#fcd34d", "#fda4af"];

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function GridPattern({ seed }: { seed: number }) {
  const CELL = 44;
  const COLS = 24;
  const ROWS = 16;
  const W = COLS * CELL;
  const H = ROWS * CELL;

  const cells = useMemo(() => {
    const rng = mulberry32(seed);
    const out: {
      x: number;
      y: number;
      fill: string;
      opacity: number;
      dur: number;
      delay: number;
    }[] = [];
    for (let r = 0; r < ROWS; r++) {
      const t = r / (ROWS - 1);
      const prob = Math.min(0.62, Math.pow(t, 1.9) * 0.95);
      for (let c = 0; c < COLS; c++) {
        if (rng() < prob) {
          out.push({
            x: c * CELL,
            y: r * CELL,
            fill: PALETTE[Math.floor(rng() * PALETTE.length)],
            opacity: 0.12 + rng() * 0.16,
            dur: 3 + rng() * 3.5,
            delay: rng() * 5,
          });
        }
      }
    }
    return out;
  }, [seed]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {cells.map((c, i) => (
        <rect
          key={i}
          className="grid-cell"
          x={c.x}
          y={c.y}
          width={CELL}
          height={CELL}
          fill={c.fill}
          fillOpacity={c.opacity}
          style={
            {
              "--gd": `${c.dur}s`,
              "--gdelay": `${c.delay}s`,
            } as CSSProperties
          }
        />
      ))}
      {Array.from({ length: COLS + 1 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * CELL}
          y1={0}
          x2={i * CELL}
          y2={H}
          stroke="rgba(10,10,10,0.06)"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {Array.from({ length: ROWS + 1 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={i * CELL}
          x2={W}
          y2={i * CELL}
          stroke="rgba(10,10,10,0.06)"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

const ROUTES = [
  {
    href: "/companies",
    index: "01",
    tag: "Companies",
    headline: (
      <>
        Build your <br /> team.
      </>
    ),
    blurb:
      "Skip the résumé pile. Meet pre-verified professionals whose skills are proven before they reach your inbox.",
    action: "Access Vetted Talent",
  },
  {
    href: "/professionals",
    index: "02",
    tag: "Professionals",
    headline: (
      <>
        Find your <br /> next role.
      </>
    ),
    blurb:
      "Get verified once and let the right companies come to you — no cover letters, no application black hole.",
    action: "Bypass Traditional Filters",
  },
];

export default function Gateways() {
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <Reveal
          stagger={0.12}
          className="grid grid-cols-1 overflow-hidden rounded-2xl border border-ink/10 md:grid-cols-2"
        >
          {ROUTES.map((route, i) => (
            <a
              key={route.href}
              href={route.href}
              className={`group relative flex min-h-[440px] flex-col justify-between gap-12 overflow-hidden p-10 transition-colors duration-500 md:min-h-[60svh] md:p-14 ${
                i === 0
                  ? "border-b border-ink/10 md:border-r md:border-b-0"
                  : ""
              }`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-700 ease-out group-hover:opacity-100"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%)",
                }}
              >
                <GridPattern seed={i === 0 ? 7 : 23} />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/70 via-canvas/30 to-transparent"
              />

              <span className="pointer-events-none absolute -top-8 -right-2 font-instrument text-[13rem] leading-none font-medium text-ink/[0.03] transition-all duration-500 group-hover:-translate-y-1 group-hover:text-ink/[0.06]">
                {route.index}
              </span>

              <div className="relative flex items-center justify-between">
                <span className="text-xs tracking-widest text-ink/60 uppercase">
                  Path // {route.index}
                </span>
                <span className="border border-ink/15 px-3 py-1 text-xs tracking-wider text-ink/65 uppercase transition-colors duration-300 group-hover:border-ink/30 group-hover:text-ink">
                  {route.tag}
                </span>
              </div>

              <div className="relative flex flex-col gap-6">
                <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-ink lg:text-6xl">
                  {route.headline}
                </h2>
                <p className="max-w-sm text-sm leading-relaxed text-ink/70">
                  {route.blurb}
                </p>
              </div>

              <div className="relative flex">
                <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2.5 text-sm font-medium tracking-wider text-ink uppercase backdrop-blur-md transition-colors duration-300 group-hover:bg-white/20">
                  {route.action}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
