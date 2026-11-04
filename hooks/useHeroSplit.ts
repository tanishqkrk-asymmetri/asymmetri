"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Geometry for the hero's "asymmetric cut": the screen tears open along the
 * angle of the slash in the Asymmetri logo. Everything here is a function of
 * the page's (legacy) scroll, so it scrubs both ways.
 */

// Timeline, in legacy page-scroll fractions (the old split ran 0 → 0.1).
export const CUT_START = 0.001;
export const CUT_END = 0.012;
export const OPEN_START = 0.01;
export const OPEN_END = 0.055;

// Slash direction from the brand mark (dx 22.27, dy 44.9).
const UX = 0.4446;
const UY = 0.8957;
// Normal, pointing to the right-hand (B) side.
const NX = UY;
const NY = -UX;
// The cut sits right of centre: asymmetric on purpose.
const CENTER_X = 0.54;

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
  open: number;
  cut: number;
};

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function splitGeo(v: number, w: number, h: number): SplitGeo {
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
  // Half A eases out slower than half B: the halves part unevenly.
  const a = Math.pow(open, 1.25) * (-dMin + 80);
  const b = Math.pow(open, 0.85) * (dMax + 80);
  return { w, h, cx, cy, ux: UX, uy: UY, nx: NX, ny: NY, a, b, open, cut };
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

const toPolygon = (pts: readonly (readonly [number, number])[]) =>
  `polygon(${pts.map(([x, y]) => pt(x, y)).join(", ")})`;

export function useHeroSplit(pageScroll: MotionValue<number>) {
  const W = useMotionValue(1440);
  const H = useMotionValue(900);

  useEffect(() => {
    const measure = () => {
      W.set(window.innerWidth);
      H.set(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [W, H]);

  const geo = useTransform([pageScroll, W, H], ([v, w, h]: number[]) =>
    splitGeo(v, w, h),
  );

  // Each half keeps its own side of the cut (1px overlap hides the seam).
  const clipA = useTransform(geo, (g) => toPolygon(bandPoints(g, -BIG, 0.75)));
  const clipB = useTransform(geo, (g) => toPolygon(bandPoints(g, 0, BIG)));
  const ax = useTransform(geo, (g) => -g.a * g.nx);
  const ay = useTransform(geo, (g) => -g.a * g.ny);
  const bx = useTransform(geo, (g) => g.b * g.nx);
  const by = useTransform(geo, (g) => g.b * g.ny);
  // The opening itself, used to reveal what sits behind the hero.
  const gapClip = useTransform(geo, (g) =>
    g.open >= 1 ? "none" : toPolygon(bandPoints(g, -g.a, g.b)),
  );

  return { geo, clipA, clipB, ax, ay, bx, by, gapClip };
}
