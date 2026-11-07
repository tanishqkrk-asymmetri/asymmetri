"use client";

import { useEffect, useRef } from "react";

const RED = [205, 23, 23] as const;
const TAN = Math.tan((26 * Math.PI) / 180);

/**
 * The Careers hero field. A grid of identical white dashes (the template)
 * with a handful of red logo-angle slashes (the misfits). The pointer, or a
 * slow probe on touch screens, knocks dashes off axis and they spring back;
 * every so often a dash flips red for a moment, then relaxes.
 */
export function MisfitField({ reduce }: { reduce: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;
    // Pointer is read across the whole section, not just the canvas layer.
    const area: HTMLElement = canvas.closest("section") ?? host;

    let W = 0;
    let H = 0;
    let cell = 28;
    let cols = 0;
    let rows = 0;
    let ang = new Float32Array(0);
    let vel = new Float32Array(0);
    let heat = new Float32Array(0);
    let misfit = new Uint8Array(0);
    let raf = 0;
    // On screen and the tab is showing. Both are re-checked as they change, so
    // a page opened in a background tab still starts drawing when shown.
    let onScreen = true;
    let visible = true;
    let last = performance.now();
    let nextFlip = 0;
    let lastPointer = -1e9;
    const pointer = { x: -1e4, y: -1e4 };

    const seed = () => {
      misfit = new Uint8Array(cols * rows);
      const n = Math.max(6, Math.round(cols * rows * 0.012));
      for (let i = 0; i < n; i++) misfit[(Math.random() * cols * rows) | 0] = 1;
    };

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
      cell = W < 640 ? 24 : 30;
      cols = Math.ceil(W / cell) + 1;
      rows = Math.ceil(H / cell) + 1;
      ang = new Float32Array(cols * rows);
      vel = new Float32Array(cols * rows);
      heat = new Float32Array(cols * rows);
      seed();
      if (reduce) draw();
    };

    const slash = (x: number, y: number, h: number, w: number) => {
      // A parallelogram leaning at the logo's 26 degrees.
      const dx = (h / 2) * TAN;
      ctx.beginPath();
      ctx.moveTo(x - dx - w / 2, y + h / 2);
      ctx.lineTo(x - dx + w / 2, y + h / 2);
      ctx.lineTo(x + dx + w / 2, y - h / 2);
      ctx.lineTo(x + dx - w / 2, y - h / 2);
      ctx.closePath();
      ctx.fill();
    };

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const len = cell * 0.36;
      ctx!.lineWidth = 1;
      ctx!.lineCap = "butt";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = c * cell + cell / 2;
          const y = r * cell + cell / 2;
          if (misfit[i]) {
            ctx!.fillStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},0.95)`;
            slash(x - cell * 0.09, y, cell * 0.5, cell * 0.14);
            slash(x + cell * 0.13, y, cell * 0.5, cell * 0.05);
            continue;
          }
          const h = heat[i];
          const a = ang[i];
          const k = Math.min(1, Math.abs(a) / 1.1);
          if (h > 0.02) {
            ctx!.fillStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},${0.25 + h * 0.75})`;
            slash(x, y, cell * 0.42 * (0.6 + h * 0.4), cell * 0.1);
            continue;
          }
          const alpha = 0.22 + k * 0.55;
          ctx!.strokeStyle = `rgba(255,255,255,${alpha})`;
          const cx = Math.cos(a) * len * 0.5;
          const sy = Math.sin(a) * len * 0.5;
          ctx!.beginPath();
          ctx!.moveTo(x - cx, y - sy);
          ctx!.lineTo(x + cx, y + sy);
          ctx!.stroke();
        }
      }
    }

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (!visible) return;
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;

      // No pointer for a while (or touch): a slow probe keeps the field alive.
      let px = pointer.x;
      let py = pointer.y;
      if (now - lastPointer > 2500) {
        const t = now * 0.00018;
        px = W * (0.55 + 0.35 * Math.sin(t * 1.3));
        py = H * (0.45 + 0.3 * Math.sin(t * 2.1 + 1));
      }
      const R = Math.max(110, Math.min(W, H) * 0.2);

      const c0 = Math.max(0, Math.floor((px - R) / cell));
      const c1 = Math.min(cols - 1, Math.ceil((px + R) / cell));
      const r0 = Math.max(0, Math.floor((py - R) / cell));
      const r1 = Math.min(rows - 1, Math.ceil((py + R) / cell));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const x = c * cell + cell / 2;
          const y = r * cell + cell / 2;
          const dx = x - px;
          const dy = y - py;
          const d = Math.hypot(dx, dy);
          if (d > R) continue;
          const f = 1 - d / R;
          const i = r * cols + c;
          // Push toward pointing away from the cursor.
          const target = Math.atan2(dy, dx);
          let delta = target - ang[i];
          delta = Math.atan2(Math.sin(delta), Math.cos(delta));
          vel[i] += delta * f * f * 0.06 * dt;
        }
      }

      for (let i = 0; i < ang.length; i++) {
        // Spring back to flat, with damping.
        vel[i] += -ang[i] * 0.035 * dt;
        vel[i] *= Math.pow(0.86, dt);
        ang[i] += vel[i] * dt;
        if (heat[i] > 0) heat[i] = Math.max(0, heat[i] - 0.006 * dt);
      }

      if (now > nextFlip) {
        nextFlip = now + 280 + Math.random() * 520;
        heat[(Math.random() * heat.length) | 0] = 1;
        // Rarely, a misfit wanders to a new cell.
        if (Math.random() < 0.12) {
          const from = misfit.indexOf(1);
          if (from >= 0) {
            misfit[from] = 0;
            misfit[(Math.random() * misfit.length) | 0] = 1;
          }
        }
      }
      draw();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      lastPointer = performance.now();
    };
    const onLeave = () => {
      pointer.x = -1e4;
      pointer.y = -1e4;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const sync = () => {
      visible = onScreen && document.visibilityState === "visible";
      last = performance.now();
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    if (!reduce) {
      raf = requestAnimationFrame(step);
      area.addEventListener("pointermove", onMove);
      area.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block h-full w-full" />;
}
