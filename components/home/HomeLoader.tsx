"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FatCursors } from "@/components/FatCursors";
import { Wordmark } from "@/components/brand/Wordmark";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * White intro card under the hero: the wordmark, a mono counter and a red
 * hairline filling to 100. The hero scales up over it, then it unmounts.
 */
export function HomeLoader({ pct }: { pct: number }) {
  const [gone, setGone] = useState(false);
  const done = pct >= 100;

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 1700);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[8] overflow-hidden bg-white text-black"
          aria-hidden
        >
          <FatCursors scale={1} />
          <div className="absolute inset-x-0 top-1/2 mx-auto w-[min(30rem,82vw)] -translate-y-1/2">
            <Wordmark color="#000000" className="h-auto w-full" />
            <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-black/50">
              <span>Hard problems</span>
              <span className="tabular-nums text-asymmetri-red">
                {String(Math.min(pct, 100)).padStart(3, "0")}
              </span>
            </div>
            <div className="mt-2 h-px w-full bg-black/10">
              <motion.div
                className="h-px origin-left bg-asymmetri-red"
                style={{ scaleX: Math.min(pct, 100) / 100 }}
                transition={{ ease: EASE }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
