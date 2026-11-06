"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Practice } from "@/lib/practices";
import { MaskLines } from "./MaskLines";
import { ScrambleText } from "./ScrambleText";

type Props = {
  practice: Practice;
  /** The H1, split into display lines. Wrap a line in an array to colour it red: [["Systems"]]. */
  titleLines: (string | [string])[];
  /** Full-bleed signature graphic rendered behind the type (canvas, SVG…). */
  visual?: ReactNode;
  /** Optional element pinned to the right column (e.g. a live log). */
  aside?: ReactNode;
};

function useClock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const f = () => setT(new Date().toISOString().slice(11, 19));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/**
 * Shared hero for practice pages: HUD line, giant decoding headline, a huge
 * outline index number and a slot for the page's own signature visual.
 */
export function PracticeHero({ practice, titleLines, visual, aside }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const indexY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const clock = useClock();

  return (
    <section
      ref={ref}
      data-chapter="Intro"
      className="heroDark relative flex min-h-[100svh] flex-col overflow-hidden bg-black text-white"
    >
      {visual && <div className="absolute inset-0">{visual}</div>}

      {/* Readability scrim behind the type */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0)_100%)]"
        aria-hidden
      />

      <motion.span
        style={{ y: indexY }}
        className="kit-outline pointer-events-none absolute -right-[2vw] -bottom-[6vw] font-chakra-petch text-[42vw] leading-none font-bold select-none md:text-[30vw]"
        aria-hidden
      >
        {practice.index}
      </motion.span>

      <div className="relative z-10 flex items-center justify-between gap-4 px-6 pt-20 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 md:px-16 md:text-[11px]">
        <span>
          <a href="/#what-we-do" className="hover:text-white">
            What we do
          </a>
          <span className="mx-2 text-asymmetri-red">/</span>
          <ScrambleText text={`${practice.index} · ${practice.short}`} trigger="mount" />
        </span>
        <span className="hidden sm:inline">
          <span className="kit-blink mr-2 inline-block size-1.5 bg-asymmetri-red align-middle" />
          Live · UTC {clock}
        </span>
      </div>

      <motion.div
        style={{ y, opacity: fade }}
        className="pointer-events-none relative z-10 mt-auto grid gap-10 px-6 pb-14 md:px-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end"
      >
        <div className="min-w-0">
          <h1 className="font-chakra-petch text-[13vw] leading-[0.88] font-bold uppercase tracking-tight sm:text-[10vw] lg:text-[7.4vw]">
            <MaskLines
              immediate
              delay={0.15}
              lines={titleLines.map((l, i) =>
                Array.isArray(l) ? (
                  <span key={i} className="text-asymmetri-red">{l[0]}</span>
                ) : (
                  l
                ),
              )}
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-6 max-w-2xl font-chakra-petch text-xl font-medium text-white md:text-3xl"
          >
            {practice.tagline}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="pointer-events-auto min-w-0 space-y-5 border border-white/10 bg-black/55 p-5 backdrop-blur-md md:p-6 lg:max-w-lg lg:justify-self-end [@media(max-height:820px)]:space-y-4"
        >
          {aside}
          <p className="max-w-md font-geist text-sm leading-relaxed text-white/75 md:text-base [@media(max-height:820px)]:text-sm">
            {practice.summary}
          </p>
          {/* Chips drop out on short screens so the column clears the visual. */}
          <ul className="flex max-w-md flex-wrap gap-1.5 [@media(max-height:820px)]:hidden">
            {practice.capabilities.map((c) => (
              <li
                key={c}
                className="border border-white/20 bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/80 backdrop-blur-sm"
              >
                {c}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <a
              href="/contact-us"
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-asymmetri-red px-5 py-3 font-chakra-petch text-sm font-semibold uppercase tracking-wide"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors duration-300 group-hover:text-black">
                Bring us the problem
              </span>
              <span className="relative transition-colors duration-300 group-hover:text-asymmetri-red">↗</span>
            </a>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Scroll ↓
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
