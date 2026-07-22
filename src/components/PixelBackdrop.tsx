"use client";

import { useEffect, useRef } from "react";

export type PixelVariant = "grid" | "dots" | "scan" | "glow";

type PixelBackdropProps = {
  variant?: PixelVariant;
  className?: string;
  /** 0..1 overall opacity of the motif. Default 1. */
  intensity?: number;
};

const CELL = 22; // px between grid nodes
const EMERALD = "255, 255, 255"; // neutral white — kept subtle/ambient
const FRAME_MS = 1000 / 30; // cap canvas variants at ~30fps

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * On-brand ascii/pixel backdrop.
 * `grid` + `glow` are pure CSS (zero runtime cost — used site-wide).
 * `dots` + `scan` use a throttled canvas that ONLY runs while on screen
 * (IntersectionObserver-gated) so stacked sections don't all animate at once.
 * All decorative + aria-hidden.
 */
export default function PixelBackdrop({
  variant = "grid",
  className,
  intensity = 1,
}: PixelBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant === "glow" || variant === "grid") return; // CSS-only variants

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let raf = 0;
    let last = 0;
    let visible = false;
    let cols = 0;
    let rows = 0;
    let phase = new Float32Array(0);

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr());
      canvas.height = Math.round(h * dpr());
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      phase = new Float32Array(cols * rows);
      for (let i = 0; i < phase.length; i++)
        phase[i] = Math.random() * Math.PI * 2;
    };

    const paint = (t: number) => {
      const w = canvas.width / dpr();
      const h = canvas.height / dpr();
      ctx.clearRect(0, 0, w, h);

      if (variant === "dots") {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = y * cols + x;
            const tw = reduced
              ? 0.5
              : 0.5 + 0.5 * Math.sin(t * 0.0015 + phase[i]);
            if (tw < 0.72) continue;
            const a = (tw - 0.72) / 0.28;
            const emerald = i % 11 === 0;
            ctx.fillStyle = emerald
              ? `rgba(${EMERALD},${0.5 * a * intensity})`
              : `rgba(255,255,255,${0.35 * a * intensity})`;
            ctx.fillRect(x * CELL, y * CELL, 2, 2);
          }
        }
      } else if (variant === "scan") {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            ctx.fillStyle = `rgba(255,255,255,${0.035 * intensity})`;
            ctx.fillRect(x * CELL, y * CELL, 1.5, 1.5);
          }
        }
        if (!reduced) {
          const sweep = ((t * 0.05) % (h + 160)) - 80;
          const grad = ctx.createLinearGradient(0, sweep - 60, 0, sweep + 60);
          grad.addColorStop(0, `rgba(${EMERALD},0)`);
          grad.addColorStop(0.5, `rgba(${EMERALD},${0.06 * intensity})`);
          grad.addColorStop(1, `rgba(${EMERALD},0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, sweep - 60, w, 120);
        }
      }
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < FRAME_MS) return;
      last = t;
      paint(t);
    };

    const start = () => {
      if (raf) return;
      if (reduced) {
        paint(0); // single static frame
        return;
      }
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();

    // Only animate while the section is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "100px" },
    );
    io.observe(container);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduced && visible) paint(0);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [variant, intensity]);

  if (variant === "glow") {
    return (
      <div
        aria-hidden
        className={`pointer-events-none ${className ?? ""}`}
        style={{
          background: `radial-gradient(60% 55% at 50% 45%, rgba(${EMERALD},${0.08 * intensity}) 0%, rgba(${EMERALD},0) 70%)`,
        }}
      />
    );
  }

  if (variant === "grid") {
    // Pure CSS dotted grid — no canvas, no rAF.
    return (
      <div
        aria-hidden
        className={`pointer-events-none ${className ?? ""}`}
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,${0.05 * intensity}) 1px, transparent 1px)`,
          backgroundSize: `${CELL}px ${CELL}px`,
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`pointer-events-none ${className ?? ""}`}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
