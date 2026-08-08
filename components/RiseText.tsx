"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

type RiseTextProps = {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  /** Delay before the first line starts animating. */
  delay?: number;
  /** Extra delay added per line index. */
  stagger?: number;
  duration?: number;
  /** Initial y offset before the line rises into view. */
  fromY?: string | number;
};

export function RiseText({
  lines,
  className,
  lineClassName = "max-h-16 overflow-hidden",
  delay = 0,
  stagger = 0.2,
  duration = 0.6,
  fromY = "200%",
}: RiseTextProps) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <motion.span key={i} className={lineClassName}>
          <motion.div
            initial={{ y: fromY }}
            animate={{ y: "0%" }}
            transition={{
              type: "keyframes",
              delay: delay + i * stagger,
              duration,
            }}
          >
            {line}
          </motion.div>
        </motion.span>
      ))}
    </div>
  );
}
