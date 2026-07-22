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

export default function CallToAction() {
  return (
    <section id="get-started" className="snap-section relative flex w-full flex-col justify-center bg-black px-6 md:px-16">
      <PixelBackdrop seed="bytewave-cta" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <span className="mb-6 text-xs font-medium tracking-widest text-white/50 uppercase">
          Get Started
        </span>

        <h2 className="mb-6 font-instrument text-5xl leading-tight font-medium text-white md:text-6xl">
          Hiring for scale? <br /> Let&apos;s talk.
        </h2>

        <p className="mb-12 max-w-xl text-lg text-white/60">
          Whether you&apos;re scaling your workforce or advancing your career, connect with us to bypass the noise and find your exact match.
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
