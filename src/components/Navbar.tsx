"use client";

import Link from "next/link";
import Reveal from "@components/Reveal";

export default function Navbar() {
  return (
    <Reveal
      as="nav"
      scroll={false}
      y={-10}
      duration={0.5}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-16 md:py-5"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="font-instrument text-xl font-normal text-brand transition-transform duration-200 hover:scale-105 hover:text-brand/80 active:scale-95 sm:text-2xl"
        >
          find &amp; hire
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/companies"
            className="hidden text-sm text-white/70 transition-colors hover:text-white md:block"
          >
            For Companies
          </Link>
          <Link
            href="/professionals"
            className="hidden text-sm text-white/70 transition-colors hover:text-white md:block"
          >
            For Professionals
          </Link>
          <Link
            href="/insights"
            className="hidden text-sm text-white/70 transition-colors hover:text-white md:block"
          >
            Insights
          </Link>
          <button className="bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md transition hover:bg-white/20">
            Let&apos;s Talk
          </button>
        </div>
      </div>
    </Reveal>
  );
}
