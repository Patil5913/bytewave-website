"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, BadgeCheck } from "lucide-react";
import Reveal from "@components/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type StatItem = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  note: string;
};

const WEEKS = [12, 18, 15, 22, 19, 26, 31];
const WEEK_MAX = Math.max(...WEEKS);

const FEED = [
  { who: "S. Okafor", role: "Staff Engineer", co: "Northwind", match: 96 },
  { who: "M. Delgado", role: "Product Designer", co: "Lumen", match: 91 },
  { who: "A. Petrov", role: "DevOps Lead", co: "Corewave", match: 88 },
];

function NetworkWindow() {
  return (
    <div className="w-full rounded-2xl border border-ink/10 bg-ink/[0.04] p-1.5 backdrop-blur-sm">
      <div className="overflow-hidden rounded-xl border border-ink/10 bg-canvas/50">
        <div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-ink/[0.02] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink/40">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            network · live
          </div>
        </div>

        <div className="flex flex-col gap-6 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-lg border border-ink/10 bg-ink/[0.02] p-3">
              <span className="text-xs text-ink/40">Active roles</span>
              <span className="font-instrument text-2xl font-medium text-ink tabular-nums">
                312
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-ink/10 bg-ink/[0.02] p-3">
              <span className="text-xs text-ink/40">Matches today</span>
              <span className="font-instrument text-2xl font-medium text-brand tabular-nums">
                +31
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs tracking-wider text-ink/40 uppercase">
                <Activity className="h-3 w-3" />
                Placements / week
              </span>
              <span className="text-xs text-brand">▲ 18%</span>
            </div>
            <div className="flex h-28 items-end gap-2">
              {WEEKS.map((v, i) => (
                <div
                  key={i}
                  className="chart-bar flex-1 origin-bottom rounded-t bg-gradient-to-t from-brand/20 to-brand/70"
                  style={{ height: `${(v / WEEK_MAX) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col divide-y divide-ink/5 rounded-lg border border-ink/10">
            {FEED.map((f) => (
              <div
                key={f.who}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-brand" />
                  <div className="flex flex-col">
                    <span className="text-sm text-ink/90">
                      {f.role}
                      <span className="text-ink/40"> · {f.co}</span>
                    </span>
                    <span className="text-xs text-ink/40">{f.who}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-brand tabular-nums">
                  {f.match}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Stats({ stats }: { stats: StatItem[] }) {
  const STATS = stats;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const grid = root.querySelector(".stats-grid");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".stat-block", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: grid, start: "top 85%", once: true },
        });

        gsap.from(".chart-bar", {
          scaleY: 0,
          transformOrigin: "bottom",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".chart-bar",
            start: "top 90%",
            once: true,
          },
        });

        gsap.utils
          .toArray<HTMLElement>(root.querySelectorAll(".stat-num"))
          .forEach((el) => {
            const value = Number(el.dataset.value);
            const decimals = Number(el.dataset.decimals);
            const proxy = { val: 0 };
            el.textContent = (0).toFixed(decimals);
            gsap.to(proxy, {
              val: value,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: { trigger: grid, start: "top 85%", once: true },
              onUpdate: () => {
                el.textContent = proxy.val.toFixed(decimals);
              },
            });
          });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section className="relative flex min-h-screen max-sm:min-h-0 w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 max-sm:px-5 max-sm:py-14 md:px-16">
      <div
        ref={ref}
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 max-sm:gap-8 md:grid-cols-12 md:gap-16"
      >
        <div className="flex flex-col gap-10 md:col-span-6">
          <div className="flex flex-col gap-6">
            <h2 className="font-instrument max-sm:text-3xl text-4xl leading-tight font-medium text-balance text-ink lg:text-5xl xl:text-6xl">
              Proof, not promises.
            </h2>
            <p className="max-w-prose text-base leading-relaxed text-ink/70 md:text-lg">
              Every match runs through the same verified pipeline. The result is
              a hiring loop measured in days — and outcomes we can put a number
              on.
            </p>
          </div>

          <div className="stats-grid grid grid-cols-2 gap-x-8 gap-y-10 border-t border-ink/10 pt-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-block flex flex-col gap-3">
                <h3 className="font-instrument max-sm:text-4xl text-5xl font-medium tracking-tight text-ink tabular-nums lg:text-6xl">
                  <span
                    className="stat-num"
                    data-value={stat.value}
                    data-decimals={stat.decimals}
                  >
                    {stat.value.toFixed(stat.decimals)}
                  </span>
                  <span className="text-3xl text-ink/30">{stat.suffix}</span>
                </h3>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium tracking-wider text-ink/65 uppercase">
                    {stat.label}
                  </p>
                  <p className="max-w-[26ch] text-sm leading-snug text-ink/60">
                    {stat.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Reveal x={24} y={0} className="md:col-span-6">
          <NetworkWindow />
        </Reveal>
      </div>
    </section>
  );
}
