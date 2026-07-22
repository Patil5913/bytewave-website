"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Reveal from "@components/Reveal";

gsap.registerPlugin(useGSAP);

const FAQS = [
  {
    id: "01",
    question: "How is a candidate verified before we see them?",
    answer:
      "Every specialist completes a domain-specific assessment and a strategy call before we ever route them. You only see profiles that have already cleared our bar.",
  },
  {
    id: "02",
    question: "What does it cost to hire through Bytewave?",
    answer:
      "A single success fee on the hire's first-year base salary, billed only once they start. High-volume teams can move to a flat monthly retainer instead. No job board fees, no per-post charges.",
  },
  {
    id: "03",
    question: "Do you place contractors or only full-time roles?",
    answer:
      "Permanent, full-time roles only. We're built for teams making long-term hires, not staffing short-term gaps.",
  },
  {
    id: "04",
    question: "What happens if a hire doesn't work out?",
    answer:
      "Every placement includes a 90-day replacement window. If it's not the right fit, we source a replacement at no additional cost.",
  },
  {
    id: "05",
    question: "How fast can you fill a role?",
    answer:
      "Because candidates are pre-verified, most roles receive a first qualified introduction within a few business days, with an average time-to-hire of 12 days.",
  },
];

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQS)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      const el = contentRef.current;
      if (!el) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!mounted.current) {
        mounted.current = true;
        gsap.set(el, isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 });
        return;
      }

      if (reduce) {
        gsap.set(el, isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 });
        return;
      }

      if (isOpen) {
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" },
        );
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power2.out" });
      }
    },
    { dependencies: [isOpen], scope: contentRef },
  );

  return (
    <div>
      <button
        onClick={onToggle}
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

      <div ref={contentRef} className="overflow-hidden">
        <p className="pr-4 pb-8 pl-12 text-sm leading-relaxed text-white/50">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function EnterpriseFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-6 lg:col-span-5 lg:sticky lg:top-24 lg:h-fit">
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
            How verification, pricing, and routing work on our end. Still
            have a question the log doesn&apos;t answer?
          </p>

          <a
            href="#"
            className="group flex w-fit items-center gap-2 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Talk to our team
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Reveal>

        <Reveal stagger={0.08} className="flex flex-col lg:col-span-7">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={isOpen}
                onToggle={() => setOpenIndex(isOpen ? null : index)}
              />
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
