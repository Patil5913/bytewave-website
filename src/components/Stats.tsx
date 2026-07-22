"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PixelBackdrop from "@components/PixelBackdrop";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { value: 94, decimals: 0, suffix: "%", label: "Placement Success Rate" },
  { value: 14, decimals: 0, suffix: "d", label: "Avg. Time-to-Placement" },
  { value: 1.2, decimals: 1, suffix: "k", label: "Verified Professionals" },
  { value: 150, decimals: 0, suffix: "+", label: "Partner Organizations" },
];

export default function Stats() {
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

        gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".stat-num")).forEach(
          (el) => {
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
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-black px-6 py-24 md:px-16">
      <PixelBackdrop variant="dots" className="absolute inset-0 z-0" />
      <div ref={ref} className="relative z-10 mx-auto w-full max-w-7xl">
        <span className="mb-12 flex items-center gap-2 text-sm font-medium tracking-widest text-white/60">
          By the Numbers
        </span>

        <div className="stats-grid grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-block flex flex-col gap-4">
              <h3 className="font-instrument text-6xl font-medium tracking-tight text-white tabular-nums md:text-7xl">
                <span
                  className="stat-num"
                  data-value={stat.value}
                  data-decimals={stat.decimals}
                >
                  {stat.value.toFixed(stat.decimals)}
                </span>
                <span className="text-4xl text-white/30">{stat.suffix}</span>
              </h3>
              <p className="text-xs font-medium tracking-wider text-white/50 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
