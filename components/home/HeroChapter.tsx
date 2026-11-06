"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { useHeroSplit, type SplitOptions } from "@/hooks/useHeroSplit";
import { HeroSplit, type HeroVariant } from "./HeroSplit";
import { ManifestoBoard } from "./ManifestoBoard";
import { APERTURE_SPLIT } from "./hero/aperture/HeroAperture";
import { CHAPTER_VH, toneAt, type Tone } from "./hero/timeline";
import { LogoHandoff } from "./hero/LogoHandoff";

/**
 * Which hero opens the page. "aperture" (default): a closed door with light
 * leaking through the logo slash. "v2": the previous hero (bold headline,
 * outline wordmark, crosshair symmetry field). Both tear open the same way.
 */
export const HERO_VARIANT: HeroVariant = "aperture";

const SPLIT_OPTIONS: Record<HeroVariant, SplitOptions> = {
  aperture: APERTURE_SPLIT,
  v2: {},
};

/**
 * Opening chapter, pinned for its whole length (see hero/timeline.ts): the
 * hero tears open along the logo's slash onto the manifesto, which writes
 * itself in on one screen and ends on black, ready for the tile transition.
 *
 * Layers inside the pinned frame, bottom to top: the manifesto board, the
 * hero halves, the hero's overlay canvas.
 */
export function HeroChapter({ loaded }: { loaded: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref, "pin");
  const split = useHeroSplit(p, stickyRef, SPLIT_OPTIONS[HERO_VARIANT]);

  // The navbar follows whichever stage is under it.
  const [tone, setTone] = useState<Tone>("dark");
  useMotionValueEvent(p, "change", (v) => setTone(toneAt(v)));

  // While the door is closed, page chrome (navbar CTA, chapter HUD) stays out
  // of the way; it appears once the hero opens (see the [html[data-hero=closed]_&] classes).
  useEffect(() => {
    const root = document.documentElement;
    const set = (open: number) => {
      root.dataset.hero = open > 0.5 ? "open" : "closed";
    };
    set(split.geo.get().open);
    const off = split.geo.on("change", (g) => set(g.open));
    return () => {
      off();
      delete root.dataset.hero;
    };
  }, [split.geo]);

  return (
    <section
      ref={ref}
      data-chapter="Intro"
      data-nav={tone}
      style={{ height: `${CHAPTER_VH}vh` }}
      className="relative bg-black"
    >
      <div ref={stickyRef} className="sticky top-0 z-[9] h-screen overflow-hidden">
        <ManifestoBoard p={p} boardRef={boardRef} />
        <HeroSplit
          variant={HERO_VARIANT}
          loaded={loaded}
          split={split}
          rootRef={stickyRef}
          manifestoRef={boardRef}
          sectionRef={ref}
        />
      </div>
      <LogoHandoff progress={p} loaded={loaded} />
    </section>
  );
}
