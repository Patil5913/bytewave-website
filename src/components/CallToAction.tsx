"use client";

import PixelBackdrop from "@components/PixelBackdrop";
import Reveal from "@components/Reveal";

export default function CallToAction() {
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-black px-6 py-32 md:px-16">
      <PixelBackdrop variant="glow" className="absolute inset-0 z-0" />
      <PixelBackdrop variant="dots" className="absolute inset-0 z-0" intensity={0.5} />
      <Reveal className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <span className="mb-6 flex items-center gap-2 text-sm font-medium tracking-widest text-white/60">
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
      </Reveal>
    </section>
  );
}
