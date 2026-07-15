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

export default function CallToAction() {
  return (
    <section className="w-full bg-black px-6 py-32 md:px-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <span className="mb-6 flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
          <span className="text-emerald-400">[ 06 ]</span>
          Get Started
        </span>

        <h2 className="mb-6 font-instrument text-5xl leading-tight font-medium text-white md:text-6xl">
          Hiring for scale? <br /> Let&apos;s talk.
        </h2>

        <p className="mb-12 max-w-xl text-lg text-white/60">
          Whether you&apos;re building out your team or ready to deploy your
          own expertise, connect with us to get started.
        </p>

        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <button className="w-full bg-white px-6 py-2.5 font-medium text-black transition-colors hover:bg-white/90 sm:w-auto">
            Book a Strategy Call
          </button>
          <button className="w-full bg-white/10 px-6 py-2.5 text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto">
            Message Our Team
          </button>
        </div>
      </motion.div>
    </section>
  );
}
