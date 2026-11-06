"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { MotionValue } from "motion/react";
import {
  BIG,
  bandPoints,
  halfPose,
  toPolygon,
  type SplitGeo,
} from "@/hooks/useHeroSplit";

/**
 * The hero's single animation loop. It paints two canvases and pokes a few
 * DOM nodes directly (no React renders per frame):
 *
 * - field (under the copy): a grid of crosshairs. A force (the cursor, or an
 *   idle wanderer on touch screens) breaks the symmetry into the logo's red
 *   slashes; clicks and taps send shock rings; the cut does the same along
 *   the split. Drawn once per half with that half's exact pose.
 * - overlay (over everything): the intro slit, the score line that previews
 *   the cut, the cut itself, the red slashes riding the torn edge, edge
 *   shading, sparks shed by the tear and the bracket reticle.
 * - DOM: the live readouts (symmetry, open %), the magnetic CTA offset, the
 *   wordmark spotlight and the intro clip on the hero wrapper.
 */

const RED = "205,23,23";

// Intro, in ms after the loader completes.
const LINE = [60, 520] as const;
const SLIT = [380, 1380] as const;
const WAVE = [460, 2200] as const;
export const INTRO_DONE_MS = SLIT[1];

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; s: number; red: boolean };
type Shock = { x: number; y: number; t0: number };

export type HeroRefs = {
  root: RefObject<HTMLElement | null>;
  wrap: RefObject<HTMLElement | null>;
  field: RefObject<HTMLCanvasElement | null>;
  overlay: RefObject<HTMLCanvasElement | null>;
  manifesto: RefObject<HTMLElement | null>;
};

export type HeroBus = {
  /** 0 → 1: the "scroll to open" cue is hovered or focused */
  cue: number;
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const pad4 = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

/** Local → screen for one half's pose (translate, then twist about the cut). */
function toScreen(g: SplitGeo, pose: ReturnType<typeof halfPose>, x: number, y: number) {
  const c = Math.cos(pose.rot);
  const s = Math.sin(pose.rot);
  const dx = x - g.cx;
  const dy = y - g.cy;
  return [g.cx + dx * c - dy * s + pose.ox, g.cy + dx * s + dy * c + pose.oy] as const;
}
function toLocal(g: SplitGeo, pose: ReturnType<typeof halfPose>, x: number, y: number) {
  const c = Math.cos(-pose.rot);
  const s = Math.sin(-pose.rot);
  const dx = x - pose.ox - g.cx;
  const dy = y - pose.oy - g.cy;
  return [g.cx + dx * c - dy * s, g.cy + dx * s + dy * c] as const;
}
function applyPose(ctx: CanvasRenderingContext2D, g: SplitGeo, pose: ReturnType<typeof halfPose>) {
  ctx.translate(pose.ox + g.cx, pose.oy + g.cy);
  ctx.rotate(pose.rot);
  ctx.translate(-g.cx, -g.cy);
}
function pathPoly(ctx: CanvasRenderingContext2D, pts: readonly (readonly [number, number])[]) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
}

