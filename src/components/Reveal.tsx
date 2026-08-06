"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  y?: number;
  x?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
  scroll?: boolean;
  start?: string;
  once?: boolean;
} & Record<string, unknown>;

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
