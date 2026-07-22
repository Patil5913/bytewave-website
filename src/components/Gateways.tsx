"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PixelBackdrop from "@components/PixelBackdrop";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const ROUTES = [
  {
    href: "/companies",
    tag: "Companies",
    seed: "bytewave-gateways-companies",
    headline: (
      <>
        Build your <br /> team.
      </>
    ),
    action: "Access Vetted Talent",
  },
  {
    href: "/professionals",
    tag: "Professionals",
    seed: "bytewave-gateways-professionals",
    headline: (
      <>
        Find your <br /> next role.
      </>
    ),
    action: "Bypass Traditional Filters",
  },
];

export default function Gateways() {
  return (
    <section id="gateways" className="snap-section relative flex w-full flex-col justify-center bg-black px-6 md:px-16">
      <div className="mx-auto w-full max-w-7xl">
        <span className="mb-12 flex items-center gap-2 text-xs font-medium tracking-widest text-white/50 uppercase">
          Choose Your Path
        </span>

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 md:grid-cols-2">
          {ROUTES.map((route, i) => (
            <motion.a
              key={route.href}
              href={route.href}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className={`group relative flex min-h-[420px] flex-col justify-center gap-12 overflow-hidden p-12 transition-colors duration-500 hover:bg-white/[0.04] md:p-16 ${
                i === 0
                  ? "border-b border-white/10 md:border-r md:border-b-0"
                  : ""
              }`}
            >
              <PixelBackdrop seed={route.seed} />

              <div className="relative z-10 flex items-start justify-end">
                <span className="text-xs text-white/40 transition-colors duration-300 group-hover:text-white uppercase">
                  {route.tag}
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-6">
                <h2 className="font-instrument text-4xl leading-tight font-medium text-white transition-colors duration-300 lg:text-5xl">
                  {route.headline}
                </h2>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm tracking-wider text-white/70 uppercase transition-colors duration-300 group-hover:text-white">
                    {route.action}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
