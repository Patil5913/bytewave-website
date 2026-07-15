"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-16 md:py-5"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="text-lg font-archivo font-bold text-white/70 uppercase tracking-tighter"
        >
          BW_
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="#"
            className="hidden text-sm text-white/70 transition-colors hover:text-white md:block"
          >
            For Companies
          </Link>
          <Link
            href="#"
            className="hidden text-sm text-white/70 transition-colors hover:text-white md:block"
          >
            For Professionals
          </Link>
          <Link
            href="#"
            className="hidden text-sm text-white/70 transition-colors hover:text-white md:block"
          >
            Insights
          </Link>
          <button className="bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md transition hover:bg-white/20">
            Let&apos;s Talk
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
