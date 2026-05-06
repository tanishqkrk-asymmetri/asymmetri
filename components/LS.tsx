"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type LocomotiveInstance = {
  resize: () => void;
  destroy: () => void;
};

export default function LS() {
  const pathname = usePathname();
  const instanceRef = useRef<LocomotiveInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async function () {
      try {
        const L = (await import("locomotive-scroll")).default;
        if (cancelled) return;
        if (!instanceRef.current) {
          instanceRef.current = new L();
          requestAnimationFrame(() => {
            instanceRef.current?.resize();
          });
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      instanceRef.current?.resize();
    });
  }, [pathname]);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        requestAnimationFrame(() => instanceRef.current?.resize());
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
