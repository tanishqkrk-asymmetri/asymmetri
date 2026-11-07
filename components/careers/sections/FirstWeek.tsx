"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { SectionHead } from "@/components/practice/SectionHead";
import { MaskLines } from "@/components/practice/MaskLines";
import { firstWeek } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;
// One short log line per checklist item, printed as it completes.
const LOGS = [
  "hello posted to the crew",
  "intro calls on the calendar",
  "task board synced · every project visible",
  "buddy call booked",
  "tools installed · dev + design",
];
// Scroll window (panel's pass progress) over which the items tick.
const START = 0.22;
const END = 0.62;
const BAR_CELLS = 20;

/**
 * Day one as a script that runs itself: each checklist item ticks as the
 * panel scrolls through the viewport, with a log line and a progress bar.
 * The checklist is a real <ol>, so the content reads fine without motion.
 */
function DayOneTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref, "pass");
  const reduce = useReduceMotion();
  const n = firstWeek.checklist.length;
  const [done, setDone] = useState(0);

  useMotionValueEvent(p, "change", (v) => {
    const t = Math.min(Math.max((v - START) / (END - START), 0), 1);
    const next = Math.floor(t * n + 0.0001);
    if (next !== done) setDone(next);
  });
  const shown = reduce ? n : done;
  const pct = Math.round((shown / n) * 100);
  const cells = Math.round((shown / n) * BAR_CELLS);
  const glow = useTransform(p, [START, END], [0, 1]);

  return (
    <div ref={ref} className="relative bg-black text-white shadow-[12px_12px_0_0_#cd1717]">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2 bg-asymmetri-red" />
          <span className="size-2 bg-white/25" />
          <span className="size-2 bg-white/25" />
        </span>
        <span className="min-w-0 truncate">~/asymmetri/onboarding · day-one.sh</span>
        <span aria-hidden className="tabular-nums">{String(pct).padStart(3, "0")}%</span>
      </div>

      <div className="space-y-5 p-5 font-mono text-[12px] leading-relaxed md:p-7 md:text-[13px]">
        <p className="text-white/45" aria-hidden>
          <span className="text-asymmetri-red">$</span> ./day-one.sh --new-crew
        </p>

        <ol className="space-y-3">
          {firstWeek.checklist.map((item, i) => {
            const ok = i < shown;
            const current = i === shown;
            return (
              <li key={item}>
                <div className="flex gap-3">
                  <span
                    aria-hidden
                    className={`shrink-0 transition-colors duration-300 ${ok ? "text-asymmetri-red" : "text-white/30"}`}
                  >
                    [{ok ? "✓" : current ? <span className="kit-blink">_</span> : " "}]
                  </span>
                  <span
                    className={`transition-colors duration-300 ${ok ? "text-white" : current ? "text-white/80" : "text-white/40"}`}
                  >
                    {item}
                  </span>
                </div>
                <motion.p
                  aria-hidden
                  initial={false}
                  animate={{ opacity: ok ? 1 : 0, height: ok ? "auto" : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden pl-8 text-[11px] text-white/35"
                >
                  → {LOGS[i] ?? "done"}
                </motion.p>
              </li>
            );
          })}
        </ol>

        {/* Progress bar */}
        <div aria-hidden className="flex items-center gap-3 border-t border-white/10 pt-4 text-white/50">
          <span className="flex flex-1 gap-[3px]">
            {Array.from({ length: BAR_CELLS }, (_, i) => (
              <span
                key={i}
                className={`h-3 flex-1 -skew-x-[26deg] transition-colors duration-200 ${i < cells ? "bg-asymmetri-red" : "bg-white/10"}`}
                style={{ transitionDelay: `${i * 12}ms` }}
              />
            ))}
          </span>
          <span className="tabular-nums">
            {shown}/{n}
          </span>
        </div>

        <motion.p
          aria-hidden
          initial={false}
          animate={{ opacity: shown === n ? 1 : 0, y: shown === n ? 0 : 8 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-white"
        >
          <span className="text-asymmetri-red">✓</span> Day one complete. Welcome to the crew.
        </motion.p>
      </div>

      {/* Scanline sweep while the script runs */}
      <motion.span
        aria-hidden
        style={{ opacity: useTransform(glow, [0, 0.05, 0.95, 1], [0, 0.6, 0.6, 0]), top: useTransform(glow, (v) => `${v * 100}%`) }}
        className="pointer-events-none absolute inset-x-0 h-px bg-asymmetri-red/70"
      />
    </div>
  );
}

/** Onboarding: day one runs itself, then the one rule that matters. */
export function FirstWeek() {
  const reduce = useReduceMotion();
  return (
    <section
      data-chapter="Onboarding"
      data-nav="light"
      aria-labelledby="careers-first-week"
      className="relative overflow-hidden bg-white px-6 py-28 text-black md:px-16 md:py-36"
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-20">
        <div id="careers-first-week">
          <SectionHead
            tone="light"
            align="left"
            kicker={firstWeek.kicker}
            title={firstWeek.titleLines}
            body={firstWeek.intro}
          />
        </div>
        <DayOneTerminal />
      </div>

      <div className="mt-24 grid gap-12 border-t border-black/15 pt-12 md:mt-32 xl:grid-cols-[1.5fr_1fr] xl:items-end">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-4xl font-chakra-petch text-3xl leading-[1.02] font-semibold uppercase md:text-4xl xl:text-5xl"
        >
          {firstWeek.finalNote}
        </motion.p>
        <p className="font-chakra-petch text-5xl leading-[0.9] font-bold uppercase md:text-7xl xl:text-right">
          <MaskLines
            stagger={0.14}
            lines={firstWeek.signOff.map((w, i) =>
              i === firstWeek.signOff.length - 1 ? (
                <span key={w} className="text-asymmetri-red">
                  {w}
                </span>
              ) : (
                w
              ),
            )}
          />
        </p>
      </div>
    </section>
  );
}
