"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Navbar } from "@/components/shared/navbar";
import type { Practice } from "@/lib/practices";
import { PracticeGlyph } from "./PracticeGlyph";

/**
 * Wrapper for every practice page: navbar, a red scroll-progress hairline,
 * a film-grain overlay and a HUD in the corner that names the chapter on
 * screen. Any section with a data-chapter attribute is picked up by the HUD.
 */
export function PracticeShell({
  practice,
  children,
}: {
  practice: Practice;
  children: ReactNode;
}) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const [chapter, setChapter] = useState<string>("Intro");

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setChapter(e.target.getAttribute("data-chapter") ?? "");
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
      <div
        className="kit-noise pointer-events-none fixed inset-0 z-[999999999999]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-5 left-5 z-[99999999999] hidden items-center gap-3 border border-white/15 bg-black/80 py-1.5 pr-3 pl-2 backdrop-blur-sm md:flex"
        aria-hidden
      >
        <PracticeGlyph kind={practice.glyph} className="size-5 text-white" active />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white">
          {practice.index} / {practice.short}
          <span className="mx-2 text-white/40">—</span>
          {chapter}
        </span>
      </div>
      <main>{children}</main>
    </div>
  );
}
