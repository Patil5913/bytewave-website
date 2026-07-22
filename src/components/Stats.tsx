"use client";

import { motion, type Variants } from "framer-motion";
import PixelBackdrop from "@components/PixelBackdrop";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const STATS = [
  { value: "94", suffix: "%", label: "Placement Success Rate" },
  { value: "14", suffix: "d", label: "Avg. Time-to-Placement" },
  { value: "1.2", suffix: "k", label: "Verified Professionals" },
  { value: "150", suffix: "+", label: "Partner Organizations" },
];

export default function Stats() {
  return (
    <section id="stats" className="snap-section relative flex w-full flex-col justify-center bg-black px-6 md:px-16">
      <PixelBackdrop seed="bytewave-stats" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <span className="mb-12 flex items-center gap-2 text-xs font-medium tracking-widest text-white/50 uppercase">
          By the Numbers
        </span>

        <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col gap-4"
            >
              <h3 className="font-instrument text-6xl font-medium tracking-tight text-white md:text-7xl">
                {stat.value}
                <span className="text-4xl text-white/30">{stat.suffix}</span>
              </h3>
              <p className="text-xs font-medium tracking-wider text-white/50 uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
