"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Hero() {
  return (
    <section className="relative h-dvh w-dvw overflow-hidden">
      <Image
        src="https://images.pexels.com/photos/13599309/pexels-photo-13599309.jpeg"
        alt="Hero background"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover saturate-125 contrast-105"
      />
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          variants={itemVariants}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Now onboarding verified professionals
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="max-w-4xl text-center font-instrument text-4xl font-medium text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-8xl"
        >
          The frictionless way to hire and get hired.
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          className="max-w-2xl text-center text-sm text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-base lg:text-lg"
        >
          Skip the endless resume reviews and generic job boards. We connect
          verified candidates directly with companies actively looking for
          their exact skills.
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm sm:text-base"
        >
          <a
            href="#"
            className="border-b border-white/60 pb-1 text-white transition-colors duration-300 hover:border-white/20 hover:text-white/70"
          >
            Build Your Team
          </a>
          <a
            href="#"
            className="group flex items-center gap-2 bg-white/10 px-4 py-1.5 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Advance Your Career
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 w-full flex flex-col items-center justify-center gap-2 pb-8 sm:pb-12"
      >
        <p className="px-6 text-center text-xs font-medium text-white/70 sm:text-sm lg:text-base">
          Compatible with your existing hiring stack
        </p>
        <div className="marquee-fade w-full sm:w-3/4">
          <div className="overflow-hidden">
            <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
              {[
                { name: "Workday", slug: "workday" },
                { name: "Greenhouse", slug: "greenhouse" },
                { name: "Lever", slug: "lever" },
                { name: "Ashby", slug: "ashby" },
                { name: "Indeed", slug: "indeed" },
                { name: "Glassdoor", slug: "glassdoor" },
                { name: "BambooHR", slug: "bamboohr" },
                { name: "Paylocity", slug: "paylocity" },
                { name: "SmartRecruiters", slug: "smartrecruiters" },
                { name: "iCIMS", slug: "icims" },
                { name: "Workable", slug: "workable" },
                { name: "Paycom", slug: "paycom" },
                { name: "ZipRecruiter", slug: "ziprecruiter" },
                { name: "SuccessFactors", slug: "successfactors" },
                { name: "Personio", slug: "personio" },
              ]
                .concat([
                  { name: "Workday", slug: "workday" },
                  { name: "Greenhouse", slug: "greenhouse" },
                  { name: "Lever", slug: "lever" },
                  { name: "Ashby", slug: "ashby" },
                  { name: "Indeed", slug: "indeed" },
                  { name: "Glassdoor", slug: "glassdoor" },
                  { name: "BambooHR", slug: "bamboohr" },
                  { name: "Paylocity", slug: "paylocity" },
                  { name: "SmartRecruiters", slug: "smartrecruiters" },
                  { name: "iCIMS", slug: "icims" },
                  { name: "Workable", slug: "workable" },
                  { name: "Paycom", slug: "paycom" },
                  { name: "ZipRecruiter", slug: "ziprecruiter" },
                  { name: "SuccessFactors", slug: "successfactors" },
                  { name: "Personio", slug: "personio" },
                ])
                .map((platform, i) => (
                  <span
                    key={i}
                    className="group flex items-center gap-2.5 text-base font-medium text-white transition-colors duration-200 hover:text-white/80"
                  >
                    <span className="relative h-5 w-5">
                      <img
                        src={`https://jobspipe.dev/favicons/${platform.slug}.png`}
                        alt={platform.name}
                        className="absolute inset-0 h-5 w-5 grayscale invert opacity-70 transition-opacity duration-200 group-hover:opacity-0"
                      />
                      <img
                        src={`https://jobspipe.dev/favicons/${platform.slug}.png`}
                        alt=""
                        className="absolute inset-0 h-5 w-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      />
                    </span>
                    {platform.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
