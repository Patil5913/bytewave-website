"use client";

import { useEffect, useRef, useState } from "react";

type Box = { x: number; y: number; w: number; h: number; r: number };

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const box = boxRef.current;
    const caret = caretRef.current;
    if (!box || !caret) return;

    const DOT = 12;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let visible = false;
    let raf = 0;

    const cur: Box = { x: px, y: py, w: DOT, h: DOT, r: 0 };
    const tgt: Box = { ...cur };

    let caretX = px;
    let caretY = py;
    let caretAng = 0;
    let lastPx = px;
    let lastPy = py;
    let idleF = 1;
    let svx = 0;
    let svy = 0;

    const computeTarget = () => {
      tgt.x = px - DOT / 2;
      tgt.y = py - DOT / 2;
      tgt.w = DOT;
      tgt.h = DOT;
      tgt.r = 0;
    };

    const GAP_X = DOT / 2 + 7;
    const GAP_Y = DOT / 2 - 1;

    const loop = () => {
      raf = requestAnimationFrame(loop);

      const vx = px - lastPx;
      const vy = py - lastPy;
      const speed = Math.hypot(vx, vy);
      lastPx = px;
      lastPy = py;
      idleF += ((speed < 0.4 ? 1 : 0) - idleF) * 0.12;

      svx += (vx - svx) * 0.2;
      svy += (vy - svy) * 0.2;
      const sSpeed = Math.hypot(svx, svy);

      const be = 0.09;
      cur.x += (tgt.x - cur.x) * be;
      cur.y += (tgt.y - cur.y) * be;
      cur.w += (tgt.w - cur.w) * be;
      cur.h += (tgt.h - cur.h) * be;
      cur.r += (tgt.r - cur.r) * be;
      box.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      box.style.width = `${cur.w}px`;
      box.style.height = `${cur.h}px`;
      box.style.borderRadius = `${cur.r}px`;

      const targetX = px + idleF * GAP_X;
      const targetY = py + idleF * GAP_Y;
      caretX += (targetX - caretX) * 0.65;
      caretY += (targetY - caretY) * 0.65;
      if (sSpeed > 1.5) {
        const target = (Math.atan2(svy, svx) * 180) / Math.PI;
        const delta = ((target - caretAng + 540) % 360) - 180;
        const k = Math.min(0.25, (sSpeed - 1.5) * 0.05);
        caretAng += delta * k;
      } else {
        caretAng += (0 - caretAng) * 0.1;
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
        caret.style.opacity = "1";
      }
      computeTarget();
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
    document.addEventListener("pointerout", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
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
