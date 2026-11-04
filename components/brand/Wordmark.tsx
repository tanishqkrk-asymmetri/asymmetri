"use client";

import { motion } from "motion/react";
import {
  POTRACE_TRANSFORM,
  WORDMARK_GLYPHS,
  WORDMARK_SLASH,
  WORDMARK_VIEWBOX,
} from "./wordmark-paths";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const MIN_X = WORDMARK_GLYPHS[0].x;
const SPAN_X = WORDMARK_GLYPHS[WORDMARK_GLYPHS.length - 1].x - MIN_X;

/**
 * The Asymmetri wordmark as inline vector paths (brand kit master).
 * With `play`, the letters rise out of the baseline left to right and the
 * red slash, the asymmetric piece, slides in last along its own angle.
 */
export function Wordmark({
  color = "#ffffff",
  play,
  delay = 0,
  className,
  title = "Asymmetri",
}: {
  color?: string;
  /** undefined = static; false = hidden, waiting; true = play the intro */
  play?: boolean;
  delay?: number;
  className?: string;
  title?: string;
}) {
  const animated = play !== undefined;
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={className}
      role="img"
      aria-label={title}
      overflow="hidden"
    >
      <title>{title}</title>
      {WORDMARK_GLYPHS.map((g, i) => {
        const t = (g.x - MIN_X) / SPAN_X;
        return (
          <motion.g
            key={i}
            initial={animated ? { y: 340 } : false}
            animate={animated ? { y: play ? 0 : 340 } : undefined}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: delay + t * 0.45 }}
          >
            <path transform={POTRACE_TRANSFORM} d={g.d} fill={color} />
          </motion.g>
        );
      })}
      <motion.g
        initial={animated ? { x: -90, y: -180, opacity: 0 } : false}
        animate={
          animated
            ? play
              ? { x: 0, y: 0, opacity: 1 }
              : { x: -90, y: -180, opacity: 0 }
            : undefined
        }
        transition={{ duration: 0.9, ease: EASE_OUT, delay: delay + 0.75 }}
      >
        <path transform={POTRACE_TRANSFORM} d={WORDMARK_SLASH} fill="#C1272D" />
      </motion.g>
    </svg>
  );
}
