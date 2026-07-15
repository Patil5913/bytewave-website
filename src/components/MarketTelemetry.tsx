"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

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

  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="flex flex-col gap-4 md:col-span-4"
        >
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
            <span className="text-emerald-400">[ 02 ]</span>
            Market Telemetry
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
            We show you the real range, not a guess.
          </h2>
          <p className="text-sm leading-relaxed text-white/50">
            Every compensation band below is pulled from live placements
            across our network. Transparency here means leverage — walk into
            every conversation knowing exactly where you stand.
          </p>
          <p className="mt-2 text-xs font-medium tracking-widest text-white/40 uppercase">
            USD base / year · trailing 90 days
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ delay: 0.15 }}
          className="md:col-span-8"
        >
          <div className="flex gap-4 sm:gap-6">
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
                      active === i ? "text-white" : "text-white/60"
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
                          ? "border-dashed border-white/20"
                          : "border-white/6"
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
                      <div className="absolute inset-x-0 top-1/2 border-t border-white/6" />
                      <div
                        style={{ left: `${left}%`, width: `${width}%` }}
                        className={`absolute inset-y-0 flex items-center justify-between overflow-hidden border-l-2 bg-linear-to-r px-2.5 backdrop-blur-md transition-all duration-300 ${
                          isActive
                            ? "border-emerald-200/60 from-emerald-300/70 via-amber-300/55 to-rose-300/60"
                            : "border-emerald-300/30 from-emerald-300/12 via-amber-300/10 to-rose-300/[0.07] hover:from-emerald-300/25 hover:via-amber-300/18 hover:to-rose-300/12"
                        }`}
                      >
                        <span
                          className={`text-[10px] tracking-wide whitespace-nowrap transition-colors ${
                            isActive ? "text-white" : "text-white/60"
                          }`}
                        >
                          ${stack.min}k
                        </span>
                        <span
                          className={`text-[10px] font-medium tracking-wide whitespace-nowrap transition-colors ${
                            isActive ? "text-white" : "text-white/80"
                          }`}
                        >
                          ${stack.max}k
                        </span>
                        <motion.div
                          initial={{ scaleX: 1 }}
                          whileInView={{ scaleX: 0 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.15 + i * 0.09,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="absolute inset-0 origin-right bg-black"
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
                    className="absolute -translate-x-1/2 text-[10px] tracking-wide text-white/30"
                    style={{ left: `${toPercent(tick)}%` }}
                  >
                    ${tick}k
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
