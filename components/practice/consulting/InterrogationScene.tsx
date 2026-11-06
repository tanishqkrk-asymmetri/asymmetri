"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { assumptions, brief, questions, reframe, reframeSpec } from "./content";

const pad = (n: number) => String(n).padStart(2, "0");
const Q_AT = (i: number) => 0.08 + i * 0.065;
const A_AT = (i: number) => 0.42 + i * 0.04;
const STRIKE_BRIEF = 0.6;
const SHARPEN = 0.66;
const FLOOD = 0.86;

function Question({ p, i, q }: { p: MotionValue<number>; i: number; q: string }) {
  const at = Q_AT(i);
  const opacity = useTransform(p, [at, at + 0.04, SHARPEN - 0.04, SHARPEN], [0, 1, 1, 0.35]);
  const x = useTransform(p, [at, at + 0.05], [48, 0]);
  const filter = useTransform(p, [at, at + 0.04], ["blur(6px)", "blur(0px)"]);
  return (
    <motion.li
      style={{ opacity, x, filter }}
      className="grid grid-cols-[2.75rem_1fr] items-baseline gap-2 border-t border-white/15 py-2 md:py-3.5"
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-asymmetri-red">Q.{pad(i + 1)}</span>
      <span className="font-chakra-petch text-[15px] leading-snug font-semibold text-white md:text-2xl">
        {q}
      </span>
    </motion.li>
  );
}

function Assumption({ p, i, text }: { p: MotionValue<number>; i: number; text: string }) {
  const at = A_AT(i);
  const opacity = useTransform(p, [at, at + 0.025], [0, 1]);
  const y = useTransform(p, [at, at + 0.025], [14, 0]);
  const strike = useTransform(p, [at + 0.025, at + 0.05], ["0% 1.5px", "100% 1.5px"]);
  const color = useTransform(p, [at + 0.04, at + 0.06], ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.35)"]);
  return (
    <motion.li style={{ opacity, y }} className="flex items-baseline gap-2">
      <span className="font-mono text-[10px] text-asymmetri-red" aria-hidden>
        ✕
      </span>
      <motion.span
        style={{
          color,
          backgroundImage: "linear-gradient(#cd1717,#cd1717)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left 55%",
          backgroundSize: strike,
          WebkitBoxDecorationBreak: "clone",
          boxDecorationBreak: "clone",
        }}
        className="font-mono text-[10px] uppercase tracking-[0.14em] md:text-xs"
      >
        {text}
      </motion.span>
    </motion.li>
  );
}

