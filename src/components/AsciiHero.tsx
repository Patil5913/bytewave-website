"use client";

import { useEffect, useRef } from "react";

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
  edgeAmount?: number;
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
};

const TRAIL_ALPHA = 1;
const TRAIL_PATH: [number, number][] = [
  [0.589, 0.342], [0.587, 0.359], [0.586, 0.368], [0.582, 0.375],
  [0.58, 0.39], [0.576, 0.407], [0.572, 0.428], [0.567, 0.44],
  [0.561, 0.453], [0.555, 0.475], [0.547, 0.502], [0.54, 0.525],
  [0.533, 0.553], [0.527, 0.543], [0.519, 0.585], [0.543, 0.569],
];
const PLANE_OFFSET_X = -2;
const PLANE_OFFSET_Y = 2;

const PLANE_PATH_D =
  "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";

function drawPlaneIcon(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 24;
  ctx.save();
  ctx.translate(-12 * s, -12 * s);
  ctx.scale(s, s);
  ctx.fill(new Path2D(PLANE_PATH_D));
  ctx.restore();
}

function contrastFactor(contrast: number) {
  const c = ((contrast - 100) / 100) * 255;
  return (259 * (c + 255)) / (255 * (259 - c));
}

type Cell = {
  r: number; g: number; b: number; char: string; trail: boolean; alpha: number;
};

