"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  'a, button, [role="button"], select, label, input, textarea, .cursor-target';

type Box = { x: number; y: number; w: number; h: number; r: number };

/**
 * Modern magnetic cursor. Idle it's a small dot that trails the pointer; over
 * an interactive element it morphs into a rounded highlight that wraps the
 * element itself (position + size + radius glide toward the target). Colours
 * come from theme tokens. Disabled on touch / reduced-motion.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const box = boxRef.current;
    const caret = caretRef.current;
    if (!box || !caret) return;

    const DOT = 12; // idle square size
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let hovered: Element | null = null;
    let visible = false;
    let raf = 0;

    // current (rendered) + target box
    const cur: Box = { x: px, y: py, w: DOT, h: DOT, r: 0 };
    const tgt: Box = { ...cur };

    // caret leads at the pointer while moving; on idle it settles beside the
    // square. `idleF` (0 moving → 1 idle) blends the two behaviours.
    let caretX = px;
    let caretY = py;
    let caretAng = 0;
    let lastPx = px;
    let lastPy = py;
    let idleF = 1;

    const computeTarget = () => {
      if (hovered) {
        const rect = hovered.getBoundingClientRect();
        const pad = 4;
        tgt.x = rect.left - pad;
        tgt.y = rect.top - pad;
        tgt.w = rect.width + pad * 2;
        tgt.h = rect.height + pad * 2;
        tgt.r = 0; // sharp corners
      } else {
        // square trails the pointer while moving, catches up when idle
        tgt.x = px - DOT / 2;
        tgt.y = py - DOT / 2;
        tgt.w = DOT;
        tgt.h = DOT;
        tgt.r = 0;
      }
    };

    const GAP_X = DOT / 2 + 7; // idle caret offset beside the square
    const GAP_Y = DOT / 2 - 1;

    const loop = () => {
      raf = requestAnimationFrame(loop);

      // pointer velocity -> idle blend (1 = still, 0 = moving)
      const vx = px - lastPx;
      const vy = py - lastPy;
      const speed = Math.hypot(vx, vy);
      lastPx = px;
      lastPy = py;
      idleF += ((speed < 0.4 ? 1 : 0) - idleF) * 0.12;

      // square: slow lerp so it lags behind the caret while moving, and lands
      // on the pointer when idle (becomes the main mark).
      const be = hovered ? 0.2 : 0.09;
      cur.x += (tgt.x - cur.x) * be;
      cur.y += (tgt.y - cur.y) * be;
      cur.w += (tgt.w - cur.w) * be;
      cur.h += (tgt.h - cur.h) * be;
      cur.r += (tgt.r - cur.r) * be;
      box.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      box.style.width = `${cur.w}px`;
      box.style.height = `${cur.h}px`;
      box.style.borderRadius = `${cur.r}px`;

      // caret: leads at the pointer while moving, eases beside the square idle.
      const targetX = px + idleF * GAP_X;
      const targetY = py + idleF * GAP_Y;
      caretX += (targetX - caretX) * 0.65;
      caretY += (targetY - caretY) * 0.65;
      if (speed > 0.6) {
        caretAng = (Math.atan2(vy, vx) * 180) / Math.PI;
      } else {
        // ease back to horizontal when settling
        caretAng += (0 - caretAng) * 0.15;
      }
      caret.style.transform = `translate3d(${caretX}px, ${caretY}px, 0) translate(-50%, -50%) rotate(${caretAng}deg)`;
      caret.dataset.moving = idleF < 0.5 ? "true" : "false";
    };

    const onMove = (ev: PointerEvent) => {
      px = ev.clientX;
      py = ev.clientY;
      if (!visible) {
        visible = true;
        box.style.opacity = "1";
      }
      const el = (ev.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      if (el !== hovered) {
        hovered = el;
        box.dataset.state = el ? "target" : "default";
      }
      // caret fades out as the box expands into the overlay (feels absorbed);
      // fades back in when returning to idle.
      caret.style.opacity = !hovered && visible ? "1" : "0";
      computeTarget();
    };

    const onScroll = () => {
      if (hovered) computeTarget();
    };
    const onLeave = (ev: PointerEvent) => {
      if (ev.relatedTarget === null) {
        visible = false;
        box.style.opacity = "0";
        caret.style.opacity = "0";
      }
    };

    box.style.opacity = "0";
    caret.style.opacity = "0";
    box.dataset.state = "default";
    computeTarget();
    cur.x = tgt.x;
    cur.y = tgt.y;
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("pointerout", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
      document.removeEventListener("pointerout", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={boxRef}
        aria-hidden
        className="cursor-box pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ willChange: "transform, width, height" }}
      />
      {/* blinking brand underscore beside the idle square. Outer wrapper owns
          position + the fade (so it dissolves into the overlay on hover);
          inner owns the blink so the two animations don't fight. */}
      <div
        ref={caretRef}
        aria-hidden
        className="cursor-caret pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-300 ease-out"
        style={{ willChange: "transform, opacity" }}
      >
        <span className="block h-0.5 w-2.5 bg-brand" />
      </div>
    </>
  );
}
