"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

/**
 * A yantra of points in perfect radial symmetry, slowly breathing. As the
 * chapter scrolls, one red point appears off-centre and the symmetry breaks
 * outward from it: the rings unwind into a three-armed spiral galaxy.
 * Symmetry to structure, the idea the company is named after.
 */

const RINGS = 10;
const ORDER = 12; // points per ring = ORDER * ring index
const RED = "205,23,23";

type Pt = {
  ring: number;
  theta: number;
  r: number; // home radius as a fraction of R
  tr: number; // galaxy radius as a fraction of R
  ta: number; // galaxy angle
  red: boolean;
  seedDist: number; // distance to the seed, normalised, for the ripple
  next: number; // neighbour on the same ring
  n1: number; // nearest neighbours in the galaxy
  n2: number;
};

const hash = (i: number, s: number) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Seed position relative to centre, as a fraction of R: right of centre, on purpose.
const SEED = { x: 0.2, y: -0.06 };
// Galaxy tilt echoes the logo slash.
const TILT = (-26 * Math.PI) / 180;

function build(): Pt[] {
  const pts: Pt[] = [];
  for (let k = 1; k <= RINGS; k++) {
    const n = ORDER * k;
    const start = pts.length;
    for (let i = 0; i < n; i++) {
      const id = pts.length;
      const d = k / RINGS;
      const arm = id % 3;
      pts.push({
        ring: k,
        theta: (i / n) * Math.PI * 2 + (k % 2 ? Math.PI / n : 0),
        r: 0.08 + 0.92 * Math.pow(d, 0.95),
        tr: (0.05 + 0.95 * Math.pow(hash(id, 1), 0.8)) * (0.92 + 0.16 * hash(id, 2)),
        ta: (arm * Math.PI * 2) / 3 + 4.4 * Math.pow(hash(id, 1), 0.8) + (hash(id, 3) - 0.5) * 0.55,
        red: hash(id, 4) < 0.045,
        seedDist: 0,
        next: i === n - 1 ? start : id + 1,
        n1: id,
        n2: id,
      });
    }
  }
  // Galaxy neighbours and distance to the seed, in R units.
  const gx = pts.map((p) => Math.cos(p.ta) * p.tr);
  const gy = pts.map((p) => Math.sin(p.ta) * p.tr * 0.78);
  pts.forEach((p, i) => {
    const hx = Math.cos(p.theta) * p.r;
    const hy = Math.sin(p.theta) * p.r;
    p.seedDist = Math.hypot(hx - SEED.x, hy - SEED.y) / 1.25;
    let b1 = -1;
    let b2 = -1;
    let d1 = Infinity;
    let d2 = Infinity;
    for (let j = 0; j < pts.length; j++) {
      if (j === i) continue;
      const d = (gx[i] - gx[j]) ** 2 + (gy[i] - gy[j]) ** 2;
      if (d < d1) {
        d2 = d1;
        b2 = b1;
        d1 = d;
        b1 = j;
      } else if (d < d2) {
        d2 = d;
        b2 = j;
      }
    }
    p.n1 = b1;
    p.n2 = b2;
  });
  return pts;
}

export function YantraField({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pts = build();
    const X = new Float32Array(pts.length);
    const Y = new Float32Array(pts.length);
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = (now: number) => {
      const t = reduce ? 0 : now / 1000;
      const p = progress.get();
      const R = Math.min(w, h) * (w < 640 ? 0.52 : 0.47);
      const cx = w * 0.5;
      const cy = h * 0.52;
      const sx = cx + SEED.x * R;
      const sy = cy + SEED.y * R;
      const seedOn = smooth(0.36, 0.42, p);
      const broken = smooth(0.4, 0.86, p);
      const breath = 1 + 0.018 * Math.sin(t * 0.7);
      const spin = t * 0.03;
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < pts.length; i++) {
        const q = pts[i];
        const rot = t * 0.035 * (q.ring % 2 ? 1 : -1);
        const hx = cx + Math.cos(q.theta + rot) * q.r * R * breath;
        const hy = cy + Math.sin(q.theta + rot) * q.r * R * breath;
        // Galaxy position around the seed, tilted along the slash.
        const a = q.ta + spin;
        const lx = Math.cos(a) * q.tr * R * 1.05;
        const ly = Math.sin(a) * q.tr * R * 0.78;
        const gx = sx + lx * cosT - ly * sinT;
        const gy = sy + lx * sinT + ly * cosT;
        // The break ripples outward from the seed.
        const local = ease(clamp(broken * 1.5 - q.seedDist * 0.5));
        let x = hx + (gx - hx) * local;
        let y = hy + (gy - hy) * local;
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 12000) {
          const f = (1 - d2 / 12000) * 18;
          const d = Math.sqrt(d2) || 1;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
        X[i] = x;
        Y[i] = y;
      }

      // Symmetric rings fade out as the galaxy's filaments fade in.
      ctx.lineWidth = 0.6;
      if (broken < 1) {
        ctx.strokeStyle = `rgba(0,0,0,${0.13 * (1 - broken)})`;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const j = pts[i].next;
          ctx.moveTo(X[i], Y[i]);
          ctx.lineTo(X[j], Y[j]);
        }
        ctx.stroke();
      }
      if (broken > 0) {
        ctx.strokeStyle = `rgba(0,0,0,${0.16 * broken})`;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const q = pts[i];
          ctx.moveTo(X[i], Y[i]);
          ctx.lineTo(X[q.n1], Y[q.n1]);
          ctx.moveTo(X[i], Y[i]);
          ctx.lineTo(X[q.n2], Y[q.n2]);
        }
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(0,0,0,0.6)";
      for (let i = 0; i < pts.length; i++) {
        if (pts[i].red && broken > 0.2) continue;
        ctx.fillRect(X[i] - 1, Y[i] - 1, 2, 2);
      }
      if (broken > 0.2) {
        ctx.fillStyle = `rgba(${RED},${smooth(0.2, 0.6, broken)})`;
        for (let i = 0; i < pts.length; i++) {
          if (pts[i].red) ctx.fillRect(X[i] - 1.75, Y[i] - 1.75, 3.5, 3.5);
        }
      }

      // The seed: one red point, and the ripple it sends out.
      if (seedOn > 0) {
        const pulse = reduce ? 0 : (t * 0.6) % 1;
        ctx.fillStyle = `rgba(${RED},${seedOn})`;
        ctx.fillRect(sx - 4, sy - 4, 8, 8);
        ctx.strokeStyle = `rgba(${RED},${seedOn * (1 - pulse) * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, 6 + pulse * 40, 0, Math.PI * 2);
        ctx.stroke();
        const wave = smooth(0.4, 0.7, p);
        if (wave > 0 && wave < 1) {
          ctx.strokeStyle = `rgba(${RED},${(1 - wave) * 0.5})`;
          ctx.beginPath();
          ctx.arc(sx, sy, wave * R * 1.6, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!raf && visible && !reduce) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVis = () => start();
    // With reduced motion there's no animation loop; redraw on scroll instead.
    const unsub = reduce ? progress.on("change", () => draw(0)) : () => {};

    resize();
    draw(0);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      unsub();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [progress]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
