"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  /** Rendered element/tag. Default "div". */
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Vertical offset to animate in from. Default 24. */
  y?: number;
  x?: number;
  delay?: number;
  duration?: number;
  /** When set, stagger the direct children instead of the wrapper. */
  stagger?: number;
  /** Reveal on scroll (default) or immediately on mount (false). */
  scroll?: boolean;
  start?: string;
  once?: boolean;
} & Record<string, unknown>;

/**
 * GSAP-powered reveal. Replaces the framer-motion `whileInView` fade-up
 * pattern used across the site. Honours prefers-reduced-motion (content is
 * simply left visible). Use `stagger` to sequence direct children,
 * `scroll={false}` for on-load entrances (hero, navbar).
 */
export default function Reveal({
  as = "div",
  children,
  className,
  y = 24,
  x = 0,
  delay = 0,
  duration = 0.7,
  stagger,
  scroll = true,
  start = "top 85%",
  once = true,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets =
          stagger != null ? gsap.utils.toArray<HTMLElement>(el.children) : el;
        const vars: gsap.TweenVars = {
          opacity: 0,
          y,
          x,
          duration,
          ease: "power3.out",
        };
        if (stagger != null) vars.stagger = stagger;
        if (scroll) {
          vars.scrollTrigger = { trigger: el, start, once };
        } else {
          vars.delay = delay;
        }
        gsap.from(targets, vars);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return createElement(as, { ref, className, ...rest }, children);
}
