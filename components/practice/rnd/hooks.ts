"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while the element is on screen and the tab is visible. */
export function useActive(ref: RefObject<Element | null>, rootMargin = "100px") {
  const [onScreen, setOnScreen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  useEffect(() => {
    const f = () => setVisible(document.visibilityState === "visible");
    f();
    document.addEventListener("visibilitychange", f);
    return () => document.removeEventListener("visibilitychange", f);
  }, []);

  return onScreen && visible;
}

/** Matches Tailwind's lg breakpoint. False on the server and first paint. */
export function useIsDesktop() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const f = () => setIs(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return is;
}

export const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
