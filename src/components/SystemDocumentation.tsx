"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Reveal from "@components/Reveal";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

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

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQS)[number];
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

      <div ref={panelRef} className="overflow-hidden">
        <p className="pr-4 pb-8 pl-12 text-sm leading-relaxed text-white/50">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function SystemDocumentation() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-6 lg:col-span-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
              <span className="text-white/40">[ 06 ]</span>
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
        </Reveal>

        <Reveal stagger={0.08} className="flex flex-col lg:col-span-7">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
