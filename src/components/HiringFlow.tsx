"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Stage = {
  n: string;
  label: string;
  title: React.ReactNode;
  detail: string;
};

const STAGES: Stage[] = [
  {
    n: "01",
    label: "The Role",
    title: (
      <>
        One role, <br /> defined precisely.
      </>
    ),
    detail:
      "You post a single requisition with the exact stack and seniority you need — the mouth of the funnel.",
  },
  {
    n: "02",
    label: "The Applicants",
    title: (
      <>
        Four hundred <br /> names apply.
      </>
    ),
    detail:
      "A typical role draws 400+ applicants. Great people get buried under keywords and volume.",
  },
  {
    n: "03",
    label: "Verified",
    title: (
      <>
        Proven skill <br /> rises to the top.
      </>
    ),
    detail:
      "Every candidate is skill-verified before they reach you — demonstrated ability, not a self-reported list.",
  },
  {
    n: "04",
    label: "The Process",
    title: (
      <>
        Screened, <br /> matched, introduced.
      </>
    ),
    detail:
      "System-design screens, stack-and-seniority matching, and a direct intro — all handled before it hits your desk.",
  },
  {
    n: "05",
    label: "Hired",
    title: (
      <>
        One signed offer, <br /> twelve days later.
      </>
    ),
    detail:
      "The funnel closes on a single verified hire — from open role to signed offer in days, not months.",
  },
];

const DOT_COUNTS = [400, 200, 100, 50, 1];
const DOT = 7;
const GRID_COLS = 25;

function cluster(n: number) {
  const cols = n === 1 ? 1 : GRID_COLS;
  const highlight = n === 1;
  return {
    cols,
    dots: Array.from({ length: n }, () => ({ chosen: highlight })),
  };
}
const CLUSTERS = DOT_COUNTS.map(cluster);

function Cluster({
  cols,
  count,
  alwaysHighlight,
}: {
  cols: number;
  count: number;
  alwaysHighlight: boolean;
}) {
  return (
    <div
      aria-hidden
      className="grid place-items-center gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, ${DOT}px)` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`rounded-full ${alwaysHighlight ? "bg-brand" : "bg-ink/35"}`}
          style={{
            width: DOT,
            height: DOT,
            opacity: alwaysHighlight ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

export default function HiringFlow() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const track = root.querySelector<HTMLElement>(".flow-track");
      if (!track) return;
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () => track.scrollWidth - window.innerWidth;
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => "+=" + distance(),
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative w-full scroll-mt-24 overflow-hidden bg-canvas md:h-screen"
    >
      <div className="flow-track flex flex-col md:h-screen md:w-max md:flex-row">
        {STAGES.map((stage, si) => {
          const { cols } = CLUSTERS[si];
          const count = DOT_COUNTS[si];
          return (
            <div
              key={stage.n}
              className="relative flex w-full shrink-0 flex-col px-6 py-24 md:h-screen md:w-screen md:px-16 md:pt-28 md:pb-16"
            >
              <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end gap-6 md:justify-between">
                <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-start">
                  <Cluster
                    cols={cols}
                    count={count}
                    alwaysHighlight={si === STAGES.length - 1}
                  />
                </div>

                <div className="relative z-10 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
                  <span className="tabular-nums text-brand">{stage.n}</span>
                  {stage.label}
                </div>

                <div className="relative z-10 flex max-w-xl flex-col gap-5">
                  <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink sm:text-5xl lg:text-6xl">
                    {stage.title}
                  </h2>
                  <p className="max-w-md text-base leading-relaxed text-ink/50 md:text-lg">
                    {stage.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
