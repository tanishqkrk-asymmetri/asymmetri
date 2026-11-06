import { RefObject, useEffect } from "react";

/**
 * Freezes CSS and SMIL loops inside `ref` while it is off screen or the tab
 * is hidden. Pair with the `paused` class from work.module.css on the host.
 */
export function usePauseOffscreen(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    const apply = () => {
      const run = visible && document.visibilityState === "visible";
      if (run) delete el.dataset.paused;
      else el.dataset.paused = "";
      el.querySelectorAll("svg").forEach((s) => {
        if (run) s.unpauseAnimations();
        else s.pauseAnimations();
      });
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        apply();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", apply);
    apply();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, [ref]);
}
