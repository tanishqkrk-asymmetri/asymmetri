"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

/**
 * A pinned hard cut between two sections: a diagonal blade with a red edge
 * slices across the screen and leaves the next colour behind.
 */
export function SlashWipe({
  from,
  to,
  label,
  flip = false,
}: {
  from: string;
  to: string;
  label?: string;
  flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref);
  // Left and right edge heights of the blade, in % of the screen.
  const edge = (v: number, lead: number) => {
    const e = clamp(v * 1.15);
    const t = 1 - Math.pow(1 - e, 3);
    return 100 + 40 * lead - t * (140 + 40 * lead);
  };
  const clip = useTransform(p, (v) => {
    const l = edge(v, flip ? 1 : 0);
    const r = edge(v, flip ? 0 : 1);
    return `polygon(0% ${l}%, 100% ${r}%, 100% 100%, 0% 100%)`;
  });
  const redClip = useTransform(p, (v) => {
    const l = edge(v, flip ? 1 : 0) - 1.6;
    const r = edge(v, flip ? 0 : 1) - 1.6;
    return `polygon(0% ${l}%, 100% ${r}%, 100% 100%, 0% 100%)`;
  });
  const labelOpacity = useTransform(p, [0.1, 0.3, 0.6, 0.8], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-[150vh]" style={{ background: from }} aria-hidden>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0 bg-asymmetri-red" style={{ clipPath: redClip }} />
        <motion.div className="absolute inset-0" style={{ clipPath: clip, background: to }} />
        {label && (
          <motion.p
            style={{ opacity: labelOpacity }}
            className="absolute inset-x-0 top-1/2 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-white mix-blend-difference md:text-xs"
          >
            {label}
          </motion.p>
        )}
      </div>
    </div>
  );
}
