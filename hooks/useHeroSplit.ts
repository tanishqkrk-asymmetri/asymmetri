"use client";

import { useEffect, type RefObject } from "react";
import {
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  CUT_END,
  CUT_START,
  OPEN_END,
  OPEN_START,
} from "@/components/home/hero/timeline";

/**
 * Geometry for the hero's "asymmetric cut": the screen tears open along the
 * angle of the slash in the Asymmetri logo. Everything is a function of the
 * chapter's pinned progress, so it scrubs both ways.
 *
 * Each half is a rigid sheet: it slides away along the cut's normal and
 * twists a few degrees about the centre of the cut, the two halves by
 * different amounts. The DOM copies (CSS transforms) and the canvases (ctx
 * transforms) apply the exact same matrix, so they stay glued together.
 *
 * Options (used by the "aperture" hero):
 * - gap: the halves rest a few pixels apart, so a slit of light shows.
 * - closed: starts at 0 with the halves off screen; animating it to 1 slams
 *   them shut (half A lands first, half B a beat later, both recoil).
 *   Without the option it is 1 and has no effect.
 */

export { CUT_START, CUT_END, OPEN_START, OPEN_END };

// Slash direction from the brand mark (dx 22.27, dy 44.9).
const UX = 0.4446;
const UY = 0.8957;
// Normal, pointing to the right-hand (B) side.
const NX = UY;
const NY = -UX;
// The cut sits right of centre: asymmetric on purpose.
export const CENTER_X = 0.54;
/** Angle of the cut from vertical, in degrees (shown in the hero HUD). */
export const CUT_DEG = (Math.atan2(UX, UY) * 180) / Math.PI;

// Maximum twist of each half, in radians.
const TWIST_A = (-3.2 * Math.PI) / 180;
const TWIST_B = (2.1 * Math.PI) / 180;

export type SplitGeo = {
  w: number;
  h: number;
  cx: number;
  cy: number;
  ux: number;
  uy: number;
  nx: number;
  ny: number;
  /** distance half A has travelled (towards -n) */
  a: number;
  /** distance half B has travelled (towards +n) */
  b: number;
  /** twist of each half about (cx, cy), radians */
  ra: number;
  rb: number;
  open: number;
  cut: number;
  /** true once the halves are apart at all (scroll or tease) */
  parted: boolean;
  /** farthest screen corner from the cut, on either side */
  reach: number;
};

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export type SplitOptions = {
  /** resting distance of each half from the cut, px: [A, B] */
  gap?: readonly [number, number];
  /** start with the halves off screen (see `closed`) */
  startOpen?: boolean;
};

/** Door slam: 1 = away, 0 = shut, with a small damped recoil after impact. */
function slam(t: number, start: number, land: number) {
  if (t <= start) return { away: 1, recoil: 0 };
  if (t < land) {
    const k = (t - start) / (land - start);
    return { away: 1 - Math.pow(k, 2.4), recoil: 0 };
  }
  const k = Math.min((t - land) / (1 - land), 1);
  return { away: 0, recoil: Math.sin(k * Math.PI * 2.2) * Math.pow(1 - k, 2) };
}

