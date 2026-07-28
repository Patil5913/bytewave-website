"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Segment = { text: string; brand?: boolean };
type Panel = { eyebrow?: string; lines: Segment[][]; detail: string };

const PANELS: Panel[] = [
  {
    eyebrow: "The Shift",
    lines: [[{ text: "The résumé pile is where" }], [{ text: "good people disappear." }]],
    detail:
      "The average role draws 400+ applicants. Great candidates get buried under keywords, and teams settle for whoever surfaces first.",
  },
  {
    lines: [
      [{ text: "We replaced it with" }],
      [{ text: "proof", brand: true }, { text: " you can trust." }],
    ],
    detail:
      "Every professional is skill-verified before they enter the network — so what you see is demonstrated ability, not a self-reported list.",
  },
  {
    lines: [[{ text: "Real talent, matched" }], [{ text: "directly to real needs." }]],
    detail:
      "We connect verified people to the teams actively hiring for their exact strengths. Intros happen direct, and offers close in days.",
  },
];

export default function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const track = root.querySelector<HTMLElement>(".story-track");
      if (!track) return;
      const mm = gsap.matchMedia();

      // Desktop: pin + horizontal scrub. User scrolls through every panel
      // before the page continues to Recent Placements.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
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
      className="relative w-full overflow-hidden bg-canvas md:h-screen"
    >
      <div className="story-track flex flex-col md:h-screen md:w-max md:flex-row">
        {PANELS.map((panel, pi) => (
          <div
            key={pi}
            className="flex w-full shrink-0 flex-col justify-center gap-6 px-6 py-24 md:h-screen md:w-screen md:px-16 md:py-0"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
              <div className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
                <span className="tabular-nums text-brand">0{pi + 1}</span>
                {panel.eyebrow && <span>{panel.eyebrow}</span>}
              </div>
              <h2 className="font-instrument text-4xl leading-[1.05] font-medium text-balance text-ink sm:text-5xl lg:text-7xl xl:text-8xl">
                {panel.lines.map((line, li) => (
                  <span key={li} className="block">
                    {line.map((seg, si) =>
                      seg.brand ? (
                        <span key={si} className="text-brand">
                          {seg.text}
                        </span>
                      ) : (
                        <span key={si}>{seg.text}</span>
                      ),
                    )}
                  </span>
                ))}
              </h2>
              <p className="max-w-md text-base leading-relaxed text-ink/50 md:text-lg">
                {panel.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
