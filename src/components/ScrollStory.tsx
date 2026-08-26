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

      // same behaviour at every width: pinned section, track slides with scroll
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
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

        const panels = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll("[data-story-panel]"),
        );
        const reveals = panels.map((panel) =>
          gsap.from(panel.querySelectorAll(":scope > div > *"), {
            opacity: 0,
            y: 28,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left 75%",
              once: true,
            },
          }),
        );

        return () => {
          reveals.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      // reduced motion: nothing pins, so the track must be swipeable
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const classes = [
          "snap-x",
          "snap-mandatory",
          "overflow-x-auto",
          "overscroll-x-contain",
        ];
        track.classList.add(...classes);
        return () => track.classList.remove(...classes);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative h-svh w-full overflow-hidden bg-canvas md:h-screen"
    >
      <div className="story-track flex h-full w-max flex-row [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PANELS.map((panel, pi) => (
          <div
            key={pi}
            data-story-panel
            className="flex h-full w-screen shrink-0 snap-center flex-col justify-center gap-6 px-6 pt-24 pb-12 max-sm:px-5 md:px-16 md:py-0"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 [&>*]:will-change-transform">
              <div className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
                <span className="tabular-nums text-brand">0{pi + 1}</span>
                {panel.eyebrow && <span>{panel.eyebrow}</span>}
              </div>
              <h2 className="font-instrument max-sm:text-3xl text-4xl leading-[1.05] font-medium text-balance text-ink sm:text-5xl lg:text-7xl xl:text-8xl">
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
