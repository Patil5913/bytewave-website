"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

export type AsciiConfig = {
  cellSize: number;
  contrast: number;
  brightness: number;
  saturation: number;
  baseAlpha: number;
  brightAlpha: number;
  charRamp: string;
  stretchLo: number;
  stretchHi: number;
  gamma: number;
  trailPeak: number;
  trailAvgMax: number;
  boostRect?: [number, number, number, number];
  boostAmount?: number;
};

export const DEFAULT_CONFIG: AsciiConfig = {
  cellSize: 8,
  contrast: 112,
  brightness: 16,
  saturation: 1.5,
  baseAlpha: 0.28,
  brightAlpha: 0.9,
  charRamp: " .·:-+=?7ctoe3#8",
  stretchLo: 0.015,
  stretchHi: 0.985,
  gamma: 0.6,
  trailPeak: 0.78,
  trailAvgMax: 0.5,
};

type AsciiHeroProps = {
  src: string;
  className?: string;
  config?: Partial<AsciiConfig>;
  rotateDeg?: number;
  fit?: "cover" | "contain";
  zoom?: number;
  plane?: boolean;
  debugPick?: boolean;
};

const TRAIL_ALPHA = 1;
const TRAIL_PATH: [number, number][] = [
  [0.589, 0.342],
  [0.587, 0.359],
  [0.586, 0.368],
  [0.582, 0.375],
  [0.58, 0.39],
  [0.576, 0.407],
  [0.572, 0.428],
  [0.567, 0.44],
  [0.561, 0.453],
  [0.555, 0.475],
  [0.547, 0.502],
  [0.54, 0.525],
  [0.533, 0.553],
  [0.527, 0.543],
  [0.519, 0.585],
  [0.543, 0.569],
];
const PLANE_GLYPH = "✈";
const PLANE_ROTATE_OFFSET = 0;

function contrastFactor(contrast: number) {
  const c = ((contrast - 100) / 100) * 255;
  return (259 * (c + 255)) / (255 * (259 - c));
}

type Cell = {
  r: number;
  g: number;
  b: number;
  char: string;
  trail: boolean;
  alpha: number;
};

