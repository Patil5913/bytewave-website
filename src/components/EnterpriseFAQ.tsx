"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Reveal from "@components/Reveal";

gsap.registerPlugin(useGSAP);

type Faq = { id: string; question: string; answer: string };

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: Faq;
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
        gsap.set(
          el,
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 },
        );
        return;
      }

      if (reduce) {
        gsap.set(
          el,
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 },
        );
        return;
      }

      if (isOpen) {
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" },
        );
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [isOpen], scope: contentRef },
  );

  return (
    <div>
      <button
        onClick={onToggle}
        className="group -mx-4 flex w-full items-center justify-between gap-4 rounded-lg px-4 py-6 text-left transition-colors hover:bg-ink/[0.03]"
      >
        <div className="flex items-center gap-6 pr-4">
          <span className="text-xs tracking-widest text-ink/40 transition-colors group-hover:text-brand">
            {faq.id}
          </span>
          <h3
            className={`text-lg font-medium transition-colors ${
              isOpen ? "text-ink" : "text-ink/70 group-hover:text-ink"
            }`}
          >
            {faq.question}
          </h3>
        </div>

        <span
          className={`shrink-0 text-lg leading-none transition-all duration-300 ${
            isOpen ? "rotate-45 text-brand" : "text-ink/40 group-hover:text-ink"
          }`}
        >
          +
        </span>
      </button>

      <div ref={contentRef} className="overflow-hidden">
        <p className="pr-4 pb-8 pl-12 text-sm leading-relaxed text-ink/50">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function EnterpriseFAQ({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const FAQS: Faq[] = items.map((f, i) => ({
    id: String(i + 1).padStart(2, "0"),
    ...f,
  }));
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-canvas px-6 py-24 max-sm:px-5 max-sm:py-14 md:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 max-sm:gap-10 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-6 lg:col-span-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              Common Questions
            </span>
            <h2 className="font-instrument max-sm:text-3xl text-4xl leading-tight font-medium text-ink lg:text-5xl">
              Everything you need to know.
            </h2>
          </div>
          <p className="text-base leading-relaxed text-ink/50">
            How verification, pricing, and routing work on our end. Still have a
            question the log doesn&apos;t answer?
          </p>

          <a
            href="#intake"
            className="group flex w-fit items-center gap-2 bg-ink/10 px-5 py-2.5 text-sm text-ink backdrop-blur-md transition-colors hover:bg-ink/20"
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
