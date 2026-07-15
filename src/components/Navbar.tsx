"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const MotionLink = motion.create(Link);

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-16 md:py-5"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <MotionLink
          href="/"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="group flex items-end gap-1 text-lg font-archivo font-bold uppercase text-white transition hover:text-white/80"
        >
          BW
          <motion.span
            aria-hidden
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            className="mb-1 h-0.5 w-2.5 -translate-x-0.75 -translate-y-1 bg-white/40 backdrop-blur-md group-hover:bg-white/70"
          />
        </MotionLink>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="#"
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
