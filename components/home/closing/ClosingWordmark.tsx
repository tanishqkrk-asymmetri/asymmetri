"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import {
  POTRACE_TRANSFORM,
  WORDMARK_GLYPHS,
  WORDMARK_SLASH,
  WORDMARK_VIEWBOX,
} from "@/components/brand/wordmark-paths";

const EASE = [0.16, 1, 0.3, 1] as const;
const [VX, , VW] = WORDMARK_VIEWBOX.split(" ").map(Number);
const MID = VX + VW / 2;

/**
 * The page's last image. The hero opened by tearing along the slash; here the
 * wordmark shuts: its two halves slide in from the edges and meet, then the
 * slash, the asymmetric piece, drops into place in white.
 */
export function ClosingWordmark({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  const reduce = useReducedMotion();
  const play = reduce || inView;

  return (
    <svg
      ref={ref}
      viewBox={WORDMARK_VIEWBOX}
      className={className}
      role="img"
      aria-label="Asymmetri"
      overflow="hidden"
    >
      {WORDMARK_GLYPHS.map((g, i) => {
        const left = g.x < MID;
        const from = left ? -VW * 0.55 : VW * 0.55;
        return (
          <motion.g
            key={i}
            initial={reduce ? false : { x: from }}
            animate={{ x: play ? 0 : from }}
            transition={{
              duration: 1.25,
              ease: EASE,
              // Letters nearest the seam arrive last, so the halves "lock".
              delay: (left ? (MID - g.x) / VW : (g.x - MID) / VW) * -0.5 + 0.5,
            }}
          >
            <path transform={POTRACE_TRANSFORM} d={g.d} fill="#000000" />
          </motion.g>
        );
      })}
      <motion.g
        initial={reduce ? false : { x: 120, y: -260, opacity: 0 }}
        animate={play ? { x: 0, y: 0, opacity: 1 } : { x: 120, y: -260, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1], delay: 1.45 }}
      >
        <path transform={POTRACE_TRANSFORM} d={WORDMARK_SLASH} fill="#ffffff" />
      </motion.g>
    </svg>
  );
}
