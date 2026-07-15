"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const FAQS = [
  {
    id: "01",
    question: "How does verification work?",
    answer:
      "We replace keyword screening with peer-level validation. You complete a domain-specific assessment and a strategy call, so your capabilities are proven before any company ever sees your profile.",
  },
  {
    id: "02",
    question: "Does it cost anything for professionals?",
    answer:
      "No. Bytewave is free for verified professionals. Our partner organizations cover the cost of placement — you keep 100% of your negotiated compensation.",
  },
  {
    id: "03",
    question: "What kind of roles do you place?",
    answer:
      "Permanent, full-time roles only. We don't dilute your options with short-term contract work — every match is a stable position with a verified organization actively hiring for your exact stack.",
  },
  {
    id: "04",
    question: "How are my details routed to companies?",
    answer:
      "We bypass public job boards entirely. Your optimized profile is routed directly to the decision-makers who need your skills — never scraped, listed, or shared without your explicit approval.",
  },
  {
    id: "05",
    question: "How fast is placement?",
    answer:
      "Because you're matched against roles that are already open and waiting, most verified professionals receive their first direct introduction within 48 to 72 hours of completing verification.",
  },
];

export default function SystemDocumentation() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="flex flex-col gap-6 lg:col-span-5 lg:sticky lg:top-24 lg:h-fit"
        >
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
              <span className="text-emerald-400">[ 06 ]</span>
              Common Questions
            </span>
            <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
              Everything you need to know.
            </h2>
          </div>
          <p className="text-base leading-relaxed text-white/50">
            How verification, routing, and placement actually work. Still have
            a question the log doesn&apos;t answer?
          </p>

          <a
            href="#"
            className="group flex w-fit items-center gap-2 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Talk to our team
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>

        <div className="flex flex-col lg:col-span-7">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ delay: index * 0.08 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="group -mx-4 flex w-full items-center justify-between gap-4 rounded-lg px-4 py-6 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-6 pr-4">
                    <span className="text-xs tracking-widest text-white/40 transition-colors group-hover:text-emerald-400">
                      {faq.id}
                    </span>
                    <h3
                      className={`text-lg font-medium transition-colors ${
                        isOpen ? "text-white" : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 text-lg leading-none transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 text-emerald-400"
                        : "text-white/40 group-hover:text-white"
                    }`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="pr-4 pb-8 pl-12 text-sm leading-relaxed text-white/50">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
