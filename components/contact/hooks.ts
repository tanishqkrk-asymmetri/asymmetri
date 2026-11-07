"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValue, useMotionValueEvent, useScroll } from "motion/react";

/** Live wall-clock time in a time zone, "--:--:--" until mounted (no hydration mismatch). */
export function useZoneClock(timeZone: string, seconds = true) {
  const [t, setT] = useState(seconds ? "--:--:--" : "--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      ...(seconds ? { second: "2-digit" } : {}),
      hour12: false,
    });
    const f = () => setT(fmt.format(new Date()));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, [timeZone, seconds]);
  return t;
}

/** Copy text to the clipboard; `copied` stays true for a moment afterwards. */
export function useCopy(text: string, ms = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older browsers / insecure origins: fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else to try */
      }
      ta.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), ms);
  }, [text, ms]);
  return { copied, copy };
}

/**
 * Progress (0 to 1) of an element against two lines on the screen:
 * 0 when its top reaches `start` (fraction of viewport height from the top),
 * 1 when its bottom reaches `end`. Drives scroll-drawn lines.
 */
export function useAnchorProgress(
  ref: RefObject<HTMLElement | null>,
  start = 0.75,
  end = 0.5,
) {
  const progress = useMotionValue(0);
  const { scrollY } = useScroll();
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const raw = (start * vh - r.top) / (r.height + (start - end) * vh);
    progress.set(Math.min(Math.max(Number.isFinite(raw) ? raw : 0, 0), 1));
  }, [ref, start, end, progress]);
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);
  return progress;
}
