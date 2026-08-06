"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HOMEPAGE, splitBrand } from "@/lib/siteContent";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AgentIntro({
  content = HOMEPAGE,
}: {
  content?: typeof HOMEPAGE;
}) {
  const PARAGRAPHS = content.agentParagraphs.map((p) => splitBrand(p.text));
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
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 md:px-16"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 xl:max-w-6xl 2xl:max-w-7xl">
        {PARAGRAPHS.map((segments, pi) => (
          <p
            key={pi}
            className="font-instrument text-2xl leading-snug font-medium text-ink sm:text-3xl lg:text-5xl lg:leading-[1.25] xl:text-6xl 2xl:text-7xl 2xl:leading-[1.2]"
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
