"use client";

import { useEffect, useRef, type RefObject } from "react";

const RED = "#cd1717";
const SKEW = Math.tan((26 * Math.PI) / 180);

type Props = {
  /** Element the field covers and listens to (pointer, size, scroll). */
  hostRef: RefObject<HTMLElement | null>;
  /** The white strip at the top that floods red as the chapter arrives. */
  floodRef: RefObject<HTMLElement | null>;
  /** Called a few times a second with how many marks are currently broken. */
  onCount?: (broken: number, total: number) => void;
  reduce: boolean;
};

/**
 * The finale's field. A white strip continues the FAQ above; as the chapter
 * arrives it floods red cell by cell, in a front leaning at the logo's slash
 * angle. Then every cell carries a symmetric "+". Anything that passes over
 * it (the cursor, a finger, or a slow probe when nobody is moving) breaks the
 * symmetry: the "+" becomes the logo's double slash, then slowly relaxes back.
 */
export function SymmetryField({ hostRef, floodRef, onCount, reduce }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef(onCount);
  useEffect(() => {
    countRef.current = onCount;
  }, [onCount]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas || !ctx) return;

    let W = 0;
    let H = 0;
    let cell = 30;
    let cols = 0;
    let rows = 0;
    let floodH = 0;
    let floodRows = 0;
    let energy = new Float32Array(0);
    let raf = 0;
    let visible = false;
    let frame = 0;
    let lastPointer = -1e9;
    const pointer = { x: -1e4, y: -1e4, active: false };

    const resize = () => {
      const r = host.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = W < 640 ? 24 : 32;
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      floodH = floodRef.current?.offsetHeight ?? 0;
      floodRows = Math.ceil(floodH / cell);
      energy = new Float32Array(cols * rows);
      if (reduce) {
        // Static: one band of broken symmetry along the slash angle.
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++) {
            const d = Math.abs(c - (cols * 0.72 - (r - floodRows) * SKEW * 1.6));
            energy[r * cols + c] = Math.max(0, 1 - d / 4);
          }
        draw(1);
      }
    };

    const inject = (x: number, y: number, radius: number) => {
      const c0 = Math.max(0, Math.floor((x - radius) / cell));
      const c1 = Math.min(cols - 1, Math.ceil((x + radius) / cell));
      const r0 = Math.max(0, Math.floor((y - radius) / cell));
      const r1 = Math.min(rows - 1, Math.ceil((y + radius) / cell));
      for (let r = r0; r <= r1; r++)
        for (let c = c0; c <= c1; c++) {
          const dx = (c + 0.5) * cell - x;
          const dy = (r + 0.5) * cell - y;
          const t = 1 - Math.hypot(dx, dy) / radius;
          if (t <= 0) continue;
          const v = t * t * (3 - 2 * t);
          const i = r * cols + c;
          if (v > energy[i]) energy[i] = v;
        }
    };

    /** Flood progress 0..1 from where the host sits in the viewport. */
    const floodProgress = () => {
      if (reduce) return 1;
      const top = host.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const enter = (vh - top) / vh; // 0 when the top is at the bottom edge
      return Math.min(Math.max((enter - 0.12) / 0.78, 0), 1);
    };

    const draw = (P: number) => {
      ctx.clearRect(0, 0, W, H);
      // The front runs corner to corner of the strip, rising to the right
      // like the slash, so the white leaves as one diagonal.
      const lean = floodRows / Math.max(cols, 1);
      const span = floodRows * 2 + 3;
      const filled = (r: number, c: number) => {
        if (r >= floodRows) return 1;
        const d = floodRows - 1 - r + (cols - 1 - c) * lean;
        return Math.min(Math.max((P * span - d) / 3, 0), 1);
      };

      // 1. The flood: white sheet, red squares growing out of each cell.
      if (P < 1 && floodRows > 0) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, floodH);
        ctx.fillStyle = RED;
        for (let r = 0; r < floodRows; r++)
          for (let c = 0; c < cols; c++) {
            const t = filled(r, c);
            if (t <= 0) continue;
            const s = t >= 1 ? cell + 1 : t * cell;
            const cx = (c + 0.5) * cell;
            const cy = (r + 0.5) * cell;
            ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
          }
      }

      // 2. Resting marks: symmetric plus signs, batched into one path.
      const arm = cell * 0.13;
      ctx.beginPath();
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          if (energy[r * cols + c] > 0.35 || filled(r, c) < 1) continue;
          const cx = (c + 0.5) * cell;
          const cy = (r + 0.5) * cell;
          ctx.rect(cx - arm, cy - 0.5, arm * 2, 1);
          ctx.rect(cx - 0.5, cy - arm, 1, arm * 2);
        }
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fill();

      // 3. Broken marks: the double slash, white, black at full strength.
      let broken = 0;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const e = energy[r * cols + c];
          if (e < 0.04 || filled(r, c) < 1) continue;
          if (e > 0.5) broken++;
          const h = cell * (0.3 + 0.42 * e);
          const off = h * SKEW;
          const w1 = cell * 0.17;
          const w2 = cell * 0.06;
          const gap = cell * 0.07;
          const x0 = (c + 0.5) * cell - (off + w1 + gap + w2) / 2;
          const yb = (r + 0.5) * cell + h / 2;
          ctx.globalAlpha = Math.min(1, e * 1.3);
          ctx.fillStyle = e > 0.82 ? "#000000" : "#ffffff";
          ctx.beginPath();
          ctx.moveTo(x0, yb);
          ctx.lineTo(x0 + off, yb - h);
          ctx.lineTo(x0 + off + w1, yb - h);
          ctx.lineTo(x0 + w1, yb);
          const x1 = x0 + w1 + gap;
          ctx.moveTo(x1, yb);
          ctx.lineTo(x1 + off, yb - h);
          ctx.lineTo(x1 + off + w2, yb - h);
          ctx.lineTo(x1 + w2, yb);
          ctx.fill();
        }
      ctx.globalAlpha = 1;
      return broken;
    };

    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      // Nobody moving for a while: a slow probe keeps the field alive.
      if (now - lastPointer > 2600) {
        const t = now / 1000;
        // An orbit around the edges, so the copy in the middle stays calm.
        const a = t * 0.5;
        const wob = 1 + 0.06 * Math.sin(t * 1.7);
        const px = W * (0.5 + 0.44 * wob * Math.cos(a));
        const py = floodH + (H - floodH) * (0.5 + 0.42 * wob * Math.sin(a));
        inject(px, py, cell * 2.8);
      } else if (pointer.active) {
        inject(pointer.x, pointer.y, cell * 4.5);
      }
      for (let i = 0; i < energy.length; i++) energy[i] *= 0.968;
      const broken = draw(floodProgress());
      if (++frame % 8 === 0) countRef.current?.(broken, cols * rows);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
      lastPointer = performance.now();
      if (reduce) return;
      inject(pointer.x, pointer.y, cell * 4.5);
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(host);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [hostRef, floodRef, reduce]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 block" />;
}
