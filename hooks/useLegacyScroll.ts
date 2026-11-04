import { RefObject, useCallback, useEffect } from "react";
import { useMotionValue, useMotionValueEvent, useScroll } from "motion/react";

export type InsertedSection = {
  ref: RefObject<HTMLElement | null>;
  /** Value fed to the Navbar while this section is under it (picks its colour). */
  nav: number;
};

/**
 * The home page's original animations are keyed to fractions of the page's
 * total scroll. Newer sections are spliced in between them, which would shift
 * every one of those fractions.
 *
 * This hook returns `legacy`: the progress the page would report if the
 * inserted sections did not exist. It advances normally, pauses while an
 * inserted section scrolls past, then resumes, so every original animation
 * keeps its exact timing. Inserted sections drive their own animations with
 * their own useScroll.
 */
export function useLegacyScroll(
  pageRef: RefObject<HTMLElement | null>,
  inserts: InsertedSection[],
) {
  const legacy = useMotionValue(0);
  const nav = useMotionValue(0);
  const { scrollY } = useScroll();

  const update = useCallback(() => {
    const page = pageRef.current;
    if (!page) return;
    const pageRect = page.getBoundingClientRect();
    const scrolled = -pageRect.top;
    const navLine = 56; // navbar height

    let skipped = 0;
    let skippedTotal = 0;
    let navOverride: number | null = null;

    for (const ins of inserts) {
      const el = ins.ref.current;
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const top = r.top - pageRect.top;
      skippedTotal += r.height;
      skipped += Math.min(Math.max(scrolled - top, 0), r.height);
      if (r.top <= navLine && r.bottom > navLine) navOverride = ins.nav;
    }

    const total = pageRect.height - window.innerHeight - skippedTotal;
    const value =
      total > 0 ? Math.min(Math.max((scrolled - skipped) / total, 0), 1) : 0;

    legacy.set(value);
    nav.set(navOverride ?? value);
    // inserts is a stable list of refs created by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return { legacy, nav };
}
