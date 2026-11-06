"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { MotionValue } from "motion/react";
import { BIG, bandPoints, halfPose, toPolygon, type SplitGeo } from "@/hooks/useHeroSplit";

/**
 * The aperture hero's single animation loop. No React renders per frame: it
 * writes the two halves' clip-paths, a few CSS variables and readouts, and
 * paints one overlay canvas.
 *
 * - The slit: the halves rest a few pixels apart along the logo slash and the
 *   white board behind shows through. Near the cursor (or an idle wanderer on
 *   touch screens) the edges recede into a lens: the slit is pried open
 *   locally. A click or tap flares it.
 * - The light: CSS variables (--lx, --ly, --lr, --la, --sp) drive a light map
 *   that each half multiplies over its headline, so the type is brightest at
 *   the slit and under the lens. The overlay adds bloom, the red rim on edge
 *   A (the logo's slash), the thin second bar on B, dust in the light, the
 *   sparks of the door slam and the torn edges while the halves part.
 */

const RED = "205,23,23";
// Lens widening per side at full strength (asymmetric on purpose).
const WA = 15;
const WB = 23;
const SAMPLES = 72;

export const APERTURE_GAP = [2, 3] as const;

// The door slam, in `closed` units (see useHeroSplit): A lands, then B.
const LAND_A = 0.7;
const LAND_B = 0.84;

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; s: number; red: boolean };
type Mote = { s: number; d: number; vs: number; vd: number; ph: number; sz: number };

export type ApertureRefs = {
  root: RefObject<HTMLElement | null>;
  wrap: RefObject<HTMLElement | null>;
  halfA: RefObject<HTMLElement | null>;
  halfB: RefObject<HTMLElement | null>;
  overlay: RefObject<HTMLCanvasElement | null>;
  manifesto: RefObject<HTMLElement | null>;
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (t: number) => {
  const k = clamp01(t);
  return k * k * (3 - 2 * k);
};

function applyPose(ctx: CanvasRenderingContext2D, g: SplitGeo, pose: ReturnType<typeof halfPose>) {
  ctx.translate(pose.ox + g.cx, pose.oy + g.cy);
  ctx.rotate(pose.rot);
  ctx.translate(-g.cx, -g.cy);
}
function toScreen(g: SplitGeo, pose: ReturnType<typeof halfPose>, x: number, y: number) {
  const c = Math.cos(pose.rot);
  const s = Math.sin(pose.rot);
  const dx = x - g.cx;
  const dy = y - g.cy;
  return [g.cx + dx * c - dy * s + pose.ox, g.cy + dx * s + dy * c + pose.oy] as const;
}
function pathPoly(ctx: CanvasRenderingContext2D, pts: readonly (readonly [number, number])[]) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
}

