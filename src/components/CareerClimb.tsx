"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ROLES = [
  { role: "Junior Developer", salary: 85 },
  { role: "Mid-level Engineer", salary: 120 },
  { role: "Senior Engineer", salary: 165 },
  { role: "Staff Engineer", salary: 210 },
  { role: "Principal Engineer", salary: 260 },
];
const MIN = ROLES[0].salary;
const MAX = ROLES[ROLES.length - 1].salary;

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TOP = 10;
const BOTTOM = 98;

const { LINE_PATH, POINTS } = (() => {
  const n = 40;
  const rng = mulberry32(7);
  const drift = (BOTTOM - TOP) / (n - 1);
  const pts: [number, number][] = [[0, 100]];
  let y = BOTTOM;
  for (let i = 1; i < n; i++) {
    const x = (i / (n - 1)) * 100;
    y = y - drift + (rng() - 0.5) * 7;
    y = Math.max(TOP, Math.min(BOTTOM, y));
    pts.push([x, y]);
  }
  for (let i = 1; i < pts.length - 1; i++) {
    pts[i][1] = pts[i][1] * 0.5 + (pts[i - 1][1] + pts[i + 1][1]) * 0.25;
  }
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  return { LINE_PATH: line, POINTS: pts };
})();

function salaryAt(p: number) {
  const x = p * 100;
  let y = POINTS[POINTS.length - 1][1];
  for (let i = 1; i < POINTS.length; i++) {
    const [x0, y0] = POINTS[i - 1];
    const [x1, y1] = POINTS[i];
    if (x <= x1) {
      const f = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
      y = y0 + (y1 - y0) * f;
      break;
    }
  }
  const norm = (BOTTOM - y) / (BOTTOM - TOP);
  return Math.round(MIN + (MAX - MIN) * norm);
}

export default function CareerClimb() {
  const ref = useRef<HTMLDivElement>(null);
  const salaryRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const rungs = gsap.utils.toArray<HTMLElement>(".climb-rung");
      const mm = gsap.matchMedia();

      const apply = (p: number) => {
        if (salaryRef.current)
          salaryRef.current.textContent = `$${salaryAt(p)}k`;
        const idx = Math.min(ROLES.length - 1, Math.floor(p * ROLES.length));
        if (roleRef.current) roleRef.current.textContent = ROLES[idx].role;
        rungs.forEach((r, i) => (r.dataset.on = i <= idx ? "true" : "false"));
        if (graphRef.current)
          graphRef.current.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
      };

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const st = ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "+=220%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => apply(self.progress),
          });
          apply(0);
          return () => st.kill();
        },
      );

      // phones: same climb, scrubbed as the section passes instead of pinned
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          // hold at the start until the whole graph band is on screen
          const st = ScrollTrigger.create({
            trigger: graphRef.current ?? root,
            start: "bottom bottom",
            end: "+=70%",
            scrub: 0.4,
            onUpdate: (self) => apply(self.progress),
          });
          apply(0);
          return () => st.kill();
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        apply(1);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-canvas">
      <div className="relative flex min-h-screen w-full items-center px-6 py-24 max-sm:min-h-[82svh] max-sm:px-5 max-sm:py-16 md:h-screen md:px-16 md:py-0">
        <div
          ref={graphRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[55vh] max-sm:h-[38%] max-sm:opacity-70"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <defs>
              <linearGradient id="climbLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-brand)" />
                <stop offset="55%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#fda4af" />
              </linearGradient>
            </defs>
            <path
              d={LINE_PATH}
              fill="none"
              stroke="url(#climbLine)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
          <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
            The Climb
          </span>

          <span className="text-xs tracking-widest text-ink/40 uppercase">
            Verified base salary · USD / year
          </span>

          <span
            ref={salaryRef}
            className="font-instrument text-7xl leading-none font-medium text-ink tabular-nums sm:text-8xl lg:text-[11rem]"
          >
            ${MIN}k
          </span>

          <span
            ref={roleRef}
            className="font-instrument text-2xl font-medium text-ink/70 lg:text-4xl"
          >
            {ROLES[0].role}
          </span>

          <div className="mt-4 flex w-full max-w-md items-center gap-2">
            {ROLES.map((r) => (
              <span
                key={r.role}
                data-on="false"
                className="climb-rung h-0.5 flex-1 rounded-full bg-ink/15 transition-colors duration-300 data-[on=true]:bg-brand"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
