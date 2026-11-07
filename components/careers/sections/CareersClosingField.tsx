"use client";

import { useEffect, useRef, type RefObject } from "react";

const GAP = 22; // grid pitch, CSS px
const LEN = 9; // dash length
const SLASH = (-26 * Math.PI) / 180; // the logo's slash, from vertical
const RADIUS = 150; // how far the misfit's wake reaches

/**
 * A field of identical dashes on red. One misfit (the white slash) moves
 * through it toward the pointer, and every dash it passes breaks rank and
 * tilts to its angle for a moment before settling back.
 *
 * Canvas only; decorative (aria-hidden). Pauses off screen and when the tab
 * is hidden. Reduced motion draws one still frame.
 */
export function CareersClosingField({
  hostRef,
  reduce,
}: {
  hostRef: RefObject<HTMLElement | null>;
  reduce: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    // Per-dash tilt (0 = upright dash, 1 = fully a slash), eased over time.
    let tilt = new Float32Array(0);
    const misfit = { x: 0, y: 0 };
    const target = { x: 0, y: 0, active: false };
    let raf = 0;
    let visible = false;
    const t0 = performance.now();

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP) + 1;
      rows = Math.ceil(h / GAP) + 1;
      tilt = new Float32Array(cols * rows);
      if (!misfit.x) {
        misfit.x = w * 0.72;
        misfit.y = h * 0.3;
      }
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      // Idle: wander on a slow figure-eight. Pointer: chase it.
      const tx = target.active ? target.x : w * (0.5 + 0.34 * Math.sin(t * 0.23));
      const ty = target.active ? target.y : h * (0.42 + 0.26 * Math.sin(t * 0.46));
      misfit.x += (tx - misfit.x) * 0.06;
      misfit.y += (ty - misfit.y) * 0.06;

      ctx.clearRect(0, 0, w, h);
      const ox = (w - (cols - 1) * GAP) / 2;
      const oy = (h - (rows - 1) * GAP) / 2;

      ctx.lineCap = "square";
      // Upright dashes in one path; tilted ones in a brighter second path.
      ctx.beginPath();
      const tilted: number[] = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const x = ox + i * GAP;
          const y = oy + j * GAP;
          const d = Math.hypot(x - misfit.x, y - misfit.y);
          const pull = d < RADIUS ? 1 - d / RADIUS : 0;
          tilt[k] += (Math.max(pull * pull, tilt[k] * 0.9) - tilt[k]) * 0.18;
          const a = tilt[k];
          if (a > 0.04) {
            tilted.push(x, y, a);
            continue;
          }
          ctx.moveTo(x, y - LEN / 2);
          ctx.lineTo(x, y + LEN / 2);
        }
      }
      ctx.strokeStyle = "rgba(0,0,0,0.28)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      for (let n = 0; n < tilted.length; n += 3) {
        const x = tilted[n];
        const y = tilted[n + 1];
        const a = tilted[n + 2];
        // Lean right at the top, like the logo slash.
        const ang = -SLASH * a;
        const len = LEN * (1 + a * 0.6);
        const dx = Math.sin(ang) * (len / 2);
        const dy = Math.cos(ang) * (len / 2);
        ctx.beginPath();
        ctx.moveTo(x - dx, y + dy);
        ctx.lineTo(x + dx, y - dy);
        ctx.strokeStyle = `rgba(0,0,0,${0.28 + a * 0.6})`;
        ctx.lineWidth = 1.5 + a * 1.5;
        ctx.stroke();
      }

      // The misfit: a thick white slash with its thin partner, like the logo.
      ctx.save();
      ctx.translate(misfit.x, misfit.y);
      ctx.transform(1, 0, Math.tan(SLASH), 1, 0, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-9, -16, 10, 32);
      ctx.fillRect(4, -16, 4, 32);
      ctx.restore();
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || raf || !visible || document.visibilityState !== "visible") return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      target.active = true;
    };
    const onLeave = () => {
      target.active = false;
    };

    resize();
    draw(performance.now());

    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) draw(performance.now());
    });
    ro.observe(host);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(host);
    const onVis = () => (document.visibilityState === "visible" ? start() : stop());
    document.addEventListener("visibilitychange", onVis);
    if (!reduce) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [hostRef, reduce]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 block" />;
}
