"use client";

import { RefObject, useEffect, useSyncExternalStore } from "react";
import { animate, useInView, useMotionValue, type MotionValue } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { useReduceMotion } from "@/hooks/useReduceMotion";

const MD = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(MD);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True at md and up. False on the server and during hydration. */
export function useIsMd() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(MD).matches, () => false);
}

/**
 * One 0..1 value that drives a scene. On md+ it is the pinned section's
 * scroll progress; on small screens it plays once over `duration` when the
 * scene comes into view; with reduced motion it is simply 1.
 */
export function useSceneDrive(
  sectionRef: RefObject<HTMLElement | null>,
  sceneRef: RefObject<HTMLElement | null>,
  duration = 3.2,
): { drive: MotionValue<number>; pinned: boolean } {
  const isMd = useIsMd();
  const reduce = useReduceMotion();
  const scroll = useSectionProgress(sectionRef);
  const timed = useMotionValue(0);
  const inView = useInView(sceneRef, { once: true, margin: "0px 0px -20% 0px" });
  const pinned = isMd && !reduce;

  useEffect(() => {
    if (pinned) return;
    if (reduce) {
      timed.set(1);
      return;
    }
    if (!inView) return;
    const c = animate(timed, 1, { duration, ease: "linear" });
    return () => c.stop();
  }, [pinned, reduce, inView, timed, duration]);

  return { drive: pinned ? scroll : timed, pinned };
}
