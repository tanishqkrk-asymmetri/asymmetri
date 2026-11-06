"use client";

import { motion, useInView } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { useRef, type ReactNode } from "react";

type Props = {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Play on mount instead of when scrolled into view (for heroes). */
  immediate?: boolean;
};

/**
 * Each line rises out of its own mask with a slight skew, like type being
 * pushed up through a slot. Use inside headings: renders spans only.
 *
 * Visibility is watched on the outer wrapper: the moving lines start fully
 * clipped by their masks, so an observer on them would never fire.
 */
export function MaskLines({
  lines,
  className,
  lineClassName = "",
  delay = 0,
  stagger = 0.09,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const reduce = useReducedMotion();
  const hidden = reduce
    ? { y: "0%", skewY: 0, opacity: 1 }
    : { y: "110%", skewY: 6, opacity: 1 };
  const shown = { y: "0%", skewY: 0, opacity: 1 };
  const play = immediate || inView;

  return (
    <span ref={ref} className={`block ${className ?? ""}`}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`block overflow-hidden pb-[0.06em] -mb-[0.06em] ${lineClassName}`}
        >
          <motion.span
            className="block origin-bottom-left will-change-transform"
            initial={hidden}
            animate={play ? shown : hidden}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
