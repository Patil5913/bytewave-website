"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ResumeCard from "@components/ResumeCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Pile cards that drop in ON TOP of the main resume, then travel with it —
// straight, even offsets (no rotation/scatter) so the stack reads as organized.
const PILE_COUNT = 3;

// Static offsets for the tablet layout (no scroll animation).
const TABLET_PILE = [3, 6, 9]; // vertical % offset per card, back to front

function StaticPile({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {TABLET_PILE.map((y, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${y}%)` }}
        >
          <ResumeCard className="w-full" />
        </div>
      ))}
      <ResumeCard className="relative z-10 w-full" />
    </div>
  );
}

function ManifestoCopy() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <span className="text-xs font-medium tracking-widest text-white/50 uppercase">
          Why We Exist
        </span>
        <h2 className="font-instrument text-3xl leading-tight font-medium text-white sm:text-4xl xl:text-5xl">
          The traditional hiring loop is broken.
          <br />
          We built a better mechanism.
        </h2>
        <p className="max-w-[60ch] text-base leading-relaxed text-white/60 md:text-lg">
          Most staffing agencies rely on keyword matching and endless resume
          piles, frustrating companies and candidates alike. We see hiring as a
          matching problem — connecting real needs directly with a network of
          verified professionals, cutting out the noise.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 border-t border-white/10 pt-6 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-medium tracking-wider text-white uppercase">
            No Guesswork
          </h4>
          <p className="text-sm leading-snug text-white/50">
            Every match is backed by verified skills, not a keyword-stuffed
            resume.
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium tracking-wider text-white uppercase">
            Straight to the Point
          </h4>
          <p className="text-sm leading-snug text-white/50">
            Skip the application black hole and talk directly to the people
            making the hire.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Fonts loading after mount changes layout widths; recompute once ready
      // so the pinned intro measures/centres against the final layout.
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }

      const mq = gsap.matchMedia();

      mq.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const stack = root.current!.querySelector<HTMLElement>("#mf-stack")!;
          const slot = stack.parentElement!; // never transformed → stable to measure
          const piles = gsap.utils.toArray<HTMLElement>(".mf-pile");
          const copy = root.current!.querySelector<HTMLElement>("#mf-copy")!;

          // Scale so the whole portrait card fits the viewport HEIGHT (not
          // width) — otherwise the tall résumé overflows and only its top shows.
          // Measured off the untransformed slot/card so it survives pin refreshes.
          const bigScale = () => (window.innerHeight * 0.86) / stack.offsetHeight;
          const dx = () => {
            const r = slot.getBoundingClientRect();
            return window.innerWidth / 2 - (r.left + r.width / 2);
          };

          gsap.set(piles, {
            autoAlpha: 0,
            yPercent: -125,
            xPercent: 0,
            willChange: "transform, opacity",
            force3D: true,
          });
          gsap.set(copy, { autoAlpha: 0, x: 60, willChange: "transform, opacity" });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=2800",
              scrub: 0.5,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // 1. start full-screen-width & centered, then zoom OUT in place
          tl.fromTo(
            stack,
            {
              x: dx,
              y: 0,
              scale: bigScale,
              transformOrigin: "center center",
              willChange: "transform",
              force3D: true,
            },
            { x: dx, y: 0, scale: () => bigScale() * 0.5, duration: 1, immediateRender: true },
          );
          // 2. pile cards drop in on top, staggered, settling into an organized
          // stack (each peeking a little further below the one in front).
          tl.to(
            piles,
            {
              autoAlpha: 1,
              yPercent: (i: number) => 3 * (i + 1),
              duration: 1,
              stagger: 0.45,
            },
            ">-0.15",
          );
          // 3. whole stack settles into its natural left slot
          tl.to(stack, { x: 0, y: 0, scale: 1, duration: 1.4 }, ">-0.1");
          // 4. copy reveals on the right
          tl.to(copy, { autoAlpha: 1, x: 0, duration: 1 }, ">-0.7");
          // 5. hold so the finished composition rests before the pin releases
          tl.to({}, { duration: 0.9 });
          // drop will-change once settled so it doesn't pin GPU layers forever
          tl.set([stack, copy, ...piles], { willChange: "auto" });
        },
      );
    },
    { scope: root },
  );

  return (
    <>
      {/* Desktop: pinned cinematic sequence resolving into a static two-column. */}
      <section
        ref={root}
        id="manifesto"
        className="relative hidden min-h-screen w-full overflow-hidden border-t border-white/10 bg-black px-6 py-24 lg:block lg:px-16"
      >
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-7xl items-center justify-between gap-x-[8%]">
          <div className="flex shrink-0 justify-center">
            <div id="mf-stack" className="relative w-[20vw] xl:w-[16.5vw]">
              <ResumeCard className="w-full" />
              {Array.from({ length: PILE_COUNT }, (_, i) => (
                <div key={i} aria-hidden className="mf-pile absolute inset-0">
                  <ResumeCard className="w-full" />
                </div>
              ))}
            </div>
          </div>

          <div id="mf-copy" className="w-full max-w-2xl shrink-0">
            <ManifestoCopy />
          </div>
        </div>
      </section>

      {/* Tablet: static two-column, pile parked to the right. */}
      <section
        id="manifesto-t"
        className="relative hidden min-h-[110vh] w-full items-center gap-10 border-t border-white/10 bg-black px-10 py-32 md:flex lg:hidden"
      >
        <div className="w-[46%] max-w-xl">
          <ManifestoCopy />
        </div>
        <div className="flex flex-1 justify-end">
          <StaticPile className="w-[84%] min-w-[310px] max-w-[420px] translate-x-2" />
        </div>
      </section>

      {/* Mobile: static stacked layout. */}
      <section
        id="manifesto-m"
        className="relative flex min-h-screen w-full flex-col items-center gap-12 border-t border-white/10 bg-black px-6 py-24 md:hidden"
      >
        <ResumeCard className="w-52 shadow-2xl sm:w-60" />
        <ManifestoCopy />
      </section>
    </>
  );
}
