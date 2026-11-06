"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { useMotionValue, useMotionValueEvent, useScroll } from "motion/react";

/**
 * 0 when the section's top touches the bottom of the viewport, 1 when it
 * reaches the top. Drives the hard wipes that cut one section into the next
 * while it is still entering (before its sticky stage pins).
 */
export function useEnterProgress(ref: RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0);
  const { scrollY } = useScroll();
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const vh = window.innerHeight;
    const raw = (vh - el.getBoundingClientRect().top) / vh;
    progress.set(Math.min(Math.max(raw, 0), 1));
  }, [ref, progress]);
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);
  return progress;
}

/** True while the element is on screen and the tab is visible: gate loops on it. */
export function useRunning(ref: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref]);
  return inView && visible;
}

export const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
