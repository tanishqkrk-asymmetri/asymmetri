"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHead } from "@/components/practice/SectionHead";
import { notebook, type NotebookEntry } from "./content";

const SKETCH: Record<NotebookEntry["sketch"], string[]> = {
  network: [
    "M14 16 L60 10 M14 16 L60 40 M14 40 L60 10 M14 40 L60 40 M14 40 L60 70 M14 64 L60 40 M14 64 L60 70",
    "M60 10 L106 28 M60 40 L106 28 M60 40 L106 56 M60 70 L106 56",
    "M10 12 h8 v8 h-8 z M10 36 h8 v8 h-8 z M10 60 h8 v8 h-8 z M56 6 h8 v8 h-8 z M56 36 h8 v8 h-8 z M56 66 h8 v8 h-8 z M102 24 h8 v8 h-8 z M102 52 h8 v8 h-8 z",
  ],
  cube: [
    "M6 70 L114 70 M20 58 L100 58 M34 48 L86 48 M60 70 L60 42 M24 70 L40 48 M96 70 L80 48",
    "M44 22 L64 14 L84 22 L84 42 L64 50 L44 42 Z M44 22 L64 30 L84 22 M64 30 L64 50",
    "M88 10 h22 v12 h-22 z M88 22 L76 30",
  ],
  screen: [
    "M10 8 H110 V64 H10 Z M10 18 H110",
    "M18 26 H58 V40 H18 Z M66 26 H102 M66 32 H96 M66 38 H90 M18 48 H102 M18 54 H80",
    "M84 52 L84 74 L90 68 L96 78 L100 76 L94 66 L102 66 Z",
  ],
  bars: [
    "M10 72 H112 M10 72 V6",
    "M20 72 V44 H32 V72 M42 72 V30 H54 V72 M64 72 V52 H76 V72 M86 72 V18 H98 V72",
    "M10 38 H112",
  ],
  branch: [
    "M60 76 L60 44 M60 56 L36 36 M60 48 L84 26 M36 36 L26 20 M36 36 L44 18 M84 26 L98 16",
    "M56 76 H64",
    "M22 16 h8 v8 h-8 z M40 14 h8 v8 h-8 z M94 12 h8 v8 h-8 z",
  ],
  transfer: [
    "M8 22 H44 V58 H8 Z",
    "M48 40 H76 M68 32 L76 40 L68 48",
    "M80 14 H114 V66 H80 Z M86 24 H108 M86 32 H108 M86 40 H100",
  ],
};

function Sketch({ kind, on, reduce }: { kind: NotebookEntry["sketch"]; on: boolean; reduce: boolean }) {
  return (
    <svg viewBox="0 0 120 80" className="h-24 w-full" fill="none" strokeLinecap="square" aria-hidden>
      {SKETCH[kind].map((d, i) => (
        <motion.path
          key={`${i}-${on}`}
          d={d}
          stroke={on && i === 1 ? "#cd1717" : "currentColor"}
          strokeWidth={i === 1 ? 1.6 : 1.1}
          strokeDasharray={i === 2 && kind === "bars" ? "3 4" : undefined}
          initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: on ? 0.8 : 1.4, delay: i * 0.18, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
    </svg>
  );
}

function Page({ e, i, reduce }: { e: NotebookEntry; i: number; reduce: boolean }) {
  const [on, setOn] = useState(false);
  const tilt = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.2][i % 6];
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 80, rotate: tilt * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduce ? undefined : { rotate: 0, y: -8 }}
      onHoverStart={() => setOn(true)}
      onHoverEnd={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      tabIndex={0}
      className="relative flex flex-col border border-black/15 bg-white pt-5 pr-6 pb-6 pl-14 text-black shadow-[0_24px_50px_-30px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-asymmetri-red"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent 0 27px, rgba(0,0,0,0.07) 27px 28px)",
        backgroundPosition: "0 18px",
      }}
    >
      {/* Margin rule and binder holes */}
      <span className="absolute inset-y-0 left-10 w-px bg-asymmetri-red/60" aria-hidden />
      <span className="absolute top-8 left-3.5 flex flex-col gap-16" aria-hidden>
        {[0, 1, 2].map((h) => (
          <span key={h} className="block size-3 border border-black/20 bg-[#f2f2f2]" />
        ))}
      </span>

      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
        <span>
          Entry <span className="text-asymmetri-red">{String(i + 1).padStart(2, "0")}</span>
        </span>
        <span className={on ? "text-asymmetri-red" : undefined}>{on ? "● Reviewing" : "Signed off"}</span>
      </div>

      <div className={`mt-4 transition-colors duration-300 ${on ? "text-black" : "text-black/55"}`}>
        <Sketch kind={e.sketch} on={on} reduce={reduce} />
      </div>

      <h3 className="mt-4 font-chakra-petch text-2xl leading-none font-bold uppercase md:text-[1.7rem]">
        {e.capability}
      </h3>
      <p className="mt-3 font-geist text-[15px] leading-[28px] text-black/70">{e.what}</p>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-black/45">Deliverables</p>
      <ul className="mt-1 space-y-0">
        {e.deliverables.map((d, k) => (
          <li key={d} className="flex items-center gap-3 font-geist text-sm leading-[28px]">
            <span
              className={`flex size-3.5 shrink-0 items-center justify-center border text-[9px] leading-none transition-colors ${
                on ? "border-asymmetri-red bg-asymmetri-red text-white" : "border-black/40 text-transparent"
              }`}
              style={{ transitionDelay: on ? `${k * 120}ms` : "0ms" }}
              aria-hidden
            >
              ✓
            </span>
            {d}
          </li>
        ))}
      </ul>
    </motion.li>
  );
}

/** Capabilities as pages torn from the lab notebook, pinned to graph paper. */
export function LabNotebook() {
  const reduce = !!useReducedMotion();
  return (
    <section
      data-chapter="Capabilities"
      aria-labelledby="rnd-caps"
      className="relative overflow-hidden bg-[#f4f4f4] px-6 py-28 text-black md:px-16 md:py-36"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <span
        className="kit-outline-dark pointer-events-none absolute -top-[4vw] -right-[2vw] font-chakra-petch text-[28vw] leading-none font-bold uppercase select-none"
        aria-hidden
      >
        Lab
      </span>
      <div id="rnd-caps" className="relative">
        <SectionHead
          tone="light"
          kicker="Capabilities · From the lab notebook"
          title={["Six disciplines.", ["One lab."]]}
          body="What we actually do in Innovation and R&D, and what you get at the end of each piece of work. Hover or focus a page to review it."
        />
      </div>
      <ul className="relative mt-16 grid gap-8 md:grid-cols-2 md:gap-10 xl:grid-cols-3">
        {notebook.map((e, i) => (
          <Page key={e.capability} e={e} i={i} reduce={reduce} />
        ))}
      </ul>
    </section>
  );
}