export function useApertureEngine({
  geo,
  closed,
  loaded,
  refs,
}: {
  geo: MotionValue<SplitGeo>;
  closed: MotionValue<number>;
  loaded: boolean;
  refs: ApertureRefs;
}) {
  const bus = useRef({ cue: 0, flare: 0, loaded: false });

  useEffect(() => {
    bus.current.loaded = loaded;
  }, [loaded]);

  useEffect(() => {
    const root = refs.root.current;
    const wrap = refs.wrap.current;
    const halfA = refs.halfA.current;
    const halfB = refs.halfB.current;
    const over = refs.overlay.current;
    const ctx = over?.getContext("2d");
    if (!root || !wrap || !halfA || !halfB || !over || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let frameN = 0;
    let lastNow = performance.now();
    let lastOpen = 0;
    let lastClosed = closed.get();
    let flashA = -1e9;
    let flashB = -1e9;
    let clipA = "";
    let clipB = "";
    let varKey = "";
    let cleared = false;

    const p = { x: -9999, y: -9999, last: -1e9, inside: false };
    const lens = { s: 0, k: reduce ? 0.3 : 0 };
    const sparks: Spark[] = [];
    const motes: Mote[] = [];

    const spawnMote = (m: Partial<Mote> = {}, L = 400): Mote => ({
      s: (Math.random() * 2 - 1) * L,
      d: (Math.random() + Math.random() + Math.random() - 1.5) * 50,
      vs: (Math.random() - 0.5) * 22,
      vd: (Math.random() - 0.5) * 9,
      ph: Math.random() * Math.PI * 2,
      sz: Math.random() < 0.2 ? 2 : 1,
      ...m,
    });

    const resize = (g: SplitGeo) => {
      const nd = Math.min(window.devicePixelRatio || 1, 2);
      if (g.w === w && g.h === h && nd === dpr) return;
      w = g.w;
      h = g.h;
      dpr = nd;
      over.width = Math.round(w * dpr);
      over.height = Math.round(h * dpr);
      // Position of the cut along a 63.6deg CSS gradient spanning the frame.
      const len = w * g.nx + h * -g.ny;
      const sp = len / 2 + (g.cx - w / 2) * g.nx + (g.cy - h / 2) * g.ny;
      wrap.style.setProperty("--sp", `${sp.toFixed(1)}px`);
      if (!reduce) {
        motes.length = 0;
        const n = w < 768 ? 46 : 84;
        for (let i = 0; i < n; i++) motes.push(spawnMote({}, halfLen(g)));
      }
    };

    const halfLen = (g: SplitGeo) => g.h / 2 / g.uy + 60;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = root.getBoundingClientRect();
      p.x = e.clientX - r.left;
      p.y = e.clientY - r.top;
      p.inside = p.x >= 0 && p.y >= 0 && p.x <= r.width && p.y <= r.height;
      p.last = performance.now();
    };
    const onLeave = () => {
      p.inside = false;
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || !root.contains(t) || t.closest("a,button")) return;
      const g = geo.get();
      if (g.open > 0.02 || reduce) return;
      const r = root.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const s = (x - g.cx) * g.ux + (y - g.cy) * g.uy;
      if (e.pointerType === "touch") {
        // The lens jumps to the tap, then the wanderer takes over again.
        lens.s = s;
        lens.k = Math.max(lens.k, 0.6);
      }
      bus.current.flare = 1;
      emitFrom(g, -1, 22, 220, s, 90);
      emitFrom(g, 1, 22, 260, s, 90);
    };

    /** Sparks shed from one edge, optionally concentrated around s0. */
    const emitFrom = (g: SplitGeo, side: -1 | 1, n: number, speed: number, s0?: number, spread = 0) => {
      if (reduce) return;
      const pose = halfPose(g, side);
      const L = halfLen(g);
      for (let i = 0; i < n; i++) {
        const s = s0 === undefined ? (Math.random() * 2 - 1) * L : s0 + (Math.random() - 0.5) * 2 * spread;
        const [x, y] = toScreen(g, pose, g.cx + g.ux * s, g.cy + g.uy * s);
        if (x < -20 || y < -20 || x > w + 20 || y > h + 20) continue;
        // Out of the slit, over the half it came from.
        const out = side * (30 + Math.random() * speed);
        const slide = (Math.random() - 0.5) * 140;
        const max = 0.3 + Math.random() * 0.55;
        sparks.push({
          x,
          y,
          vx: g.nx * out + g.ux * slide,
          vy: g.ny * out + g.uy * slide,
          life: max,
          max,
          s: 1 + Math.random() * 2.5,
          red: Math.random() < 0.6,
        });
      }
      if (sparks.length > 360) sparks.splice(0, sparks.length - 360);
    };

    /* -------------------------------------------------------------- */

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      frameN++;
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      if (document.hidden) return;
      const g = geo.get();
      const c = closed.get();
      resize(g);

      // The board behind shows through once the doors are (nearly) shut.
      const m = refs.manifesto.current;
      if (m) {
        const v = bus.current.loaded && (c >= 0.9 || reduce) ? "visible" : "hidden";
        if (m.style.visibility !== v) m.style.visibility = v;
      }

      if (g.open >= 1) {
        if (!cleared) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, over.width, over.height);
          sparks.length = 0;
          cleared = true;
        }
        lastOpen = g.open;
        lastClosed = c;
        return;
      }
      cleared = false;

      const L = halfLen(g);
      const rest = 1 - clamp01(g.open * 5);
      const t = now / 1000;
      const mobile = w < 768;

      // Lens target: the cursor's projection on the cut, else a wanderer.
      let tS = lens.s;
      let tK = 0;
      if (reduce) {
        tS = 0;
        tK = 0.3;
      } else if (fine && p.inside && now - p.last < 4000) {
        const s = (p.x - g.cx) * g.ux + (p.y - g.cy) * g.uy;
        const d = (p.x - g.cx) * g.nx + (p.y - g.cy) * g.ny;
        tS = s;
        tK = smooth(1 - Math.abs(d) / 360);
      } else if (now - p.last > 2400) {
        tS = L * 0.6 * Math.sin(t * 0.27) + L * 0.12 * Math.sin(t * 0.71);
        tK = mobile ? 0.36 + 0.2 * Math.sin(t * 0.83) : 0.38 + 0.2 * Math.sin(t * 0.7);
      }
      const ease = reduce ? 1 : 0.1;
      lens.s += (tS - lens.s) * ease;
      lens.k += (tK - lens.k) * (reduce ? 1 : 0.07);
      bus.current.flare *= Math.exp(-dt * 2.4);
      const flare = bus.current.flare;
      const cue = bus.current.cue;

      const k = Math.min(Math.max(lens.k, flare) * rest, 1.2);
      const wA = (WA * lens.k + 26 * flare) * rest;
      const wB = (WB * lens.k + 38 * flare) * rest;
      const sig = 110 + 70 * lens.k + 50 * flare;
      const bulge = (s: number) => Math.exp(-(((s - lens.s) / sig) ** 2));

      // Edge points (local coordinates), shared by the clips and the overlay.
      const edgeA: [number, number][] = [];
      const edgeB: [number, number][] = [];
      const curved = wA + wB > 0.05;
      const pt = (d: number, s: number): [number, number] => [g.cx + g.nx * d + g.ux * s, g.cy + g.ny * d + g.uy * s];
      if (curved) {
        for (let i = 0; i <= SAMPLES; i++) {
          const s = -L + (2 * L * i) / SAMPLES;
          const b = bulge(s);
          edgeA.push(pt(0.75 - wA * b, s));
          edgeB.push(pt(wB * b, s));
        }
      } else {
        edgeA.push(pt(0.75, -L), pt(0.75, L));
        edgeB.push(pt(0, -L), pt(0, L));
      }
      const E = (w + h) * 2;
      const polyA = toPolygon([pt(0.75, -E), ...edgeA, pt(0.75, E), pt(-BIG, E), pt(-BIG, -E)]);
      const polyB = toPolygon([pt(0, -E), ...edgeB, pt(0, E), pt(BIG, E), pt(BIG, -E)]);
      if (polyA !== clipA) {
        halfA.style.clipPath = polyA;
        clipA = polyA;
      }
      if (polyB !== clipB) {
        halfB.style.clipPath = polyB;
        clipB = polyB;
      }

      // Light map variables (local coordinates, shared by both halves).
      const lx = g.cx + g.ux * lens.s;
      const ly = g.cy + g.uy * lens.s;
      const lr = 140 + 280 * k;
      const la = Math.min(0.15 + 0.85 * k, 1);
      const key = `${lx.toFixed(0)}|${ly.toFixed(0)}|${lr.toFixed(0)}|${la.toFixed(2)}`;
      if (key !== varKey && (!mobile || frameN % 2 === 0 || reduce)) {
        varKey = key;
        wrap.style.setProperty("--lx", `${lx.toFixed(1)}px`);
        wrap.style.setProperty("--ly", `${ly.toFixed(1)}px`);
        wrap.style.setProperty("--lr", `${lr.toFixed(0)}px`);
        wrap.style.setProperty("--la", la.toFixed(3));
      }

      // Readouts.
      if (frameN % 5 === 0) {
        const ap = g.a + g.b + wA + wB;
        const apTxt = ap > 999 ? "999+" : ap.toFixed(1).padStart(4, "0");
        const openTxt = `${String(Math.round(g.open * 100)).padStart(3, "0")}%`;
        root.querySelectorAll<HTMLElement>('[data-ro="ap"]').forEach((el) => {
          if (el.textContent !== apTxt) el.textContent = apTxt;
        });
        root.querySelectorAll<HTMLElement>('[data-ro="open"]').forEach((el) => {
          if (el.textContent !== openTxt) el.textContent = openTxt;
        });
      }

      // Slam impacts.
      if (lastClosed < LAND_A && c >= LAND_A) {
        flashA = now;
        emitFrom(g, -1, 50, 240);
      }
      if (lastClosed < LAND_B && c >= LAND_B) {
        flashB = now;
        emitFrom(g, -1, 30, 200);
        emitFrom(g, 1, 70, 320);
      }
      const fl = Math.max(1 - (now - flashA) / 500, 0) * 0.6 + Math.max(1 - (now - flashB) / 700, 0);

      /* ---------------- overlay ---------------- */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const gapPx = g.a + g.b;
      const opening = g.open > 0;
      const edgeFade = 1 - clamp01((g.open - 0.82) / 0.18);
      const glow = (0.13 + 0.2 * k + 0.12 * cue + 0.5 * Math.min(fl, 1)) * (opening ? Math.max(1 - gapPx / 160, 0) : 1);

      for (const side of [-1, 1] as const) {
        const pose = halfPose(g, side);
        const edge = side < 0 ? edgeA : edgeB;
        ctx.save();
        applyPose(ctx, g, pose);

        // Bloom from the slit onto this half.
        if (glow > 0.005) {
          const D = 34 + 70 * k + 60 * Math.min(fl, 1);
          const dir = side;
          const [x0, y0] = pt(0, lens.s);
          const grad = ctx.createLinearGradient(x0, y0, x0 + g.nx * D * dir, y0 + g.ny * D * dir);
          grad.addColorStop(0, `rgba(255,255,255,${Math.min(glow, 0.9)})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = grad;
          const outer = edge.map(([x, y]) => [x + g.nx * D * dir, y + g.ny * D * dir] as [number, number]).reverse();
          pathPoly(ctx, [...edge, ...outer]);
          ctx.fill();
        }

        // Shade into the gap while the halves part (the edges have depth).
        if (opening) {
          const kk = Math.min(gapPx / 40, 1);
          const shade = Math.min(80, gapPx * 0.5);
          const d0 = side < 0 ? 0.75 : 0;
          const d1 = d0 - side * shade;
          const [sx0, sy0] = pt(d0, 0);
          const [sx1, sy1] = pt(d1, 0);
          const sg = ctx.createLinearGradient(sx0, sy0, sx1, sy1);
          sg.addColorStop(0, `rgba(0,0,0,${0.4 * edgeFade * kk})`);
          sg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = sg;
          pathPoly(ctx, bandPoints(g, Math.min(d0, d1), Math.max(d0, d1)));
          ctx.fill();
          if (side < 0) {
            // The logo's double slash rides edge A as it tears away.
            ctx.fillStyle = `rgba(${RED},${edgeFade * kk})`;
            pathPoly(ctx, bandPoints(g, 0.75, 0.75 + 24 * kk));
            ctx.fill();
            pathPoly(ctx, bandPoints(g, 0.75 + 31 * kk, 0.75 + 38 * kk));
            ctx.fill();
          }
        }

        // Rims: red on A (the logo's slash), a white hairline on B and, on
        // B, the thin second bar of the double slash, drawn in light.
        ctx.lineJoin = "round";
        ctx.beginPath();
        edge.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        if (side < 0) {
          ctx.strokeStyle = `rgba(${RED},${edgeFade})`;
          ctx.lineWidth = 2 + 1.5 * Math.min(fl, 1);
        } else {
          ctx.strokeStyle = `rgba(255,255,255,${0.9 * edgeFade})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
        if (side > 0 && !opening) {
          const off = 12;
          ctx.beginPath();
          edge.forEach(([x, y], i) => {
            const X = x + g.nx * off;
            const Y = y + g.ny * off;
            if (i) ctx.lineTo(X, Y);
            else ctx.moveTo(X, Y);
          });
          ctx.strokeStyle = `rgba(255,255,255,${0.22 + 0.3 * k})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Lens glow, at the pried-open point.
      if (k > 0.02 && rest > 0) {
        const [gx, gy] = [g.cx + g.ux * lens.s, g.cy + g.uy * lens.s];
        const R = 30 + 170 * k;
        const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
        rg.addColorStop(0, `rgba(255,255,255,${0.3 * k * rest})`);
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(gx - R, gy - R, R * 2, R * 2);
      }

      // Dust in the light.
      if (motes.length && rest > 0 && c >= 0.9) {
        for (const mo of motes) {
          mo.s += mo.vs * dt;
          mo.d += mo.vd * dt + Math.sin(t * 0.9 + mo.ph) * 4 * dt;
          if (Math.abs(mo.d) > 150 || Math.abs(mo.s) > L) Object.assign(mo, spawnMote({}, L));
          const near = Math.exp(-(((mo.s - lens.s) / (sig * 1.6)) ** 2));
          const a =
            0.6 * Math.exp(-((mo.d / (40 + 50 * k)) ** 2)) * (0.25 + 0.75 * near * Math.max(k, 0.3)) * (0.6 + 0.4 * Math.sin(t * 2.3 + mo.ph)) * rest;
          if (a < 0.02) continue;
          const [x, y] = pt(mo.d, mo.s);
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.fillRect(x, y, mo.sz, mo.sz);
        }
      }

      // Sparks: the slam, flares and the tear itself.
      const dOpen = g.open - lastOpen;
      if (!reduce && opening && g.open < 0.97 && Math.abs(dOpen) > 0.0005) {
        const n = Math.min(Math.round(Math.abs(dOpen) * 700), 24);
        emitFrom(g, -1, n, 220);
        emitFrom(g, 1, Math.round(n * 0.7), 300);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.95;
        s.vy *= 0.95;
        const a = s.life / s.max;
        ctx.fillStyle = s.red ? `rgba(${RED},${a})` : `rgba(255,255,255,${a * 0.9})`;
        ctx.fillRect(s.x - s.s / 2, s.y - s.s / 2, s.s, s.s);
      }

      lastOpen = g.open;
      lastClosed = c;
    };

    const start = () => {
      if (running) return;
      running = true;
      lastNow = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    start();
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [geo, closed, refs]);

  const setCue = useCallback((on: boolean) => {
    bus.current.cue = on ? 1 : 0;
  }, []);
  const flare = useCallback(() => {
    bus.current.flare = 1;
  }, []);
  return { setCue, flare };
}
