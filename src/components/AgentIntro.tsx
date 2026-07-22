"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PixelBackdrop from "@components/PixelBackdrop";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Segment = { text: string; brand?: boolean };

// Paragraphs as segments so the brand name can carry the brand color.
const PARAGRAPHS: Segment[][] = [
  [
    {
      text: "Hiring still runs on noise. Job boards bury you under 400 applicants, recruiters push roles that never fit, and by the time the right opening surfaces, it’s already gone.",
    },
  ],
  [
    { text: "find & hire", brand: true },
    {
      text: "works differently. We verify every professional, learn what teams actually need, and connect the two directly — so the right match happens in days, not months.",
    },
  ],
];

export default function AgentIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const chars = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll(".reveal-char"),
        );
        gsap.set(chars, { opacity: 0.18 });
        gsap.to(chars, {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=150%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-black px-6 py-24 md:px-16"
    >
      <PixelBackdrop variant="grid" className="absolute inset-0 z-0" />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 xl:max-w-6xl 2xl:max-w-7xl">
        {PARAGRAPHS.map((segments, pi) => (
          <p
            key={pi}
            className="font-instrument text-2xl leading-snug font-medium text-white sm:text-3xl lg:text-5xl lg:leading-[1.25] xl:text-6xl 2xl:text-7xl 2xl:leading-[1.2]"
          >
            {segments.map((seg, si) =>
              seg.text.split(" ").map((word, wi) => (
                <span
                  key={`${si}-${wi}`}
                  className={`inline-block whitespace-nowrap ${seg.brand ? "text-brand" : ""}`}
                >
                  {word.split("").map((ch, ci) => (
                    <span key={ci} className="reveal-char">
                      {ch}
                    </span>
                  ))}
                  <span className="reveal-char">&nbsp;</span>
                </span>
              )),
            )}
          </p>
        ))}
      </div>
    </section>
  );
}
