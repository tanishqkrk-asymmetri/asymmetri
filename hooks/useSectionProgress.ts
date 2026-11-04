import { RefObject, useCallback, useEffect } from "react";
import { useMotionValue, useMotionValueEvent, useScroll } from "motion/react";

/**
 * Scroll progress (0 to 1) of one section, measured directly.
 *
 * - "pin":  0 when the section's top reaches the top of the viewport,
 *           1 when its bottom reaches the bottom (for sticky scenes).
 * - "pass": 0 when its top enters from below, 1 when its bottom leaves the top.
 *
 * We avoid useScroll({ target }) here on purpose: Motion hands those values to
 * the browser's native scroll timelines, which mis-time opacity and clip-path
 * inside sticky scenes. A plain motion value keeps every frame in sync.
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  mode: "pin" | "pass" = "pin",
) {
  const progress = useMotionValue(0);
  const { scrollY } = useScroll();

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const raw =
      mode === "pin" ? -r.top / (r.height - vh) : (vh - r.top) / (r.height + vh);
    progress.set(Math.min(Math.max(Number.isFinite(raw) ? raw : 0, 0), 1));
  }, [ref, mode, progress]);

  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return progress;
}
