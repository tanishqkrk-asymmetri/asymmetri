"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { useHeroSplit } from "@/hooks/useHeroSplit";
import { HeroSplit } from "./HeroSplit";
import { ManifestoBoard } from "./ManifestoBoard";

// The split and manifesto timings were written against page-scroll fractions
// 0 → 0.1. This chapter's own pinned progress is mapped onto that range.
const RANGE = 0.1;

/**
 * Opening chapter: the hero tears open along the logo's slash and the
 * manifesto writes itself into the gap. Pinned for the whole chapter.
 */
export function HeroChapter({ loaded }: { loaded: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref, "pin");
  const v = useTransform(p, [0, 1], [0, RANGE]);
  const split = useHeroSplit(v);
  const background = useTransform(v, [0.09, 0.098], ["#ffffff", "#000000"]);
  const color = useTransform(v, [0.09, 0.098], ["#000000", "#ffffff"]);
  const y = useMotionValue("0vh");

  return (
    <section ref={ref} data-chapter="Intro" data-nav="dark" className="relative h-[340vh] bg-black">
      <div className="sticky top-0 z-[9] h-screen overflow-hidden">
        <HeroSplit loaded={loaded} split={split} />
        <motion.div
          style={{ clipPath: split.gapClip, background }}
          className="pointer-events-none absolute inset-0 z-[999] overflow-hidden"
        >
          <ManifestoBoard pageScroll={v} color={color} y={y} />
        </motion.div>
      </div>
    </section>
  );
}
