"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Reveal from "@components/Reveal";
import { SITE_SETTINGS } from "@/lib/siteContent";

const LINKS = [
  { href: "/companies", label: "For Companies" },
  { href: "/professionals", label: "For Professionals" },
  { href: "/insights", label: "Insights" },
];

const EXIT_MS = 300;

const CTA_FALLBACK = "/services#intake";

export default function Navbar({
  ctaLabel = SITE_SETTINGS.navCtaLabel,
  ctaHref,
}: {
  ctaLabel?: string;

  ctaHref?: string;
} = {}) {
  const [scrolled, setScrolled] = useState(true);
  const [open, setOpen] = useState(false);

  const ctaTarget = ctaHref ?? CTA_FALLBACK;

  function handleCtaClick(e: React.MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    if (ctaHref) return;
    const intake = document.getElementById("intake");
    if (!intake) return;
    e.preventDefault();
    intake.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!hero) {
        setScrolled(true);
        return;
      }
      // transparent for as long as the hero is still behind the bar
      const navHeight = 64;
      setScrolled(hero.getBoundingClientRect().bottom <= navHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const fg = open || scrolled ? "text-ink" : "text-white";
  const fgMuted = scrolled ? "text-ink/70" : "text-white/70";

  return (
    <Reveal
      as="nav"
      scroll={false}
      y={-10}
      duration={0.5}
      className={`fixed top-0 right-0 left-0 z-50 px-6 py-4 transition-colors duration-300 md:px-16 md:py-5 ${
        scrolled
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
          <Link
            href={ctaTarget}
            onClick={handleCtaClick}
            className={`px-4 py-1.5 text-sm backdrop-blur-md transition-colors ${
              scrolled
                ? "bg-ink text-canvas hover:bg-ink/90"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {ctaLabel}
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden ${fg}`}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        ctaLabel={ctaLabel}
        ctaHref={ctaTarget}
        onCtaClick={handleCtaClick}
      />
    </Reveal>
  );
}

function MobileMenu({
  open,
  onClose,
  ctaLabel,
  ctaHref,
  onCtaClick,
}: {
  open: boolean;
  onClose: () => void;
  ctaLabel: string;
  ctaHref: string;
  onCtaClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const [render, setRender] = useState(open);
  const [active, setActive] = useState(false);

  // keep mounted through the exit transition; set during render, not in an effect
  if (open && !render) setRender(true);

  // flip the transition class one frame after mount; unmount after the exit
  useEffect(() => {
    const raf = requestAnimationFrame(() => setActive(open));
    if (open) return () => cancelAnimationFrame(raf);
    const t = setTimeout(() => setRender(false), EXIT_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!render || typeof document === "undefined") return null;

  // staggered items: links, then cta, then the info block
  const itemClass = () =>
    `transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
      active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`;

  const itemStyle = (i: number) => ({
    transitionDelay: active ? `${120 + i * 60}ms` : "0ms",
  });

  return createPortal(
    <div
      id="mobile-menu"
      className={`fixed inset-0 z-[60] flex flex-col bg-canvas transition-[clip-path,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:hidden ${
        active
          ? "opacity-100 [clip-path:inset(0_0_0%_0)]"
          : "opacity-0 [clip-path:inset(0_0_100%_0)]"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={onClose}
          className="font-instrument text-xl text-ink"
        >
          find <span className="text-brand">&amp;</span> hire
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="text-ink"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
        {LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            style={itemStyle(i)}
            className={`border-b border-ink/10 py-5 font-instrument text-4xl text-ink ${itemClass()}`}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href={ctaHref}
          onClick={onCtaClick}
          style={itemStyle(LINKS.length)}
          className={`mt-8 bg-ink px-4 py-4 text-center text-sm font-medium text-canvas ${itemClass()}`}
        >
          {ctaLabel}
        </Link>
      </nav>

      <div
        style={itemStyle(LINKS.length + 1)}
        className={`px-6 pb-10 text-xs leading-relaxed text-ink/50 ${itemClass()}`}
      >
        <p className="text-ink/70">{SITE_SETTINGS.tagline}</p>
        <p className="mt-3 whitespace-pre-line">{SITE_SETTINGS.address}</p>
      </div>
    </div>,
    document.body,
  );
}
