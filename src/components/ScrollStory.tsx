"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HOMEPAGE, splitBrand } from "@/lib/siteContent";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Segment = { text: string; brand?: boolean };
type Panel = { eyebrow?: string; lines: Segment[][]; detail: string };

export default function ScrollStory({
  content = HOMEPAGE,
}: {
  content?: typeof HOMEPAGE;
}) {
  const PANELS: Panel[] = content.storyPanels.map((p) => ({
    eyebrow: p.eyebrow || undefined,
    lines: [[{ text: p.line1 }], splitBrand(p.line2 ?? "")],
    detail: p.detail,
  }));
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const track = root.querySelector<HTMLElement>(".story-track");
      if (!track) return;
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
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
        },
      );

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
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
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
              <p className="max-w-md text-base leading-relaxed text-ink/70 md:text-lg">
                {panel.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
