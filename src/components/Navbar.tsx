"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Reveal from "@components/Reveal";

const LINKS = [
  { href: "/companies", label: "For Companies" },
  { href: "/professionals", label: "For Professionals" },
  { href: "/insights", label: "Insights" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      const threshold = hero.offsetHeight * 0.6;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The menu overlay is always dark, so its contents stay light regardless
  // of the bar's scrolled state.
  const fg = open || scrolled ? "text-ink" : "text-white";
  const fgMuted = scrolled ? "text-ink/70" : "text-white/70";

  return (
    <Reveal
      as="nav"
      scroll={false}
      y={-10}
      duration={0.5}
      className={`fixed top-0 right-0 left-0 z-50 px-6 py-4 transition-colors duration-300 md:px-16 md:py-5 ${
        open
          ? "bg-canvas"
          : scrolled
            ? "border-b border-ink/10 bg-canvas/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={`font-instrument text-xl font-normal sm:text-2xl ${fg}`}
        >
          find <span className="text-brand">&amp;</span> hire
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${fgMuted} ${
                scrolled ? "hover:text-ink" : "hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            className={`px-4 py-1.5 text-sm backdrop-blur-md transition-colors ${
              scrolled
                ? "bg-ink text-canvas hover:bg-ink/90"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Let&apos;s Talk
          </button>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden ${fg}`}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="fixed inset-x-0 top-[57px] bottom-0 z-40 flex flex-col gap-2 bg-canvas px-6 pt-8 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-ink/10 py-4 font-instrument text-2xl text-ink"
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-6 bg-ink px-4 py-3 text-sm font-medium text-canvas transition-colors hover:bg-ink/90"
          >
            Let&apos;s Talk
          </button>
        </div>
      )}
    </Reveal>
  );
}
