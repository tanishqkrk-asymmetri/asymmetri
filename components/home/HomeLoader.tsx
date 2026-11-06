"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FatCursors } from "@/components/FatCursors";
import { Wordmark } from "@/components/brand/Wordmark";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * White intro card under the hero: the wordmark, a mono counter and a red
 * hairline filling to 100. At 100 the card clears itself in a beat, a red
 * line scores it along the logo slash and the hero opens through that slit
 * (drawn by the hero, which sits above this card). Then it unmounts.
 */
export function HomeLoader({ pct }: { pct: number }) {
  const [gone, setGone] = useState(false);
  const done = pct >= 100;

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 1600);
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
          <motion.div animate={{ opacity: done ? 0 : 1 }} transition={{ duration: 0.3 }}>
            <FatCursors scale={1} />
          </motion.div>
          <motion.div
            className="absolute inset-x-0 top-1/2 mx-auto w-[min(30rem,82vw)] -translate-y-1/2"
            animate={done ? { y: -18, opacity: 0, filter: "blur(6px)" } : { y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Wordmark color="#000000" className="h-auto w-full" />
            <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-black/50">
              <span>Hard problems</span>
              <span className="tabular-nums text-asymmetri-red">
                {done ? "Open" : String(Math.min(pct, 100)).padStart(3, "0")}
              </span>
            </div>
            <div className="mt-2 h-px w-full bg-black/10">
              <motion.div
                className="h-px origin-left bg-asymmetri-red"
                style={{ scaleX: Math.min(pct, 100) / 100 }}
                transition={{ ease: EASE }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
