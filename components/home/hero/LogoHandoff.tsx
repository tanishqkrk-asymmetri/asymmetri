"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import {
  POTRACE_TRANSFORM,
  WORDMARK_GLYPHS,
  WORDMARK_SLASH,
  WORDMARK_VIEWBOX,
} from "@/components/brand/wordmark-paths";
import { OPEN_START } from "./timeline";

/**
 * The hero's full wordmark, floating above the page. As the door opens the
 * letters fold back into the A, right to left, then the A and its red slash
 * shrink and fly into the navbar, where the icon logo takes over.
 * The navbar icon reads --hero-icon (0 → 1) for that crossfade.
 */

const [VBX, VBY, VBW] = WORDMARK_VIEWBOX.split(" ").map(Number);
const A_X = WORDMARK_GLYPHS[0].x;
const LAST = WORDMARK_GLYPHS.length - 1;

// The handoff runs over this stretch of the chapter's scroll, linearly (the
// door's own opening is eased and too quick to carry it).
const SPAN = [OPEN_START, 0.3] as const;

// Windows within that stretch.
const FOLD = [0.04, 0.42] as const; // letters fold into the A
const FLY = [0.3, 0.92] as const; // the mark flies to the navbar
const SWAP = [0.9, 1] as const; // crossfade to the real icon

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Rect = { x: number; y: number; w: number };

/** Where the wordmark rests in the hero's top row (matches HeroAperture's padding). */
function restRect(vw: number): Rect {
  if (vw >= 768) return { x: 48, y: 84, w: 160 };
  if (vw >= 640) return { x: 32, y: 72, w: 128 };
  return { x: 20, y: 72, w: 128 };
}

const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

function Letter({ i, open }: { i: number; open: MotionValue<number> }) {
  const g = WORDMARK_GLYPHS[i];
  // Rightmost letters go first.
  const start = FOLD[0] + ((LAST - i) / LAST) * (FOLD[1] - FOLD[0] - 0.12);
  const t = useTransform(open, (v) => ease(clamp01((v - start) / 0.12)));
  const x = useTransform(t, (v) => -(g.x - A_X) * 0.7 * v);
  const opacity = useTransform(t, (v) => 1 - v);
  return (
    <motion.g style={{ x, opacity }}>
      <path transform={POTRACE_TRANSFORM} d={g.d} fill="currentColor" />
    </motion.g>
  );
}

export function LogoHandoff({
  progress,
  loaded,
}: {
  /** The hero chapter's pinned progress. */
  progress: MotionValue<number>;
  loaded: boolean;
}) {
  const mounted = useMounted();
  const markRef = useRef<SVGGElement>(null);
  const path = useRef<{ from: Rect; to: Rect } | null>(null);
  const open = useTransform(progress, (v) => clamp01((v - SPAN[0]) / (SPAN[1] - SPAN[0])));

  const measure = useCallback(() => {
    const icon = document.querySelector<HTMLElement>('header img[alt="Asymmetri home"]');
    const mark = markRef.current;
    if (!icon || !mark) return;
    const r = icon.getBoundingClientRect();
    const bb = mark.getBBox();
    if (!r.height || !bb.height) return;
    // Scale so the A and slash fill the icon's height, then line their corner up with it.
    const k = r.height / bb.height;
    path.current = {
      from: restRect(window.innerWidth),
      to: { w: VBW * k, x: r.left - (bb.x - VBX) * k, y: r.top - (bb.y - VBY) * k },
    };
    open.set(open.get() + 1e-9);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 600); // after fonts and the navbar settle
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [mounted, measure]);

  // The navbar icon fades in as the mark lands on it.
  useMotionValueEvent(open, "change", (v) => {
    document.documentElement.style.setProperty("--hero-icon", String(clamp01((v - SWAP[0]) / (SWAP[1] - SWAP[0]))));
  });
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--hero-icon", String(clamp01((open.get() - SWAP[0]) / (SWAP[1] - SWAP[0]))));
    return () => {
      root.style.removeProperty("--hero-icon");
    };
  }, [open]);

  const fly = useTransform(open, (v) => ease(clamp01((v - FLY[0]) / (FLY[1] - FLY[0]))));
  const at = (t: number): Rect => {
    const p = path.current;
    if (!p) return restRect(typeof window === "undefined" ? 1440 : window.innerWidth);
    return { x: lerp(p.from.x, p.to.x, t), y: lerp(p.from.y, p.to.y, t), w: lerp(p.from.w, p.to.w, t) };
  };
  const x = useTransform(fly, (t) => at(t).x);
  const y = useTransform(fly, (t) => at(t).y);
  const width = useTransform(fly, (t) => at(t).w);
  const opacity = useTransform(open, [SWAP[0], SWAP[1]], [1, 0]);

  if (!mounted) return null;
  // Two layers in step: the letters invert against whatever is behind them
  // (white on the black door, black on the white manifesto and navbar); the
  // red slash sits on its own layer so it stays red.
  const layer = (children: React.ReactNode, blend: boolean) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.8, delay: loaded ? 0.6 : 0 }}
      className={`pointer-events-none fixed inset-0 z-[99999999999999] ${blend ? "mix-blend-difference" : ""}`}
      aria-hidden
    >
      <motion.svg
        viewBox={WORDMARK_VIEWBOX}
        style={{ x, y, width, opacity }}
        className="absolute top-0 left-0 h-auto overflow-visible"
      >
        {children}
      </motion.svg>
    </motion.div>
  );
  return createPortal(
    <>
      {layer(
        <g className="text-white">
          {WORDMARK_GLYPHS.slice(1).map((_, j) => (
            <Letter key={j} i={j + 1} open={open} />
          ))}
          <g ref={markRef}>
            <path transform={POTRACE_TRANSFORM} d={WORDMARK_GLYPHS[0].d} fill="currentColor" />
            <path transform={POTRACE_TRANSFORM} d={WORDMARK_SLASH} fill="none" />
          </g>
        </g>,
        true,
      )}
      {layer(<path transform={POTRACE_TRANSFORM} d={WORDMARK_SLASH} fill="#C1272D" />, false)}
    </>,
    document.body,
  );
}