export function splitGeo(
  v: number,
  w: number,
  h: number,
  tease = 0,
  closed = 1,
  gap: readonly [number, number] = [0, 0],
): SplitGeo {
  const cx = w * CENTER_X;
  const cy = h * 0.5;
  const cut = clamp((v - CUT_START) / (CUT_END - CUT_START));
  const open = easeInOut(clamp((v - OPEN_START) / (OPEN_END - OPEN_START)));
  // How far each half must travel to leave the screen completely.
  let dMin = 0;
  let dMax = 0;
  for (const [x, y] of [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ]) {
    const d = (x - cx) * NX + (y - cy) * NY;
    dMin = Math.min(dMin, d);
    dMax = Math.max(dMax, d);
  }
  // Half A eases out slower than half B: the halves part unevenly. The
  // margin covers the corners the twist swings back into view.
  let a = Math.pow(open, 1.25) * (-dMin + 180) + tease * 9 + gap[0];
  let b = Math.pow(open, 0.85) * (dMax + 180) + tease * 15 + gap[1];
  if (closed < 1) {
    const sa = slam(closed, 0, 0.7);
    const sb = slam(closed, 0.1, 0.84);
    a += sa.away * (-dMin + 140) + sa.recoil * 7;
    b += sb.away * (dMax + 140) + sb.recoil * 11;
  }
  const ra = TWIST_A * Math.pow(open, 0.8) - tease * 0.0035;
  const rb = TWIST_B * Math.pow(open, 1.1) + tease * 0.0025;
  return {
    w,
    h,
    cx,
    cy,
    ux: UX,
    uy: UY,
    nx: NX,
    ny: NY,
    a,
    b,
    ra,
    rb,
    open,
    cut,
    parted: a + b - gap[0] - gap[1] > 0.05,
    reach: Math.max(-dMin, dMax),
  };
}

const pt = (x: number, y: number) => `${x.toFixed(1)}px ${y.toFixed(1)}px`;

/** Points of the band between offsets d1 and d2 along the normal. */
export function bandPoints(g: SplitGeo, d1: number, d2: number) {
  const L = (g.w + g.h) * 2;
  const p = (d: number, s: number) =>
    [g.cx + g.nx * d + g.ux * s * L, g.cy + g.ny * d + g.uy * s * L] as const;
  return [p(d1, -1), p(d1, 1), p(d2, 1), p(d2, -1)];
}

export const BIG = 1e5;

export const toPolygon = (pts: readonly (readonly [number, number])[]) =>
  `polygon(${pts.map(([x, y]) => pt(x, y)).join(", ")})`;

/** Offset and twist of one half (-1 = A, 1 = B). */
export function halfPose(g: SplitGeo, side: -1 | 1) {
  const d = side < 0 ? -g.a : g.b;
  return { ox: g.nx * d, oy: g.ny * d, rot: side < 0 ? g.ra : g.rb };
}

const NO_GAP = [0, 0] as const;

export function useHeroSplit(
  progress: MotionValue<number>,
  box?: RefObject<HTMLElement | null>,
  options: SplitOptions = {},
) {
  const gap = options.gap ?? NO_GAP;
  const W = useMotionValue(1440);
  const H = useMotionValue(900);
  /** 0 → 1 → 0 nudges the halves apart a few pixels: a preview of the cut. */
  const tease = useMotionValue(0);
  /** 0 → 1 slams the halves shut (only when startOpen). */
  const closed = useMotionValue(options.startOpen ? 0 : 1);

  useEffect(() => {
    const measure = () => {
      const el = box?.current;
      W.set(el?.clientWidth || window.innerWidth);
      H.set(el?.clientHeight || window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = box?.current ? new ResizeObserver(measure) : null;
    if (ro && box?.current) ro.observe(box.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [W, H, box]);

  const geo = useTransform([progress, W, H, tease, closed], ([v, w, h, t, c]: number[]) =>
    splitGeo(v, w, h, t, c, gap),
  );

  // Each half keeps its own side of the cut (1px overlap hides the seam).
  const clipA = useTransform(geo, (g) => toPolygon(bandPoints(g, -BIG, 0.75)));
  const clipB = useTransform(geo, (g) => toPolygon(bandPoints(g, 0, BIG)));
  const ax = useTransform(geo, (g) => -g.a * g.nx);
  const ay = useTransform(geo, (g) => -g.a * g.ny);
  const bx = useTransform(geo, (g) => g.b * g.nx);
  const by = useTransform(geo, (g) => g.b * g.ny);
  const rotA = useTransform(geo, (g) => (g.ra * 180) / Math.PI);
  const rotB = useTransform(geo, (g) => (g.rb * 180) / Math.PI);
  const origin = useTransform(geo, (g) => `${g.cx}px ${g.cy}px`);

  return { geo, clipA, clipB, ax, ay, bx, by, rotA, rotB, origin, tease, closed };
}