export default function AsciiHero({
  src,
  className,
  config,
  rotateDeg = 0,
  fit = "cover",
  zoom = 1,
  plane = true,
  debugPick = false,
}: AsciiHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellGrid = useRef<Cell[] | null>(null);
  const gridDims = useRef({ cols: 0, rows: 0 });

  const {
    cellSize: CELL_SIZE,
    contrast: CONTRAST,
    brightness: BRIGHTNESS,
    saturation: SATURATION,
    baseAlpha: BASE_ALPHA,
    brightAlpha: BRIGHT_ALPHA,
    charRamp: CHAR_RAMP,
    stretchLo: STRETCH_LO,
    stretchHi: STRETCH_HI,
    gamma: GAMMA,
    trailPeak: TRAIL_PEAK,
    trailAvgMax: TRAIL_AVG_MAX,
    boostRect: BOOST_RECT,
    boostAmount: BOOST_AMOUNT = 2.6,
  } = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let destroyed = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    const paintCell = (idx: number, factor: number) => {
      const { cols } = gridDims.current;
      const grid = cellGrid.current;
      if (!grid) return;
      const cell = grid[idx];
      const cx = idx % cols;
      const cy = (idx / cols) | 0;
      const x = cx * CELL_SIZE;
      const y = cy * CELL_SIZE;
      ctx.fillStyle = "#000000";
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      if (cell.char === " ") return;
      ctx.globalAlpha = Math.max(0, Math.min(1, cell.alpha * factor));
      ctx.fillStyle = `rgb(${cell.r | 0}, ${cell.g | 0}, ${cell.b | 0})`;
      ctx.fillText(cell.char, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
      ctx.globalAlpha = 1;
    };

    const buildGrid = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${Math.ceil(CELL_SIZE * 1.15)}px "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;

      const theta = (rotateDeg * Math.PI) / 180;
      const ac = Math.abs(Math.cos(theta));
      const as = Math.abs(Math.sin(theta));
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const dhForW = w / (imgRatio * ac + as);
      const dhForH = h / (imgRatio * as + ac);
      const dh =
        (fit === "cover"
          ? Math.max(dhForW, dhForH)
          : Math.min(dhForW, dhForH)) * zoom;
      const dw = dh * imgRatio;
      offCtx.save();
      offCtx.translate(w / 2, h / 2);
      offCtx.rotate(theta);
      offCtx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      offCtx.restore();

      const { data } = offCtx.getImageData(0, 0, w, h);
      const cols = Math.ceil(w / CELL_SIZE);
      const rows = Math.ceil(h / CELL_SIZE);
      const n = cols * rows;
      const cFactor = contrastFactor(CONTRAST);
      const adjust = (v: number) =>
        Math.max(0, Math.min(255, cFactor * (v - 128) + 128 + BRIGHTNESS));
      const avgSat = (lum: number, ch: number) =>
        Math.max(0, Math.min(255, lum + (ch - lum) * SATURATION));

      const rArr = new Float32Array(n);
      const gArr = new Float32Array(n);
      const bArr = new Float32Array(n);
      const lumArr = new Float32Array(n);
      const trailStr = new Float32Array(n);

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const x0 = cx * CELL_SIZE;
          const y0 = cy * CELL_SIZE;
          const x1 = Math.min(x0 + CELL_SIZE, w);
          const y1 = Math.min(y0 + CELL_SIZE, h);
          let sr = 0,
            sg = 0,
            sb = 0,
            count = 0,
            maxLum = 0;
          for (let y = y0; y < y1; y += 1) {
            for (let x = x0; x < x1; x += 1) {
              const i = (y * w + x) * 4;
              sr += data[i];
              sg += data[i + 1];
              sb += data[i + 2];
              const pl =
                (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) /
                255;
              if (pl > maxLum) maxLum = pl;
              count++;
            }
          }
          let r = adjust(count ? sr / count : 0);
          let g = adjust(count ? sg / count : 0);
          let b = adjust(count ? sb / count : 0);
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          r = avgSat(lum, r);
          g = avgSat(lum, g);
          b = avgSat(lum, b);

          const idx = cy * cols + cx;
          const brightW = Math.max(
            0,
            Math.min(1, (maxLum - TRAIL_PEAK) / (1 - TRAIL_PEAK)),
          );
          const skyW = Math.max(
            0,
            Math.min(1, (TRAIL_AVG_MAX - lum / 255) / 0.15),
          );

          rArr[idx] = r;
          gArr[idx] = g;
          bArr[idx] = b;
          lumArr[idx] = lum;
          trailStr[idx] = brightW * skyW;
        }
      }

      if (BOOST_RECT) {
        const [bx, by, bw, bh] = BOOST_RECT;
        for (let cy = 0; cy < rows; cy++) {
          for (let cx = 0; cx < cols; cx++) {
            const nx = (cx + 0.5) / cols;
            const ny = (cy + 0.5) / rows;
            if (nx < bx || nx > bx + bw || ny < by || ny > by + bh) continue;
            const idx = cy * cols + cx;
            rArr[idx] = Math.min(255, rArr[idx] * BOOST_AMOUNT);
            gArr[idx] = Math.min(255, gArr[idx] * BOOST_AMOUNT);
            bArr[idx] = Math.min(255, bArr[idx] * BOOST_AMOUNT);
            lumArr[idx] = Math.min(255, lumArr[idx] * BOOST_AMOUNT);
          }
        }
      }

      const sorted = Float32Array.from(lumArr).sort();
      const lo = sorted[Math.floor(STRETCH_LO * (n - 1))];
      const hi = sorted[Math.floor(STRETCH_HI * (n - 1))];
      const span = Math.max(1e-3, hi - lo);

      const grid: Cell[] = new Array(n);
      for (let idx = 0; idx < n; idx++) {
        let nrm = (lumArr[idx] - lo) / span;
        nrm = Math.max(0, Math.min(1, nrm));
        nrm = Math.pow(nrm, GAMMA);
        const rampIdx = Math.min(
          CHAR_RAMP.length - 1,
          Math.floor(nrm * CHAR_RAMP.length),
        );
        const mix = trailStr[idx];
        if (mix > 0.02) {
          grid[idx] = {
            r: rArr[idx] + (255 - rArr[idx]) * mix,
            g: gArr[idx] + (255 - gArr[idx]) * mix,
            b: bArr[idx] + (255 - bArr[idx]) * mix,
            char:
              mix > 0.5 ? CHAR_RAMP[CHAR_RAMP.length - 1] : CHAR_RAMP[rampIdx],
            trail: true,
            alpha: BASE_ALPHA + (TRAIL_ALPHA - BASE_ALPHA) * mix,
          };
        } else {
          grid[idx] = {
            r: rArr[idx],
            g: gArr[idx],
            b: bArr[idx],
            char: CHAR_RAMP[rampIdx],
            trail: false,
            alpha: BASE_ALPHA + (BRIGHT_ALPHA - BASE_ALPHA) * nrm,
          };
        }
      }

      cellGrid.current = grid;
      gridDims.current = { cols, rows };

      for (let idx = 0; idx < n; idx++) paintCell(idx, 1);

      if (plane) {
        const [hxN, hyN] = TRAIL_PATH[0];
        let tail = TRAIL_PATH[0];
        for (const p of TRAIL_PATH) if (p[1] > tail[1]) tail = p;
        const ang =
          Math.atan2(hyN - tail[1], hxN - tail[0]) + PLANE_ROTATE_OFFSET;
        ctx.save();
        ctx.translate(hxN * w, hyN * h);
        ctx.rotate(ang);
        ctx.globalAlpha = BASE_ALPHA;
        ctx.fillStyle = "#ffffff";
        ctx.font = `${Math.ceil(CELL_SIZE * 2.4)}px "Courier New", monospace`;
        ctx.fillText(PLANE_GLYPH, 0, 0);
        ctx.restore();
      }
    };

    const start = () => {
      if (destroyed) return;
      buildGrid();
    };

    if (img.complete && img.naturalWidth) start();
    else img.onload = start;

    const resizeObserver = new ResizeObserver(() => {
      if (img.naturalWidth) buildGrid();
    });
    resizeObserver.observe(container);

    return () => {
      destroyed = true;
      resizeObserver.disconnect();
    };
  }, [
    src,
    rotateDeg,
    fit,
    zoom,
    plane,
    CELL_SIZE,
    CONTRAST,
    BRIGHTNESS,
    SATURATION,
    BASE_ALPHA,
    BRIGHT_ALPHA,
    CHAR_RAMP,
    STRETCH_LO,
    STRETCH_HI,
    GAMMA,
    TRAIL_PEAK,
    TRAIL_AVG_MAX,
    BOOST_RECT,
    BOOST_AMOUNT,
  ]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="block h-full w-full bg-black" />
      {debugPick && <DebugPicker containerRef={containerRef} />}
    </div>
  );
}

function DebugPicker({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const [box, setBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const rel = (e: React.MouseEvent) => {
    const r = containerRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  };

  const onDown = (e: React.MouseEvent) => {
    start.current = rel(e);
    setBox({ ...start.current, w: 0, h: 0 });
  };
  const onMove = (e: React.MouseEvent) => {
    if (!start.current) return;
    const p = rel(e);
    setBox({
      x: Math.min(start.current.x, p.x),
      y: Math.min(start.current.y, p.y),
      w: Math.abs(p.x - start.current.x),
      h: Math.abs(p.y - start.current.y),
    });
  };
  const onUp = () => {
    if (!start.current || !box) return;
    start.current = null;
  };

  return (
    <div
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      className="absolute inset-0 z-50 cursor-crosshair select-none"
      title="drag a box over the plane (see console for boostRect)"
    >
      {box && (
        <div
          className="absolute border-2 border-brand bg-brand/15"
          style={{
            left: `${box.x * 100}%`,
            top: `${box.y * 100}%`,
            width: `${box.w * 100}%`,
            height: `${box.h * 100}%`,
          }}
        />
      )}
    </div>
  );
}
