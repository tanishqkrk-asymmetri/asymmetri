"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Navbar } from "@/components/shared/navbar";

/**
 * Wrapper for the home page, matching the practice pages: navbar, a red
 * scroll-progress hairline, film grain and a corner HUD naming the chapter
 * on screen. Sections opt in with data-chapter="Name" (HUD) and
 * data-nav="dark" | "light" | "red" (navbar colour).
 */
export function HomeShell({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const [chapter, setChapter] = useState("Intro");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setChapter(e.target.getAttribute("data-chapter") ?? "");
          setIndex(els.indexOf(e.target as HTMLElement));
        }
      },
      // A thin line across the middle of the viewport decides the chapter.
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative bg-black font-chakra-petch text-white">
      <Navbar />
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-14 left-0 z-[9999999999999] h-px w-full origin-left bg-asymmetri-red"
        aria-hidden
      />
      <div className="kit-noise pointer-events-none fixed inset-0 z-[999999999999]" aria-hidden />
      <div
        className="transition-opacity duration-500 [html[data-hero=closed]_&]:pointer-events-none [html[data-hero=closed]_&]:opacity-0 pointer-events-none fixed bottom-5 left-5 z-[99999999999] hidden items-center gap-3 border border-white/15 bg-black/80 py-1.5 pr-3 pl-2 backdrop-blur-sm md:flex"
        aria-hidden
      >
        <span className="relative flex size-5 items-center justify-center">
          <span className="h-3.5 w-[5px] -skew-x-[26deg] bg-asymmetri-red" />
          <span className="ml-[2px] h-3.5 w-[2px] -skew-x-[26deg] bg-asymmetri-red" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white">
          {String(index).padStart(2, "0")} / Asymmetri
          <span className="mx-2 text-white/40">—</span>
          {chapter}
        </span>
      </div>
      {children}
    </div>
  );
}
