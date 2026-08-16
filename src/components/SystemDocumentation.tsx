"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Reveal from "@components/Reveal";
import { ArrowRight } from "lucide-react";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  useGSAP(
    () => {
      const el = panelRef.current;
      if (!el) return;
      if (firstRun.current) {
        firstRun.current = false;
        gsap.set(el, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 });
        return;
      }
      if (isOpen) {
        gsap.to(el, {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power3.out",
        });
      }
    },
    { dependencies: [isOpen] },
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

      <div ref={panelRef} className="overflow-hidden">
        <p className="pr-4 pb-8 pl-12 text-sm leading-relaxed text-ink/50">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function SystemDocumentation({
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
    <section className="w-full bg-canvas px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-6 lg:col-span-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
              Common Questions
            </span>
            <h2 className="font-instrument text-4xl leading-tight font-medium text-ink lg:text-5xl">
              Everything you need to know.
            </h2>
          </div>
          <p className="text-base leading-relaxed text-ink/50">
            How verification, routing, and placement actually work. Still have a
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
          {FAQS.map((faq, index) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