function Spec({ p, i, k, v }: { p: MotionValue<number>; i: number; k: string; v: string }) {
  const at = 0.75 + i * 0.022;
  const opacity = useTransform(p, [at, at + 0.02], [0, 1]);
  const clipPath = useTransform(p, [at, at + 0.03], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  return (
    <motion.li style={{ opacity, clipPath }} className="border border-white/20 bg-black/40 px-2 py-1.5">
      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-asymmetri-red">{k}</span>
      <span className="block font-geist text-[11px] text-white md:text-sm">{v}</span>
    </motion.li>
  );
}

/**
 * A vague brief ("We need AI.") is interrogated in a pinned sequence:
 * questions arrive, assumptions are struck out, and the brief sharpens into a
 * precise problem statement with a measurable outcome. Then red floods in.
 */
export function InterrogationScene() {
  const ref = useRef<HTMLElement>(null);
  const live = useSectionProgress(ref);
  const fixed = useMotionValue(0.84);
  const reduce = useReducedMotion();
  const p = reduce ? fixed : live;
  const [phase, setPhase] = useState<"open" | "sharp">("open");

  useMotionValueEvent(live, "change", (v) => {
    const next = v > SHARPEN - 0.03 ? "sharp" : "open";
    setPhase((cur) => (cur === next ? cur : next));
  });

  const briefStrike = useTransform(p, [STRIKE_BRIEF, STRIKE_BRIEF + 0.04], ["0% 0.07em", "100% 0.07em"]);
  const briefOpacity = useTransform(p, [STRIKE_BRIEF + 0.02, STRIKE_BRIEF + 0.08], [1, 0.22]);
  const statementOpacity = useTransform(p, [SHARPEN, SHARPEN + 0.05], [0, 1]);
  const statementBlur = useTransform(p, [SHARPEN, SHARPEN + 0.11], ["blur(18px)", "blur(0px)"]);
  const statementTrack = useTransform(p, [SHARPEN, SHARPEN + 0.11], ["0.32em", "0em"]);
  const flood = useTransform(p, [FLOOD, FLOOD + 0.1], ["circle(0% at 30% 78%)", "circle(150% at 30% 78%)"]);
  const floodText = useTransform(p, [FLOOD + 0.07, FLOOD + 0.11], [0, 1]);
  const floodY = useTransform(p, [FLOOD + 0.07, FLOOD + 0.12], [40, 0]);
  const counter = useTransform(p, (v) => {
    const q = questions.filter((_, i) => v >= Q_AT(i)).length;
    const a = assumptions.filter((_, i) => v >= A_AT(i) + 0.04).length;
    const ver = v >= SHARPEN ? 3 : v >= A_AT(0) ? 2 : v >= Q_AT(0) ? 1 : 0;
    return `v${ver} · Q ${pad(q)}/${pad(questions.length)} · ✕ ${pad(a)}/${pad(assumptions.length)}`;
  });

  const isSharp = !reduce && phase === "sharp";

  return (
    <section
      ref={ref}
      data-chapter="Framing"
      aria-labelledby="interrogate-title"
      className={`relative bg-[#0a0a0a] text-white ${reduce ? "" : "h-[520vh]"}`}
    >
      <div
        className={`heroDark relative flex flex-col overflow-hidden bg-[#0a0a0a] px-6 pt-20 pb-6 md:px-16 md:pb-10 ${reduce ? "min-h-screen" : "sticky top-0 h-[100svh]"}`}
      >
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
              02 · Framing
            </p>
            <h2 id="interrogate-title" className="mt-2 font-chakra-petch text-xl font-bold uppercase md:text-3xl">
              First, we interrogate the brief.
            </h2>
          </div>
          <motion.p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50" aria-hidden>
            {counter}
          </motion.p>
        </header>

        <div className="mt-4 grid flex-1 content-center gap-x-12 gap-y-4 md:mt-6 lg:grid-cols-[1.25fr_1fr] lg:grid-rows-[auto_auto_1fr] lg:gap-y-6">
          {/* The brief as received */}
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
              {isSharp || reduce ? "Brief v0 · superseded" : "Brief as received · v0"}
            </p>
            <motion.p
              style={{ opacity: briefOpacity }}
              className="mt-1 font-chakra-petch text-[15vw] leading-[0.92] font-bold uppercase tracking-tight md:text-[10vw] lg:text-[6.2vw] lg:whitespace-nowrap"
            >
              <motion.span
                style={{
                  backgroundImage: "linear-gradient(#cd1717,#cd1717)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left 55%",
                  backgroundSize: briefStrike,
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone",
                }}
              >
                “{brief}”
              </motion.span>
              <span className="kit-blink ml-2 inline-block h-[0.7em] w-[0.12em] translate-y-[0.05em] bg-asymmetri-red align-baseline" aria-hidden />
            </motion.p>
          </div>

          {/* Assumptions, struck */}
          <div className="lg:col-start-1 lg:row-start-2">
            <p className="sr-only">Assumptions we strike out:</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 md:flex md:flex-wrap md:gap-x-6">
              {assumptions.map((a, i) => (
                <Assumption key={a} p={p} i={i} text={a} />
              ))}
            </ul>
          </div>

          {/* Questions (share a slot with the statement on small screens) */}
          <div
            className={`col-start-1 row-start-3 self-start transition-opacity duration-500 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-center ${isSharp ? "max-lg:pointer-events-none max-lg:opacity-0" : ""}`}
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 md:mb-2">
              Questions we ask first
            </p>
            <ol className="border-b border-white/15">
              {questions.map((q, i) => (
                <Question key={q} p={p} i={i} q={q} />
              ))}
            </ol>
          </div>

          {/* The sharpened statement */}
          <motion.div
            style={{ opacity: statementOpacity }}
            className="col-start-1 row-start-3 self-start lg:self-center"
          >
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red">
              <span className="inline-block size-1.5 bg-asymmetri-red" aria-hidden />
              Brief v3 · precise · illustrative example
            </p>
            <motion.p
              style={{ filter: statementBlur, letterSpacing: statementTrack }}
              className="mt-2 max-w-3xl font-chakra-petch text-xl leading-[1.08] font-bold uppercase md:text-4xl xl:text-[2.75rem]"
            >
              {reframe}
            </motion.p>
            <ul className="mt-3 grid grid-cols-2 gap-1.5 md:mt-5 md:grid-cols-4">
              {reframeSpec.map((s, i) => (
                <Spec key={s.k} p={p} i={i} k={s.k} v={s.v} />
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Red floods in: now it is an engineering problem */}
        {!reduce && (
          <motion.div
            style={{ clipPath: flood }}
            className="absolute inset-0 z-20 flex flex-col justify-end bg-asymmetri-red px-6 pb-16 md:px-16 md:pb-24"
          >
            <motion.div style={{ opacity: floodText, y: floodY }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/75 md:text-xs">
                Brief v3 · locked
              </p>
              <p className="mt-4 max-w-5xl font-chakra-petch text-5xl leading-[0.9] font-bold uppercase md:text-8xl">
                Now it is an <span className="text-black">engineering</span> problem.
              </p>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/75 md:text-xs">
                Here is how we take it from here ↓
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
