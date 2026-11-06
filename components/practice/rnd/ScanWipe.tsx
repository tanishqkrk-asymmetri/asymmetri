"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";

const BARS = 14;

function Bar({ p, i, to }: { p: MotionValue<number>; i: number; to: string }) {
  // Deterministic jitter so the scan lines land out of order.
  const j = Math.abs(Math.sin(i * 91.17 + 3.1)) % 1;
  const start = 0.04 + j * 0.28;
  const scaleX = useTransform(p, [start, start + 0.18], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, background: to, transformOrigin: i % 2 ? "right" : "left" }}
      className="w-full flex-1"
    />
  );
}

/**
 * Section transition: horizontal scan lines sweep in from alternating sides,
 * like a display refreshing from one colour to the next.
 */
export function ScanWipe({
  from,
  to,
  label,
}: {
  from: string;
  to: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref, "pass");
  const labelOpacity = useTransform(p, [0.1, 0.25, 0.4, 0.5], [0, 1, 1, 0]);
  return (
    <div ref={ref} style={{ background: from }} className="relative flex h-[90vh] flex-col" aria-hidden>
      {Array.from({ length: BARS }, (_, i) => (
        <Bar key={i} p={p} i={i} to={to} />
      ))}
      {label && (
        <motion.span
          style={{ opacity: labelOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-asymmetri-red px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-white"
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}
