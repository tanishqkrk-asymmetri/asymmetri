"use client";

import { memo, useRef } from "react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import {
  motion,
  useTransform,
  type MotionValue,
} from "motion/react";

// Same deterministic jitter as the home page's original TransitionGrid,
// driven by this block's own scroll instead of the page's.
function range(i: number): [number, number] {
  const startNoise = Math.abs(Math.sin(i * 12.9898 + 78.233)) % 1;
  const durNoise = Math.abs(Math.sin(i * 39.3467 + 11.135)) % 1;
  const row = Math.floor(i / 10);
  const start = 0.12 + row * 0.045 + (startNoise - 0.5) * 0.18;
  return [start, start + 0.04 + durNoise * 0.08];
}

function Tile({
  p,
  i,
  from,
  to,
}: {
  p: MotionValue<number>;
  i: number;
  from: string;
  to: string;
}) {
  const r = range(i);
  const background = useTransform(p, r, [from, to]);
  // A 1px halo in the tile's own colour hides seams between fractional-size tiles.
  const boxShadow = useTransform(p, r, [`0 0 0 1px ${from}`, `0 0 0 1px ${to}`]);
  return <motion.div style={{ background, boxShadow }} className="relative h-full w-full" />;
}

function TileTransitionComponent({
  from,
  to,
  height = "130vh",
}: {
  from: string;
  to: string;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref, "pass");
  return (
    <div
      ref={ref}
      style={{ minHeight: height, background: from }}
      className="grid w-full grid-cols-10 overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: 100 }, (_, i) => (
        <Tile key={i} p={p} i={i} from={from} to={to} />
      ))}
    </div>
  );
}

export const TileTransition = memo(TileTransitionComponent);
