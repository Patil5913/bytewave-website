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

      const chars = () =>
        gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".reveal-char"));

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const c = chars();
          gsap.set(c, { opacity: 0.18 });
          gsap.to(c, {
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
        },
      );

      // phones: same word-by-word reveal, scrubbed while passing (no pin —
      // pinning a viewport-tall block on a small screen traps the scroll)
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const c = chars();
          gsap.set(c, { opacity: 0.18 });
          gsap.to(c, {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen max-sm:min-h-svh w-full flex-col justify-center overflow-hidden bg-canvas px-6 py-24 max-sm:px-5 max-sm:py-14 md:px-16"
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
