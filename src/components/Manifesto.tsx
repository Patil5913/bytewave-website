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

export default function Manifesto() {
  return (
    <section className="w-full border-t border-white/10 bg-black px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="flex flex-col justify-start gap-4 md:col-span-5"
        >
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
            <span className="text-emerald-400">[ 01 ]</span>
            Why We Exist
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white md:text-4xl lg:text-5xl xl:text-6xl">
            The traditional hiring loop is broken. We built a better
            mechanism.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-8 text-base leading-relaxed text-white/60 md:col-span-7 md:text-lg"
        >
          <p>
            Most staffing agencies rely on keyword matching and endless
            resume piles, frustrating companies and candidates alike. We see
            hiring as a matching problem — connecting real needs directly
            with a network of verified professionals, cutting out the noise.
          </p>

          <div className="grid grid-cols-1 gap-8 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-medium tracking-wider text-white uppercase">
                01. No Guesswork
              </h4>
              <p className="text-sm leading-snug text-white/50">
                Every match is backed by verified skills, not a
                keyword-stuffed resume.
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium tracking-wider text-white uppercase">
                02. Straight to the Point
              </h4>
              <p className="text-sm leading-snug text-white/50">
                Skip the application black hole and talk directly to the
                people making the hire.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
