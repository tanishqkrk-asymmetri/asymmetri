"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { PointOfViewScene } from "@/components/home/PointOfViewScene";

export function PointOfView() {
  const ref = useRef<HTMLElement>(null);
  const progress = useSectionProgress(ref, "pin");
  const reduce = useReducedMotion();
  return (
    <section
      ref={ref}
      id="point-of-view"
      data-chapter="Point of view"
      data-nav="dark"
      className={`relative bg-[#0a0a0a] ${reduce ? "" : "h-[270vh]"}`}
    >
      <PointOfViewScene progress={progress} />
    </section>
  );
}
