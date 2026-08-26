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
      className="grid place-items-center gap-1.5 sm:gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, ${DOT}px)` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          data-flow-dot
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

      // one behaviour at every width: the section pins and the track slides
      // horizontally with the page scroll — no optional swipe to discover
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
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

        // stage copy and dots animate as their panel slides in, driven by the
        // same horizontal tween rather than by vertical position
        const panels = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll("[data-flow-panel]"),
        );
        const reveals = panels.flatMap((panel) => [
          gsap.from(panel.querySelectorAll("[data-flow-item]"), {
            opacity: 0,
            y: 24,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left 75%",
              once: true,
            },
          }),
          gsap.from(panel.querySelectorAll("[data-flow-dot]"), {
            opacity: 0,
            scale: 0.4,
            duration: 0.5,
            stagger: { each: 0.01, from: "random" },
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left 70%",
              once: true,
            },
          }),
        ]);

        return () => {
          reveals.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      // reduced motion: no pin, so the track has to be swipeable to be usable
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const classes = [
          "snap-x",
          "snap-mandatory",
          "overflow-x-auto",
          "overscroll-x-contain",
        ];
        track.classList.add(...classes);
        return () => track.classList.remove(...classes);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative h-svh w-full scroll-mt-24 overflow-hidden bg-canvas md:h-screen"
    >
      <div className="flow-track flex h-full w-max flex-row [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STAGES.map((stage, si) => {
          const { cols } = CLUSTERS[si];
          const count = DOT_COUNTS[si];
          return (
            <div
              key={stage.n}
              data-flow-panel
              className="relative flex h-full w-screen shrink-0 snap-center flex-col px-6 pt-24 pb-12 max-sm:px-5 md:px-16 md:pt-28 md:pb-16"
            >
              <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between gap-6">
                <div
                  data-flow-item
                  className="relative z-10 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45"
                >
                  <span className="tabular-nums text-brand">{stage.n}</span>
                  {stage.label}
                </div>

                {/* dots read as the funnel volume — they own the band between
                    the stage label and the copy, centered in whatever is left */}
                <div
                  aria-hidden
                  className="pointer-events-none flex min-h-0 flex-1 items-center justify-start overflow-hidden py-4"
                >
                  <Cluster
                    cols={cols}
                    count={count}
                    alwaysHighlight={si === STAGES.length - 1}
                  />
                </div>

                <div
                  data-flow-item
                  className="relative z-10 flex max-w-xl flex-col gap-5"
                >
                  <h2 className="font-instrument max-sm:text-3xl text-4xl leading-[1.05] font-medium text-balance text-ink sm:text-5xl lg:text-6xl">
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
