"use client";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const CAPABILITIES = [
  {
    id: "01",
    title: "SLA & Risk Mitigation",
    description:
      "Every placement is backed by a replacement guarantee. If a hire doesn't work out within the window, we source a replacement at no additional cost.",
  },
  {
    id: "02",
    title: "Permanent Infrastructure Only",
    description:
      "We don't run contract or temp desks. Every specialist we route is evaluated and matched for a long-term, full-time seat on your team.",
  },
  {
    id: "03",
    title: "Accelerated Routing",
    description:
      "Verified profiles are pre-screened before they ever reach you, so your team spends time on final decisions, not first-round filtering.",
  },
  {
    id: "04",
    title: "Back-Office Handled",
    description:
      "Background checks, reference verification, and compliance documentation are handled before an introduction is ever made.",
  },
];

export default function PlatformCapabilities() {
  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mb-16 flex flex-col gap-4 md:max-w-2xl"
        >
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
            <span className="text-emerald-400">[ 03 ]</span>
            Platform Capabilities
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
            Hiring infrastructure, not a job board.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-14">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="group"
            >
              <span className="mb-6 flex items-center gap-2 text-3xl font-medium text-white/15 transition-colors duration-300 group-hover:text-emerald-400/60">
                {cap.id}
                <span className="h-1.5 w-1.5 rounded-full bg-white/15 transition-colors duration-300 group-hover:bg-emerald-400" />
              </span>
              <h3 className="mb-3 text-base font-medium text-white/90 transition-colors duration-300 group-hover:text-white">
                {cap.title}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-white/50">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