export function useHeroEngine({
  geo,
  loaded,
  refs,
}: {
  geo: MotionValue<SplitGeo>;
  loaded: boolean;
  refs: HeroRefs;
}) {
  const bus = useRef<HeroBus>({ cue: 0 });
  const loadedAt = useRef<number | null>(null);

  useEffect(() => {
    if (loaded && loadedAt.current === null) loadedAt.current = performance.now();
  }, [loaded]);

  useEffect(() => {
    const root = refs.root.current;
    const field = refs.field.current;
    const over = refs.overlay.current;
    const fctx = field?.getContext("2d");
    const octx = over?.getContext("2d");
    if (!root || !field || !over || !fctx || !octx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() ||
      "ui-monospace, monospace";

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let frameN = 0;
    let lastNow = performance.now();
    let lastOpen = 0;
    let lastCut = 0;
    let lastShockAuto = 0;
    let sym = 100;
    let introDone = reduce;
    let wrapClipSet = "";

    // Force point (smoothed), its target, and the reticle (lazier).
    const p = { x: -9999, y: -9999, tx: -9999, ty: -9999, last: -1e9, inside: false };
    const ret = { x: -9999, y: -9999, w: 18, h: 18, cx: 0, cy: 0 };
    const sparks: Spark[] = [];
    const shocks: Shock[] = [];

    const sizeCanvases = (g: SplitGeo) => {
      const nd = Math.min(window.devicePixelRatio || 1, 2);
      if (g.w === w && g.h === h && nd === dpr) return;
      w = g.w;
      h = g.h;
      dpr = nd;
      for (const c of [field, over]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
    };

    const rootRect = () => root.getBoundingClientRect();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = rootRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      p.inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      p.tx = x;
      p.ty = y;
      if (p.x < -9000) {
        p.x = x;
        p.y = y;
      }
      if (ret.x < -9000) {
        ret.x = x;
        ret.y = y;
      }
      p.last = performance.now();
    };
    const onLeave = () => {
      p.inside = false;
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || !root.contains(t) || t.closest("a,button")) return;
      const g = geo.get();
      if (g.parted) return;
      const r = rootRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      shocks.push({ x, y, t0: performance.now() });
      if (e.pointerType === "touch") {
        // On touch, the force jumps to the finger for a moment.
        p.tx = x;
        p.ty = y;
        p.last = performance.now() - 1200;
      }
    };

    /* ---------------------------------------------------------------- */
    /* Field                                                             */
    /* ---------------------------------------------------------------- */

    let symBroken = 0;
    let symTotal = 0;

    const drawHalf = (g: SplitGeo, side: -1 | 0 | 1, now: number, intro: number, wave: number) => {
      const ctx = fctx;
      const pose = side === 0 ? { ox: 0, oy: 0, rot: 0 } : halfPose(g, side);
      ctx.save();
      if (side !== 0) {
        applyPose(ctx, g, pose);
        pathPoly(ctx, side < 0 ? bandPoints(g, -BIG, 0.75) : bandPoints(g, 0, BIG));
        ctx.clip();
      }
      ctx.fillStyle = "#000";
      ctx.fillRect(-w, -h, w * 3, h * 3);

      const S = w < 768 ? 26 : 34;
      const cols = Math.ceil(w / S) + 2;
      const rows = Math.ceil(h / S) + 2;
      const offX = (w - (cols - 1) * S) / 2;
      const offY = (h - (rows - 1) * S) / 2;
      const [plx, ply] = side === 0 ? [p.x, p.y] : toLocal(g, pose, p.x, p.y);
      const R = w < 768 ? 120 : 190;
      const reach = g.cut * Math.hypot(w, h) * 0.6;
      const cutPulse = g.cut * (1 - Math.min(g.open * 1.6, 1));
      const waveR = wave * (g.reach + 220);
      const waveK = 1 - wave;
      const arm = 2.5;
      const localShocks = shocks.map((s) => {
        const [x, y] = side === 0 ? [s.x, s.y] : toLocal(g, pose, s.x, s.y);
        const age = (now - s.t0) / 1000;
        return { x, y, r: age * 820, k: Math.max(1 - age / 1.15, 0) };
      });

      const calm = new Path2D();
      const faint: [number, number, number][] = [];

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = offX + i * S;
          const y = offY + j * S;
          const sd = (x - g.cx) * g.nx + (y - g.cy) * g.ny;
          if (side < 0 && sd > 4) continue;
          if (side > 0 && sd < -4) continue;

          // Intro: the field ignites outward from the cut.
          const fade = intro >= 1 ? 1 : clamp01((waveR - Math.abs(sd)) / 140);
          if (fade <= 0) continue;
          const tw = waveK > 0 ? Math.max(1 - Math.abs(waveR - Math.abs(sd)) / 70, 0) * waveK : 0;

          const dx = x - plx;
          const dy = y - ply;
          const dist = Math.hypot(dx, dy);
          let tp = Math.max(1 - dist / R, 0);
          tp = tp * tp * (3 - 2 * tp);

          const along = Math.abs((x - g.cx) * g.ux + (y - g.cy) * g.uy);
          const tc =
            cutPulse > 0
              ? Math.max(1 - Math.abs(sd) / 70, 0) * clamp01((reach - along) / 90) * cutPulse
              : 0;

          let ts = 0;
          for (const s of localShocks) {
            if (s.k <= 0) continue;
            const ds = Math.hypot(x - s.x, y - s.y);
            ts = Math.max(ts, Math.max(1 - Math.abs(ds - s.r) / 44, 0) * s.k);
          }

          const t = Math.max(tp * fade, tc, tw * 0.9, ts);
          if (fade >= 1) {
            symTotal++;
            if (t > 0.25) symBroken++;
          }
          if (t < 0.03) {
            if (fade >= 1) {
              calm.moveTo(x - arm, y);
              calm.lineTo(x + arm, y);
              calm.moveTo(x, y - arm);
              calm.lineTo(x, y + arm);
            } else faint.push([x, y, fade]);
            continue;
          }

          // Pushed away from the force, then drawn as the brand slash.
          const push = dist > 0.01 ? (tp * 10) / dist : 0;
          const cx = x + dx * push;
          const cy = y + dy * push;
          const hl = 3 + t * 8;
          const r = Math.round(255 + (205 - 255) * t);
          const gb = Math.round(255 + (23 - 255) * t);
          ctx.strokeStyle = `rgba(${r},${gb},${gb},${0.2 + 0.8 * t})`;
          ctx.lineWidth = 1 + t * 1.8;
          ctx.beginPath();
          ctx.moveTo(cx - g.ux * hl, cy - g.uy * hl);
          ctx.lineTo(cx + g.ux * hl, cy + g.uy * hl);
          if (t > 0.55) {
            // The second, thinner stroke of the logo's double slash.
            const o = 4 + t * 2;
            const k = hl * 0.75;
            ctx.moveTo(cx + g.nx * o - g.ux * k, cy + g.ny * o - g.uy * k);
            ctx.lineTo(cx + g.nx * o + g.ux * k, cy + g.ny * o + g.uy * k);
          }
          ctx.stroke();
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.17)";
      ctx.stroke(calm);
      for (const [x, y, f] of faint) {
        ctx.strokeStyle = `rgba(255,255,255,${0.17 * f})`;
        ctx.beginPath();
        ctx.moveTo(x - arm, y);
        ctx.lineTo(x + arm, y);
        ctx.moveTo(x, y - arm);
        ctx.lineTo(x, y + arm);
        ctx.stroke();
      }
      ctx.restore();
    };

    /* ---------------------------------------------------------------- */
    /* Overlay                                                           */
    /* ---------------------------------------------------------------- */

    const line = (ctx: CanvasRenderingContext2D, g: SplitGeo, d: number, s0: number, s1: number) => {
      ctx.beginPath();
      ctx.moveTo(g.cx + g.nx * d + g.ux * s0, g.cy + g.ny * d + g.uy * s0);
      ctx.lineTo(g.cx + g.nx * d + g.ux * s1, g.cy + g.ny * d + g.uy * s1);
    };

    const halfLen = (g: SplitGeo) => g.h / 2 / g.uy + 40;

    const emitSparks = (g: SplitGeo, side: -1 | 1, n: number, speed: number) => {
      const pose = halfPose(g, side);
      const L = halfLen(g);
      for (let i = 0; i < n; i++) {
        const s = (Math.random() * 2 - 1) * L;
        const d = side < 0 ? 0.75 : 0;
        const [x, y] = toScreen(g, pose, g.cx + g.nx * d + g.ux * s, g.cy + g.ny * d + g.uy * s);
        if (x < -20 || y < -20 || x > w + 20 || y > h + 20) continue;
        const out = -side * (40 + Math.random() * speed);
        const slide = (Math.random() - 0.5) * 160;
        const max = 0.35 + Math.random() * 0.6;
        sparks.push({
          x,
          y,
          vx: g.nx * out + g.ux * slide,
          vy: g.ny * out + g.uy * slide,
          life: max,
          max,
          s: 1.5 + Math.random() * 3,
          red: Math.random() < 0.7,
        });
      }
      if (sparks.length > 420) sparks.splice(0, sparks.length - 420);
    };

    const drawOverlay = (g: SplitGeo, now: number, dt: number, tIntro: number) => {
      const ctx = octx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const L = halfLen(g);

      // 1. Intro: a red line scores the white card, then the slit opens.
      if (!introDone) {
        const lt = easeOut(clamp01((tIntro - LINE[0]) / (LINE[1] - LINE[0])));
        const st = clamp01((tIntro - SLIT[0]) / (SLIT[1] - SLIT[0]));
        const { dA, dB } = slit(g, st);
        if (lt > 0 && st < 1) {
          ctx.strokeStyle = `rgba(${RED},${1 - st})`;
          ctx.lineWidth = 1.5;
          line(ctx, g, 0, -L * lt, L * lt);
          ctx.stroke();
        }
        if (st > 0 && st < 1) {
          const k = Math.min(st * 6, 1) * (1 - Math.pow(st, 4));
          ctx.fillStyle = `rgba(${RED},${k})`;
          pathPoly(ctx, bandPoints(g, -dA - 22, -dA));
          ctx.fill();
          pathPoly(ctx, bandPoints(g, dB, dB + 6));
          ctx.fill();
        }
      }

      // 2. At rest: a dashed score line previews where the screen will tear.
      if (introDone && g.cut === 0 && !g.parted) {
        const c = bus.current.cue;
        ctx.save();
        ctx.setLineDash([2, 7]);
        ctx.strokeStyle = `rgba(${RED},${0.28 + 0.5 * c})`;
        ctx.lineWidth = 1;
        line(ctx, g, 0, -L, L);
        ctx.stroke();
        ctx.restore();
        // A tick travels down the score line every few seconds.
        const period = c > 0.5 ? 1100 : 3400;
        const tt = (now % period) / 1100;
        if (tt <= 1) {
          const s = -L + tt * 2 * L;
          const grad = ctx.createLinearGradient(
            g.cx + g.ux * (s - 140),
            g.cy + g.uy * (s - 140),
            g.cx + g.ux * s,
            g.cy + g.uy * s,
          );
          grad.addColorStop(0, `rgba(${RED},0)`);
          grad.addColorStop(1, `rgba(${RED},${0.7 + 0.3 * c})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          line(ctx, g, 0, s - 140, s);
          ctx.stroke();
        }
      }

      // 3. The cut draws, flashes when it completes, then hands over to the edges.
      if (g.cut > 0 && g.open < 1) {
        const len = g.cut * L;
        const snap = lastCut < 1 && g.cut >= 1;
        if (snap) {
          flashAt = now;
          emitSparks(g, -1, 40, 260);
          emitSparks(g, 1, 40, 260);
        }
        const flash = Math.max(1 - (now - flashAt) / 380, 0);
        ctx.strokeStyle = `rgba(${RED},${Math.max(1 - g.open * 4, 0)})`;
        ctx.lineWidth = 1.5 + flash * 3;
        line(ctx, g, 0, -len, len);
        ctx.stroke();
        if (flash > 0) {
          ctx.strokeStyle = `rgba(255,255,255,${flash * 0.9})`;
          ctx.lineWidth = 1;
          line(ctx, g, 0, -len, len);
          ctx.stroke();
        }
      }

      // 4. Torn edges: shading into the gap, the logo slash riding edge A.
      if (g.parted && g.open < 1) {
        const k = Math.min((g.a + g.b) / 40, 1);
        const fade = 1 - clamp01((g.open - 0.82) / 0.18);
        const gap = g.a + g.b;
        const shade = Math.min(80, gap * 0.5);
        for (const side of [-1, 1] as const) {
          const pose = halfPose(g, side);
          ctx.save();
          applyPose(ctx, g, pose);
          const d0 = side < 0 ? 0.75 : 0;
          const d1 = d0 - side * shade;
          const [x0, y0] = [g.cx + g.nx * d0, g.cy + g.ny * d0];
          const [x1, y1] = [g.cx + g.nx * d1, g.cy + g.ny * d1];
          const grad = ctx.createLinearGradient(x0, y0, x1, y1);
          grad.addColorStop(0, `rgba(0,0,0,${0.42 * fade})`);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          pathPoly(ctx, bandPoints(g, Math.min(d0, d1), Math.max(d0, d1)));
          ctx.fill();
          ctx.fillStyle = `rgba(${RED},${fade * k})`;
          if (side < 0) {
            pathPoly(ctx, bandPoints(g, 0.75, 0.75 + 26 * k));
            ctx.fill();
            pathPoly(ctx, bandPoints(g, 0.75 + 33 * k, 0.75 + 41 * k));
            ctx.fill();
          } else {
            // Edge B gets a single white hairline: the halves are not twins.
            ctx.fillStyle = `rgba(255,255,255,${0.85 * fade * k})`;
            pathPoly(ctx, bandPoints(g, -1.5, 0));
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // 5. Sparks shed by the tear, in proportion to how fast it opens.
      const dOpen = g.open - lastOpen;
      if (!reduce && g.parted && g.open < 0.97 && Math.abs(dOpen) > 0.0005) {
        const n = Math.min(Math.round(Math.abs(dOpen) * 700), 26);
        emitSparks(g, -1, n, 220);
        emitSparks(g, 1, Math.round(n * 0.7), 300);
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
        s.vx *= 0.96;
        s.vy *= 0.96;
        const a = s.life / s.max;
        ctx.fillStyle = s.red ? `rgba(${RED},${a})` : `rgba(255,255,255,${a * 0.9})`;
        ctx.fillRect(s.x - s.s / 2, s.y - s.s / 2, s.s, s.s);
      }

      // 6. Bracket reticle around the cursor; it locks onto the CTA.
      if (fine && introDone && !g.parted && p.inside && now - p.last < 4000) {
        const cta = root.querySelector<HTMLElement>('[data-cta="primary"]');
        const rr = rootRect();
        let tx = p.tx;
        let ty = p.ty;
        let tw = 22;
        let th = 22;
        let locked = false;
        if (cta) {
          const r = cta.getBoundingClientRect();
          const lx = r.left - rr.left;
          const ly = r.top - rr.top;
          if (p.tx > lx - 14 && p.tx < lx + r.width + 14 && p.ty > ly - 14 && p.ty < ly + r.height + 14) {
            tx = lx + r.width / 2 + ctaOff.x;
            ty = ly + r.height / 2 + ctaOff.y;
            tw = r.width + 16;
            th = r.height + 16;
            locked = true;
          }
        }
        const e = reduce ? 1 : 0.22;
        ret.x += (tx - ret.x) * e;
        ret.y += (ty - ret.y) * e;
        ret.w += (tw - ret.w) * e;
        ret.h += (th - ret.h) * e;
        const x0 = ret.x - ret.w / 2;
        const y0 = ret.y - ret.h / 2;
        const x1 = ret.x + ret.w / 2;
        const y1 = ret.y + ret.h / 2;
        const c = 6;
        ctx.strokeStyle = locked ? `rgba(${RED},1)` : "rgba(255,255,255,0.8)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, y0 + c);
        ctx.lineTo(x0, y0);
        ctx.lineTo(x0 + c, y0);
        ctx.moveTo(x1 - c, y0);
        ctx.lineTo(x1, y0);
        ctx.lineTo(x1, y0 + c);
        ctx.moveTo(x1, y1 - c);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x1 - c, y1);
        ctx.moveTo(x0 + c, y1);
        ctx.lineTo(x0, y1);
        ctx.lineTo(x0, y1 - c);
        ctx.stroke();
        if (!locked) {
          ctx.font = `10px ${mono}`;
          ctx.fillStyle = "rgba(255,255,255,0.55)";
          ctx.fillText(`X ${pad4(p.x)}  Y ${pad4(p.y)}`, x1 + 8, y1 + 2);
        }
      }
    };

    let flashAt = -1e9;

    /** Intro slit widths at progress st (0 → 1), asymmetric on purpose. */
    const slit = (g: SplitGeo, st: number) => {
      const full = g.reach + 220;
      return {
        dA: Math.pow(easeInOut(st), 1.3) * full,
        dB: Math.pow(easeInOut(st), 0.8) * full,
      };
    };

    /* ---------------------------------------------------------------- */
    /* DOM: readouts, magnetic CTA, wordmark spotlight, intro clip        */
    /* ---------------------------------------------------------------- */

    const ctaOff = { x: 0, y: 0 };
    const updateDom = (g: SplitGeo) => {
      // Reads first (rects), writes after, so no frame forces a re-layout.
      const atRest = !g.parted;
      const rr = rootRect();
      const cta = atRest ? root.querySelector<HTMLElement>('[data-cta="primary"]') : null;
      const ctaRect = cta?.getBoundingClientRect();
      const marks = atRest
        ? Array.from(root.querySelectorAll<SVGSVGElement>("svg[data-wm]")).map((svg) => ({
            svg,
            r: svg.getBoundingClientRect(),
          }))
        : [];

      // Magnetic CTA (both copies move together).
      let tx = 0;
      let ty = 0;
      if (ctaRect && fine && p.inside) {
        const cx = ctaRect.left - rr.left + ctaRect.width / 2;
        const cy = ctaRect.top - rr.top + ctaRect.height / 2;
        const dx = p.tx - cx;
        const dy = p.ty - cy;
        const reach = Math.max(ctaRect.width, ctaRect.height) * 0.5 + 90;
        if (Math.hypot(dx, dy) < reach) {
          tx = dx * 0.3;
          ty = dy * 0.38;
        }
      }
      ctaOff.x += (tx - ctaOff.x) * 0.18;
      ctaOff.y += (ty - ctaOff.y) * 0.18;

      // Wordmark spotlight follows the force point.
      for (const { svg, r } of marks) {
        const spot = svg.querySelector("[data-wm-spot]");
        if (!spot || !r.width) continue;
        const vb = svg.viewBox.baseVal;
        const k = vb.width / r.width;
        spot.setAttribute("cx", (vb.x + (p.x - (r.left - rr.left)) * k).toFixed(1));
        spot.setAttribute("cy", (vb.y + (p.y - (r.top - rr.top)) * k).toFixed(1));
        spot.setAttribute("r", ((w < 768 ? 120 : 230) * k).toFixed(1));
      }

      if (Math.abs(ctaOff.x) > 0.05 || Math.abs(ctaOff.y) > 0.05 || tx !== 0) {
        root.querySelectorAll<HTMLElement>("[data-cta-inner]").forEach((el) => {
          el.style.transform = `translate3d(${ctaOff.x.toFixed(2)}px, ${ctaOff.y.toFixed(2)}px, 0)`;
        });
      }

      // Readouts.
      if (frameN % 6 === 0) {
        const pct = symTotal ? 100 * (1 - symBroken / symTotal) : 100;
        sym += (pct - sym) * 0.5;
        const symTxt = `${sym.toFixed(1).padStart(5, "0")}%`;
        const openTxt = `${String(Math.round(g.open * 100)).padStart(3, "0")}%`;
        root.querySelectorAll<HTMLElement>('[data-ro="sym"]').forEach((el) => {
          if (el.textContent !== symTxt) el.textContent = symTxt;
        });
        root.querySelectorAll<HTMLElement>('[data-ro="open"]').forEach((el) => {
          if (el.textContent !== openTxt) el.textContent = openTxt;
        });
      }
    };

    const setWrapClip = (v: string) => {
      const wrap = refs.wrap.current;
      if (wrap && v !== wrapClipSet) {
        wrap.style.clipPath = v;
        wrapClipSet = v;
      }
    };
    const setManifesto = (g: SplitGeo) => {
      const m = refs.manifesto.current;
      if (!m) return;
      const v = introDone && (g.parted || g.cut > 0) ? "visible" : "hidden";
      if (m.style.visibility !== v) m.style.visibility = v;
    };

    /* ---------------------------------------------------------------- */

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      frameN++;
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      if (document.hidden) return;
      const g = geo.get();
      sizeCanvases(g);

      const t0 = loadedAt.current;
      const tIntro = t0 === null ? -1 : reduce ? 1e9 : now - t0;
      if (!introDone && tIntro >= INTRO_DONE_MS) introDone = true;

      // Intro clip on the hero wrapper: nothing → slit → everything.
      if (t0 === null) setWrapClip(toPolygon(bandPoints(g, 0, 0)));
      else if (!introDone) {
        const st = clamp01((tIntro - SLIT[0]) / (SLIT[1] - SLIT[0]));
        const { dA, dB } = slit(g, st);
        setWrapClip(st <= 0 ? toPolygon(bandPoints(g, 0, 0)) : toPolygon(bandPoints(g, -dA, dB)));
      } else setWrapClip("none");
      setManifesto(g);

      if (g.open >= 1) {
        if (lastOpen < 1) {
          octx.setTransform(1, 0, 0, 1, 0, 0);
          octx.clearRect(0, 0, over.width, over.height);
          sparks.length = 0;
        }
        lastOpen = g.open;
        lastCut = g.cut;
        return;
      }

      // Idle (or touch): a slow wanderer keeps the field alive.
      if (now - p.last > 2600) {
        const t = now / 1000;
        const mobile = w < 768;
        p.tx = w * (0.5 + (mobile ? 0.3 : 0.34) * Math.sin(t * (mobile ? 0.52 : 0.37)));
        p.ty = h * ((mobile ? 0.4 : 0.42) + (mobile ? 0.26 : 0.22) * Math.sin(t * 0.61 + 1.3));
        if (p.x < -9000) {
          p.x = p.tx;
          p.y = p.ty;
        }
        // Touch screens: the wanderer sends a shock ring now and then.
        if (!fine && introDone && !g.parted && !reduce && now - lastShockAuto > 2800) {
          lastShockAuto = now;
          shocks.push({ x: p.x, y: p.y, t0: now });
        }
      }
      const ease = reduce ? 1 : 0.12;
      p.x += (p.tx - p.x) * ease;
      p.y += (p.ty - p.y) * ease;
      for (let i = shocks.length - 1; i >= 0; i--) if (now - shocks[i].t0 > 1200) shocks.splice(i, 1);

      const wave = t0 === null ? 0 : reduce ? 1 : clamp01((tIntro - WAVE[0]) / (WAVE[1] - WAVE[0]));
      const intro = t0 === null ? 0 : wave >= 1 ? 1 : 0.5;

      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.clearRect(0, 0, w, h);
      symBroken = 0;
      symTotal = 0;
      if (t0 !== null) {
        const wv = easeOut(wave);
        if (g.parted) {
          drawHalf(g, -1, now, intro, wv);
          drawHalf(g, 1, now, intro, wv);
        } else drawHalf(g, 0, now, intro, wv);
      }

      drawOverlay(g, now, dt, tIntro);
      updateDom(g);
      lastOpen = g.open;
      lastCut = g.cut;
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
  }, [geo, refs]);

  /** Tell the overlay the "scroll to open" cue is hovered or focused. */
  const setCue = useCallback((on: boolean) => {
    bus.current.cue = on ? 1 : 0;
  }, []);
  return { setCue };
}
