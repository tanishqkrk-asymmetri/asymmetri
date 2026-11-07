"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { SectionHead } from "@/components/practice/SectionHead";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import { rhythm } from "../content";

const EASE = [0.16, 1, 0.3, 1] as const;
const HOURS = 24 * 7;
const UNIT = 10; // SVG units per hour
const LANES = 6;
const LANE_H = 38;
const LANE_GAP = 12;
const TOP = 36;
const STANDUP = { day: 0, hour: 10, len: 1 }; // Monday morning (illustrative position on the strip)
const VB_H = TOP + LANES * (LANE_H + LANE_GAP);

type Block = { lane: number; start: number; len: number };

// Deterministic so server and client render the same week.
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function buildWeek(): Block[] {
  const out: Block[] = [];
  for (let lane = 0; lane < LANES; lane++) {
    const shift = Math.round(rand(lane + 1) * 9) - 3; // each person keeps their own hours
    for (let day = 0; day < 7; day++) {
      const weekend = day >= 5;
      const chunks = weekend ? (rand(lane * 31 + day) > 0.72 ? 1 : 0) : 2 + (rand(lane * 17 + day) > 0.55 ? 1 : 0);
      let cursor = 7 + shift + Math.round(rand(lane * 7 + day * 3) * 3);
      for (let c = 0; c < chunks; c++) {
        const len = 1 + Math.round(rand(lane * 13 + day * 5 + c) * 3);
        const start = day * 24 + Math.min(Math.max(cursor, 0), 22);
        // Leave Monday's standup slot to the standup itself.
        const s0 = STANDUP.day * 24 + STANDUP.hour;
        if (!(start < s0 + STANDUP.len && start + len > s0)) out.push({ lane, start, len: Math.min(len, day * 24 + 24 - start) });
        cursor += len + 1 + Math.round(rand(lane * 3 + day * 11 + c) * 5);
      }
    }
  }
  return out;
}

const WEEK = buildWeek();

function Pulse({ b, head }: { b: Block; head: MotionValue<number> }) {
  const opacity = useTransform(head, (h) => (h >= b.start ? 1 : 0.14));
  return (
    <motion.rect
      x={b.start * UNIT + 1}
      y={TOP + b.lane * (LANE_H + LANE_GAP)}
      width={Math.max(b.len * UNIT - 2, 4)}
      height={LANE_H}
      fill="#000000"
      style={{ opacity }}
    />
  );
}

function WeekStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReduceMotion();
  const head = useMotionValue(reduce ? HOURS : 0);
  const headX = useTransform(head, (h) => h * UNIT);
  const standupHot = useTransform(head, (h) => {
    const s = STANDUP.day * 24 + STANDUP.hour;
    return h >= s ? 1 : 0.25;
  });

  useEffect(() => {
    if (reduce) {
      head.set(HOURS);
      return;
    }
    if (!inView) return;
    const c = animate(head, [0, HOURS], { duration: 9, ease: "linear", repeat: Infinity, repeatDelay: 1.4 });
    return () => c.stop();
  }, [inView, reduce, head]);

  const sx = (STANDUP.day * 24 + STANDUP.hour) * UNIT;

  return (
    <div ref={ref} className="relative">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-black/50">
        <span>One week · six crew · async</span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 bg-black" />
            Work
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 bg-asymmetri-red" />
            Standup
          </span>
        </span>
      </div>
      <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
        <svg
          viewBox={`0 0 ${HOURS * UNIT} ${VB_H}`}
          className="block h-auto w-[760px] max-w-none md:w-full"
          role="img"
          aria-label="A week of async work across the crew, with one fixed red standup on Monday morning."
        >
          {rhythm.days.map((d, i) => (
            <g key={d}>
              <line x1={i * 24 * UNIT} y1={0} x2={i * 24 * UNIT} y2={VB_H} stroke="#000" strokeOpacity={i ? 0.15 : 0.3} />
              <text x={i * 24 * UNIT + 8} y={22} fontSize="17" fontFamily="monospace" fill="#000" opacity={i >= 5 ? 0.35 : 0.7}>
                {d.toUpperCase()}
              </text>
            </g>
          ))}
          {Array.from({ length: LANES }, (_, l) => (
            <rect
              key={l}
              x={0}
              y={TOP + l * (LANE_H + LANE_GAP)}
              width={HOURS * UNIT}
              height={LANE_H}
              fill="#000"
              opacity={0.03}
            />
          ))}
          {WEEK.map((b, i) => (
            <Pulse key={i} b={b} head={head} />
          ))}
          <motion.rect
            x={sx}
            y={TOP - 6}
            width={STANDUP.len * UNIT * 2.2}
            height={LANES * (LANE_H + LANE_GAP) + 2}
            fill="#cd1717"
            style={{ opacity: standupHot }}
          />
          <motion.line
            x1={0}
            x2={0}
            y1={TOP - 8}
            y2={VB_H}
            stroke="#cd1717"
            strokeWidth={2}
            style={{ x: headX }}
          />
        </svg>
      </div>
      <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red">
        <span className="inline-block h-px w-8 bg-asymmetri-red" />
        Monday · {rhythm.standupLabel}
      </p>
    </div>
  );
}

/** How a week works: async pulses across the crew, one fixed red standup. */
export function WeekRhythm() {
  const reduce = useReduceMotion();
  return (
    <section
      data-chapter="Rhythm"
      data-nav="light"
      aria-labelledby="rhythm-title"
      className="relative bg-white px-6 py-28 text-black md:px-16 md:py-40"
    >
      <div id="rhythm-title">
        <SectionHead tone="light" kicker={rhythm.kicker} title={rhythm.titleLines} body={rhythm.intro} />
      </div>

      <div className="mt-16 md:mt-24">
        <WeekStrip />
      </div>

      <ul className="mt-16 grid border-t border-black/15 sm:grid-cols-2 lg:grid-cols-4 md:mt-24">
        {rhythm.items.map((it, i) => {
          const fixed = it.k === "Non-negotiable";
          return (
            <motion.li
              key={it.k}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
              className="relative border-b border-black/15 py-8 sm:px-6 sm:first:pl-0 lg:border-r lg:border-b-0 lg:last:border-r-0"
            >
              {fixed && <span aria-hidden className="absolute top-0 left-0 h-[3px] w-full bg-asymmetri-red sm:left-6 sm:w-[calc(100%-3rem)]" />}
              <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${fixed ? "text-asymmetri-red" : "text-black/45"}`}>
                {String(i + 1).padStart(2, "0")} · {it.k}
              </p>
              <h3 className="mt-4 font-chakra-petch text-2xl leading-tight font-bold uppercase md:text-3xl">{it.title}</h3>
              <p className="mt-3 max-w-xs font-geist text-base leading-relaxed text-black/65">{it.body}</p>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
