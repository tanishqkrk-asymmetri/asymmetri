"use client";

import { useId } from "react";
import { motion } from "motion/react";
import {
  POTRACE_TRANSFORM,
  WORDMARK_GLYPHS,
  WORDMARK_SLASH,
  WORDMARK_VIEWBOX,
} from "@/components/brand/wordmark-paths";

const EASE = [0.16, 1, 0.3, 1] as const;
const MIN_X = WORDMARK_GLYPHS[0].x;
const SPAN_X = WORDMARK_GLYPHS[WORDMARK_GLYPHS.length - 1].x - MIN_X;

/**
 * The wordmark as the hero's monument, but held back so the headline leads:
 * a hairline outline over a faint fill. A spotlight (moved by the hero
 * engine, under the cursor or the idle wanderer) burns it in solid white.
 * The red slash, the asymmetric piece, is always solid.
 */
export function HeroWordmark({ play, delay = 0 }: { play: boolean; delay?: number }) {
  const id = useId().replace(/[:«»]/g, "");
  const grad = `wm-g-${id}`;
  const mask = `wm-m-${id}`;
  const glyphs = WORDMARK_GLYPHS.map((g) => (
    <path key={g.x} transform={POTRACE_TRANSFORM} d={g.d} />
  ));

  return (
    <svg
      data-wm
      viewBox={WORDMARK_VIEWBOX}
      className="block h-auto w-full overflow-visible"
      aria-hidden
    >
      <defs>
        <radialGradient id={grad}>
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="4000" height="1000">
          <circle data-wm-spot cx="-9999" cy="-9999" r="400" fill={`url(#${grad})`} />
        </mask>
      </defs>

      {/* Faint body */}
      <motion.g
        fill="#ffffff"
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 0.07 : 0 }}
        transition={{ duration: 1.2, delay: delay + 1.0 }}
      >
        {glyphs}
      </motion.g>

      {/* Hairline outline, drawn in letter by letter */}
      <g fill="none" stroke="#ffffff" strokeOpacity={0.55}>
        {WORDMARK_GLYPHS.map((g) => {
          const t = (g.x - MIN_X) / SPAN_X;
          return (
            <motion.path
              key={g.x}
              transform={POTRACE_TRANSFORM}
              d={g.d}
              vectorEffect="non-scaling-stroke"
              strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: play ? 1 : 0 }}
              transition={{ duration: 1.3, ease: EASE, delay: delay + t * 0.5 }}
            />
          );
        })}
      </g>

      {/* Burned-in under the spotlight */}
      <g fill="#ffffff" mask={`url(#${mask})`}>{glyphs}</g>

      <motion.g
        initial={{ x: -90, y: -180, opacity: 0 }}
        animate={play ? { x: 0, y: 0, opacity: 1 } : { x: -90, y: -180, opacity: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: delay + 0.8 }}
      >
        <path transform={POTRACE_TRANSFORM} d={WORDMARK_SLASH} fill="#cd1717" />
      </motion.g>
    </svg>
  );
}