export default function AsciiHero({
  src,
  className,
  config,
  rotateDeg = 0,
  fit = "cover",
  zoom = 1,
  plane = true,
}: AsciiHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellGrid = useRef<Cell[] | null>(null);
  const gridDims = useRef({ cols: 0, rows: 0 });
  const flickerRef = useRef<number | null>(null);

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
    edgeAmount: EDGE_AMOUNT = 0,
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

    const paintCell = (idx: number, factor: number, charOverride?: string) => {
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
      const drawChar = charOverride ?? cell.char;
      ctx.globalAlpha = Math.max(0, Math.min(1, cell.alpha * factor));
      ctx.fillStyle = `rgb(${cell.r | 0}, ${cell.g | 0}, ${cell.b | 0})`;
      ctx.fillText(drawChar, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
      ctx.globalAlpha = 1;
    };

    const buildGrid = () => {
      if (flickerRef.current !== null) {
        window.clearInterval(flickerRef.current);
        flickerRef.current = null;
      }
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
      const dh = (fit === "cover" ? Math.max(dhForW, dhForH) : Math.min(dhForW, dhForH)) * zoom;
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
      const boosted = new Uint8Array(n);

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const x0 = cx * CELL_SIZE;
          const y0 = cy * CELL_SIZE;
          const x1 = Math.min(x0 + CELL_SIZE, w);
          const y1 = Math.min(y0 + CELL_SIZE, h);
          let sr = 0, sg = 0, sb = 0, count = 0, maxLum = 0;
          for (let y = y0; y < y1; y += 1) {
            for (let x = x0; x < x1; x += 1) {
              const i = (y * w + x) * 4;
              sr += data[i]; sg += data[i + 1]; sb += data[i + 2];
              const pl = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
              if (pl > maxLum) maxLum = pl;
              count++;
            }
          }
          let r = adjust(count ? sr / count : 0);
          let g = adjust(count ? sg / count : 0);
          let b = adjust(count ? sb / count : 0);
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          r = avgSat(lum, r); g = avgSat(lum, g); b = avgSat(lum, b);

          const idx = cy * cols + cx;
          const brightW = Math.max(0, Math.min(1, (maxLum - TRAIL_PEAK) / (1 - TRAIL_PEAK)));
          const skyW = Math.max(0, Math.min(1, (TRAIL_AVG_MAX - lum / 255) / 0.15));

          rArr[idx] = r; gArr[idx] = g; bArr[idx] = b;
          lumArr[idx] = lum;
          trailStr[idx] = brightW * skyW;
        }
      }

      const edgeArr = new Float32Array(n);
      if (EDGE_AMOUNT > 0) {
        for (let cy = 0; cy < rows; cy++) {
          for (let cx = 0; cx < cols; cx++) {
            const idx = cy * cols + cx;
            const l = lumArr[idx];
            const lx = lumArr[cy * cols + Math.min(cols - 1, cx + 1)];
            const ly = lumArr[Math.min(rows - 1, cy + 1) * cols + cx];
            const gx = lx - l;
            const gy = ly - l;
            edgeArr[idx] = Math.min(1, Math.hypot(gx, gy) / 55);
          }
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
            // multiply, then lift toward white so the plane's symbols read bright
            const lift = (v: number) => {
              const m = Math.min(255, v * BOOST_AMOUNT);
              return m + (255 - m) * 0.45;
            };
            rArr[idx] = lift(rArr[idx]);
            gArr[idx] = lift(gArr[idx]);
            bArr[idx] = lift(bArr[idx]);
            lumArr[idx] = 0.299 * rArr[idx] + 0.587 * gArr[idx] + 0.114 * bArr[idx];
            boosted[idx] = 1;
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
        const e = EDGE_AMOUNT * edgeArr[idx];
        const vis = Math.min(1, nrm + e);
        const rampIdx = Math.min(
          CHAR_RAMP.length - 1,
          Math.floor(vis * CHAR_RAMP.length),
        );
        const mix = trailStr[idx];
        if (mix > 0.02) {
          grid[idx] = {
            r: rArr[idx] + (255 - rArr[idx]) * mix,
            g: gArr[idx] + (255 - gArr[idx]) * mix,
            b: bArr[idx] + (255 - bArr[idx]) * mix,
            char: mix > 0.5 ? CHAR_RAMP[CHAR_RAMP.length - 1] : CHAR_RAMP[rampIdx],
            trail: true,
            alpha: BASE_ALPHA + (TRAIL_ALPHA - BASE_ALPHA) * mix,
          };
        } else {
          // edges lift the glyph color toward white so shadow outlines (the
          // plane's wings/body against the sky) render even though they're dark
          const el = Math.min(1, e);
          grid[idx] = {
            r: rArr[idx] + (255 - rArr[idx]) * el,
            g: gArr[idx] + (255 - gArr[idx]) * el,
            b: bArr[idx] + (255 - bArr[idx]) * el,
            char: CHAR_RAMP[rampIdx],
            trail: false,
            alpha: boosted[idx]
              ? 1
              : BASE_ALPHA + (BRIGHT_ALPHA - BASE_ALPHA) * vis,
          };
        }
      }

      cellGrid.current = grid;
      gridDims.current = { cols, rows };

      for (let idx = 0; idx < n; idx++) paintCell(idx, 1);

      const planeRot = (-0.05 * 360 - 2) * (Math.PI / 180);
      const baseDirX = Math.SQRT1_2;
      const baseDirY = -Math.SQRT1_2;
      const dirX = baseDirX * Math.cos(planeRot) - baseDirY * Math.sin(planeRot);
      const dirY = baseDirX * Math.sin(planeRot) + baseDirY * Math.cos(planeRot);
      const travel = CELL_SIZE * 6;

      const [hxN, hyN] = TRAIL_PATH[0];
      const finalPx = hxN * w + PLANE_OFFSET_X;
      const finalPy = hyN * h + PLANE_OFFSET_Y;
      const startPx = finalPx - dirX * travel;
      const startPy = finalPy - dirY * travel;
      const iconRadius = CELL_SIZE * 2.4 * 0.8;
      const boxX0 = Math.min(finalPx, startPx) - iconRadius;
      const boxX1 = Math.max(finalPx, startPx) + iconRadius;
      const boxY0 = Math.min(finalPy, startPy) - iconRadius;
      const boxY1 = Math.max(finalPy, startPy) + iconRadius;
      const colMin = Math.max(0, Math.floor(boxX0 / CELL_SIZE));
      const colMax = Math.min(cols - 1, Math.ceil(boxX1 / CELL_SIZE));
      const rowMin = Math.max(0, Math.floor(boxY0 / CELL_SIZE));
      const rowMax = Math.min(rows - 1, Math.ceil(boxY1 / CELL_SIZE));

      const clearPlaneBox = () => {
        for (let cy = rowMin; cy <= rowMax; cy++) {
          for (let cx = colMin; cx <= colMax; cx++) {
            paintCell(cy * cols + cx, 1);
          }
        }
      };

      const drawPlane = (t: number) => {
        if (!plane) return;
        const back = travel * (1 - t);
        ctx.save();
        ctx.translate(finalPx - dirX * back, finalPy - dirY * back);
        ctx.rotate(planeRot);
        ctx.globalAlpha = t;
        ctx.fillStyle = "#ffffff";
        drawPlaneIcon(ctx, CELL_SIZE * 2.4);
        ctx.restore();
      };

      if (plane) {
        const planeDuration = 700;
        const planeT0 = performance.now();
        const planeTick = (now: number) => {
          if (destroyed) return;
          const raw = Math.min(1, (now - planeT0) / planeDuration);
          const eased = 1 - Math.pow(1 - raw, 3);
          clearPlaneBox();
          drawPlane(eased);
          if (raw < 1) requestAnimationFrame(planeTick);
        };
        requestAnimationFrame(planeTick);
      }

      const flickerId = window.setInterval(() => {
        if (destroyed) return;
        const grid = cellGrid.current;
        if (!grid) return;
        for (let k = 0; k < 5; k++) {
          const idx = (Math.random() * n) | 0;
          const cell = grid[idx];
          if (cell.char === " ") continue;
          const rampIdx = CHAR_RAMP.indexOf(cell.char);
          const jitter = Math.random() < 0.5 ? -1 : 1;
          const swapIdx = Math.max(0, Math.min(CHAR_RAMP.length - 1, rampIdx + jitter));
          const swapChar = CHAR_RAMP[swapIdx];
          paintCell(idx, 1, swapChar);
          window.setTimeout(() => {
            if (!destroyed) paintCell(idx, 1);
          }, 160);
        }
      }, 260);
      flickerRef.current = flickerId;
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
      if (flickerRef.current !== null) window.clearInterval(flickerRef.current);
    };
  }, [
    src, rotateDeg, fit, zoom, plane,
    CELL_SIZE, CONTRAST, BRIGHTNESS, SATURATION, BASE_ALPHA, BRIGHT_ALPHA,
    CHAR_RAMP, STRETCH_LO, STRETCH_HI, GAMMA, TRAIL_PEAK, TRAIL_AVG_MAX,
    EDGE_AMOUNT, BOOST_RECT, BOOST_AMOUNT,
  ]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="block h-full w-full bg-black" />
    </div>
  );
}
