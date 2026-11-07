"use client";

import { useEffect, useRef, type RefObject } from "react";

const RED = "#cd1717";
const SKEW = Math.tan((26 * Math.PI) / 180);

type Props = {
  /** 0 to 1: how complete the brief is. Read every frame, so pass a ref. */
  clarityRef: RefObject<number>;
  /** performance.now() of a successful send, 0 until then. */
  burstRef: RefObject<number>;
  reduce: boolean;
  className?: string;
};

const smooth = (v: number) => v * v * (3 - 2 * v);
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/**
 * The contact hero's field. Many noisy waveforms, one per "voice". As the
 * visitor fills in the brief the noise drains out and the lines converge on
 * a single clean red carrier. When the brief is sent the carrier collapses
 * into the logo's double slash and the screen flashes once.
 */
export function SignalField({ clarityRef, burstRef, reduce, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    let W = 0;
    let H = 0;
    let N = 20;
    let raf = 0;
    let visible = true;
    let c = 0; // smoothed clarity
    let lastDrawnC = -1;
    const start = performance.now();
    const pointer = { x: -1e4, y: -1e4, energy: 0 };

    // Per-line noise signature, fixed per mount.
    const seeds = Array.from({ length: 32 }, (_, i) => {
      const r = (k: number) => Math.abs(Math.sin(i * 127.1 + k * 311.7) * 43758.5453) % 1;
      return {
        f1: 0.018 + r(1) * 0.03,
        f2: 0.045 + r(2) * 0.05,
        f3: 0.09 + r(3) * 0.06,
        s1: 0.6 + r(4) * 1.4,
        s2: 1.2 + r(5) * 2.2,
        p1: r(6) * Math.PI * 2,
        p2: r(7) * Math.PI * 2,
        spike: r(8),
      };
    });

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
      N = W < 640 ? 14 : 22;
      lastDrawnC = -1;
    };

    // Where the lines converge: behind the headline on desktop, near the top on phones.
    const carrierY = () => (W < 1024 ? Math.min(H * 0.22, 300) : H * 0.56);
    const spreadTop = () => (W < 1024 ? 70 : H * 0.12);
    const spreadBottom = () => (W < 1024 ? Math.min(H * 0.55, 760) : H * 0.94);

    const drawSlash = (cx: number, cy: number, scale: number, alpha: number) => {
      if (scale <= 0 || alpha <= 0) return;
      const h = 120 * scale * (W < 640 ? 0.7 : 1);
      const w1 = h * 0.3;
      const w2 = h * 0.11;
      const gap = h * 0.07;
      const off = h * SKEW;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = RED;
      const para = (x: number, w: number) => {
        ctx.beginPath();
        ctx.moveTo(x + off / 2, cy - h / 2);
        ctx.lineTo(x + off / 2 + w, cy - h / 2);
        ctx.lineTo(x - off / 2 + w, cy + h / 2);
        ctx.lineTo(x - off / 2, cy + h / 2);
        ctx.closePath();
        ctx.fill();
      };
      const total = w1 + gap + w2;
      para(cx - total / 2, w1);
      para(cx - total / 2 + w1 + gap, w2);
      ctx.restore();
    };

    const draw = (now: number) => {
      const t = reduce ? 0 : (now - start) / 1000;
      const target = clamp01(clarityRef.current ?? 0);
      c += (target - c) * (reduce ? 1 : 0.05);
      const burstAt = burstRef.current ?? 0;
      const s = burstAt ? clamp01((now - burstAt) / (reduce ? 1 : 1600)) : 0;

      // Nothing to animate in reduced motion once settled.
      if (reduce && Math.abs(c - lastDrawnC) < 0.002 && !burstAt) return;
      if (reduce && burstAt && s >= 1 && lastDrawnC === -2) return;
      lastDrawnC = reduce && burstAt && s >= 1 ? -2 : c;

      ctx.clearRect(0, 0, W, H);
      const e = smooth(c);
      const yc = carrierY();
      const top = spreadTop();
      const bottom = spreadBottom();
      const cx = W < 1024 ? W / 2 : W * 0.3;

      // Burst: lines squeeze toward the centre and flatten, then the slash lands.
      const squeeze = smooth(clamp01(s / 0.45));
      const fadeLines = 1 - smooth(clamp01((s - 0.35) / 0.3)) * 0.85;

      pointer.energy *= 0.94;
      const step = W < 640 ? 7 : 6;
      const mid = (N - 1) / 2;

      for (let i = 0; i < N; i++) {
        const sd = seeds[i];
        const lead = i === Math.round(mid);
        const base = top + ((bottom - top) * i) / Math.max(N - 1, 1);
        const by = base + (yc - base) * e;
        const noiseAmp = (W < 640 ? 26 : 38) * (1 - e) * (1 - squeeze);
        const cleanAmp = (W < 640 ? 14 : 22) * (0.35 + 0.65 * e) * (1 - squeeze);
        const phase = i * 0.42 * (1 - e);
        const centre = Math.abs(i - mid) / Math.max(mid, 1);

        ctx.beginPath();
        for (let x = -step; x <= W + step; x += step) {
          const xs = cx + (x - cx) * (1 - squeeze * 0.92);
          const env = 0.65 + 0.35 * Math.sin(x * 0.0035 + t * 0.35);
          let y =
            by +
            Math.sin(x * 0.011 - t * 1.5 + phase) * cleanAmp * env +
            (Math.sin(x * sd.f1 + t * sd.s1 + sd.p1) * 0.5 +
              Math.sin(x * sd.f2 - t * sd.s2 + sd.p2) * 0.32 +
              Math.sin(x * sd.f3 + t * 3.1 + i) * 0.18) *
              noiseAmp;
          // Static: brief spikes that come and go while the signal is weak.
          if (!reduce && sd.spike > 0.55) {
            const k = Math.sin(x * 0.21 + Math.floor(t * 6 + i) * 1.7);
            if (k > 0.985) y += (k - 0.985) * 1600 * (1 - e) * (1 - squeeze);
          }
          // The cursor stirs the lines it passes.
          if (pointer.energy > 0.01) {
            const dx = x - pointer.x;
            const dy = by - pointer.y;
            const g = Math.exp(-(dx * dx) / 9000 - (dy * dy) / 26000);
            y += g * Math.sin(x * 0.08 - t * 12) * 26 * pointer.energy * (1 - e * 0.6);
          }
          if (x <= -step) ctx.moveTo(xs, y);
          else ctx.lineTo(xs, y);
        }
        if (lead) {
          ctx.strokeStyle = RED;
          // The carrier survives the burst and runs through the slash.
          ctx.globalAlpha = (0.45 + 0.55 * e) * Math.max(fadeLines, 0.55);
          ctx.lineWidth = 1.2 + e * 1.4;
        } else {
          ctx.strokeStyle = e > 0.6 && centre < 0.2 ? RED : "#ffffff";
          ctx.globalAlpha = (0.07 + 0.17 * (1 - centre)) * (1 - e * 0.65) * fadeLines;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (burstAt) {
        const land = clamp01((s - 0.35) / 0.4);
        const k = land < 1 ? 1 - Math.pow(1 - land, 3) * Math.cos(land * 7) : 1;
        drawSlash(cx, yc, k, Math.min(1, land * 2) * (1 - 0.6 * clamp01((s - 0.8) / 0.2)));
        const flash = s > 0.38 ? Math.max(0, 1 - (s - 0.38) / 0.22) : 0;
        if (flash > 0) {
          ctx.fillStyle = `rgba(205,23,23,${0.35 * flash})`;
          ctx.fillRect(0, 0, W, H);
        }
      }
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.visibilityState !== "visible") return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const onPointer = (ev: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ev.clientX - r.left;
      pointer.y = ev.clientY - r.top;
      pointer.energy = Math.min(1, pointer.energy + 0.25);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(host);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        kick();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", kick);
    if (!reduce) host.addEventListener("pointermove", onPointer, { passive: true });
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", kick);
      host.removeEventListener("pointermove", onPointer);
    };
  }, [clarityRef, burstRef, reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    />
  );
}
