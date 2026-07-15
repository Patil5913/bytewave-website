"use client";

import { motion, type Variants } from "framer-motion";
import { BadgeCheck, ShieldCheck, Fingerprint, Flag } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const CERTIFICATIONS = [
  {
    id: "01",
    icon: BadgeCheck,
    title: "ISO 9001",
    year: "2026",
    description:
      "Aligned with global quality standards to deliver consistent and reliable workforce solutions.",
  },
  {
    id: "02",
    icon: ShieldCheck,
    title: "ISO 27001",
    year: "2026",
    description:
      "Advanced data security and strict protection across all systems and operations.",
  },
  {
    id: "03",
    icon: Fingerprint,
    title: "GDPR 5000",
    year: "2026",
    description:
      "Transparent, secure, and privacy-first practices in every process we follow.",
  },
  {
    id: "04",
    icon: Flag,
    title: "U.S. E-Verify",
    year: "2023",
    description:
      "Compliant with U.S. employment standards, ensuring verified workforce solutions.",
  },
];

export default function Certifications() {
  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mb-16 flex flex-col gap-4 md:max-w-2xl"
        >
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
            <span className="text-emerald-400">[ 04 ]</span>
            Compliance
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
            Certified where it counts.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="group flex flex-col gap-4"
            >
              <cert.icon className="h-6 w-6 text-white/30 transition-colors duration-300 group-hover:text-emerald-400" />
              <div className="flex items-baseline gap-2">
                <h3 className="text-base font-medium text-white/90 transition-colors duration-300 group-hover:text-white">
                  {cert.title}
                </h3>
                <span className="text-xs tracking-widest text-white/30">
                  {cert.year}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/50">
                {cert.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
