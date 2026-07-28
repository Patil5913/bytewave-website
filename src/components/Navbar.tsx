"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@components/Reveal";

export default function Navbar() {
  // The hero stays dark; the rest of the site is light. Swap the bar's
  // treatment once scrolled past the hero so text stays legible on both.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fg = scrolled ? "text-ink" : "text-white";
  const fgMuted = scrolled ? "text-ink/70" : "text-white/70";

  return (
    <Reveal
      as="nav"
      scroll={false}
      y={-10}
      duration={0.5}
      className="fixed top-0 right-0 left-0 z-50 px-6 py-4 md:px-16 md:py-5"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/"
          className={`group font-instrument text-xl font-normal sm:text-2xl ${fg}`}
        >
          <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-x-1.5">
            find
          </span>{" "}
          <span className="inline-block text-brand transition-transform duration-300 ease-out group-hover:rotate-90">
            &amp;
          </span>{" "}
          <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5">
            hire
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/companies"
            className={`hidden text-sm transition-colors hover:opacity-100 md:block ${fgMuted}`}
          >
            For Companies
          </Link>
          <Link
            href="/professionals"
            className={`hidden text-sm transition-colors hover:opacity-100 md:block ${fgMuted}`}
          >
            For Professionals
          </Link>
          <Link
            href="/insights"
            className={`hidden text-sm transition-colors hover:opacity-100 md:block ${fgMuted}`}
          >
            Insights
          </Link>
          <button
            className={`px-4 py-1.5 text-sm backdrop-blur-md transition ${
              scrolled
                ? "bg-ink text-canvas hover:bg-ink/90"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Let&apos;s Talk
          </button>
        </div>
      </div>
    </Reveal>
  );
}
