"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { antiPitch } from "../content";
import { useSceneDrive } from "./useCareersDrive";

const N = antiPitch.symmetric.length;
// Ledger rows resolve one by one across this span of the scene.
const ROWS: [number, number] = [0.3, 0.74];
const rowAt = (i: number) => {
  const w = (ROWS[1] - ROWS[0]) / N;
  const a = ROWS[0] + i * w;
  return [a, a + w * 0.9] as const;
};

function Struck({ d, text }: { d: MotionValue<number>; text: string }) {
  const bar = useTransform(d, [0.06, 0.16], [0, 1]);
  const dim = useTransform(d, [0.06, 0.16], [1, 0.35]);
  return (
    <span className="relative inline-block">
      <motion.span style={{ opacity: dim }}>{text}</motion.span>
      <motion.span
        aria-hidden
        style={{ scaleX: bar }}
        className="absolute top-[48%] -right-[0.06em] -left-[0.06em] h-[0.14em] origin-left -rotate-3 bg-asymmetri-red"
      />
    </span>
  );
}

function SymRow({ d, i, text }: { d: MotionValue<number>; i: number; text: string }) {
  const [a, b] = rowAt(i);
  const line = useTransform(d, [a, b], [0, 1]);
  const op = useTransform(d, [a, b], [0.9, 0.28]);
  return (
    <li className="relative flex items-center gap-4 border-t border-white/10 py-2.5 md:py-3 [@media(max-height:760px)]:py-2">
      <span className="font-mono text-[10px] text-white/30">{String(i + 1).padStart(2, "0")}</span>
      <span className="relative min-w-0">
        <motion.span style={{ opacity: op }} className="font-chakra-petch text-base md:text-xl">
          {text}
        </motion.span>
        <motion.span
          aria-hidden
          style={{ scaleX: line }}
          className="absolute top-1/2 -right-1 -left-1 h-px origin-left bg-white"
        />
      </span>
    </li>
  );
}

function AsymRow({ d, i, text }: { d: MotionValue<number>; i: number; text: string }) {
  const [a, b] = rowAt(i);
  const on = useTransform(d, [a + 0.02, b], [0, 1]);
  const color = useTransform(d, [a + 0.02, b], ["rgba(255,255,255,0.3)", "rgba(255,255,255,1)"]);
  const x = useTransform(d, [a + 0.02, b], [-8, 0]);
  return (
    <li className="flex items-center gap-4 border-t border-white/10 py-2.5 md:py-3 [@media(max-height:760px)]:py-2">
      <span className="relative flex size-4 shrink-0 items-center justify-center border border-white/30">
        <motion.span style={{ scale: on, opacity: on }} className="absolute inset-0 bg-asymmetri-red" />
        <motion.svg style={{ opacity: on }} viewBox="0 0 12 12" className="relative size-3" aria-hidden>
          <path d="M2 6.5 5 9l5-6" fill="none" stroke="#fff" strokeWidth="1.8" />
        </motion.svg>
      </span>
      <motion.span style={{ color, x }} className="font-chakra-petch text-base font-semibold md:text-xl">
        {text}
      </motion.span>
    </li>
  );
}

/**
 * The anti-pitch. "You don't want to work for Asymmetri." On scroll the
 * "don't" is struck out, then a ledger sorts the symmetric from the
 * asymmetric. Pinned on md+, plays once in view on phones.
 */
export function AntiPitch() {
  const ref = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const { drive: d } = useSceneDrive(ref, scene, 4);

  const bodyOp = useTransform(d, [0.14, 0.24], [0.25, 1]);
  const ledgerOp = useTransform(d, [0.2, 0.3], [0.15, 1]);
  const resolveOp = useTransform(d, [0.78, 0.88], [0, 1]);
  const resolveY = useTransform(d, [0.78, 0.88], [16, 0]);
  const meter = useTransform(d, [ROWS[0], ROWS[1]], [0, 1]);
  const count = useTransform(d, (v) => {
    const n = Math.round(Math.min(Math.max((v - ROWS[0]) / (ROWS[1] - ROWS[0]), 0), 1) * N);
    return `${String(n).padStart(2, "0")}/${String(N).padStart(2, "0")}`;
  });

  return (
    <section
      ref={ref}
      data-chapter="Warning"
      data-nav="dark"
      aria-labelledby="anti-pitch-title"
      className="relative bg-black text-white md:h-[260vh]"
    >
      <div
        ref={scene}
        className="flex flex-col justify-center gap-8 px-6 py-24 md:sticky md:top-0 md:h-screen md:gap-[4vh] md:px-16 md:py-0 md:pt-14 md:pb-16"
      >
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] md:text-xs">
          <span className="text-asymmetri-red">
            <span className="kit-blink mr-2 inline-block size-1.5 bg-asymmetri-red align-middle" />
            <ScrambleText text={antiPitch.kicker} />
          </span>
          <span className="hidden text-white/40 sm:inline">Self-assessment · sorting</span>
        </div>

        <h2
          id="anti-pitch-title"
          className="max-w-[18ch] font-chakra-petch text-[clamp(2.4rem,min(7vw,11vh),7.5rem)] leading-[0.9] font-bold uppercase"
        >
          {antiPitch.lineBefore} <Struck d={d} text={antiPitch.struck} /> {antiPitch.lineAfter}
        </h2>

        <motion.p
          style={{ opacity: bodyOp }}
          className="max-w-2xl font-geist text-base leading-relaxed text-white/70 md:text-lg"
        >
          {antiPitch.body}
        </motion.p>

        <motion.div style={{ opacity: ledgerOp }} className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:text-xs">
              <span>{antiPitch.symmetricLabel}</span>
              <span aria-hidden>═══</span>
            </h3>
            <ul className="border-b border-white/10">
              {antiPitch.symmetric.map((t, i) => (
                <SymRow key={t} d={d} i={i} text={t} />
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red md:text-xs">
              <span>{antiPitch.asymmetricLabel}</span>
              <motion.span>{count}</motion.span>
            </h3>
            <ul className="relative border-b border-white/10">
              <motion.span
                aria-hidden
                style={{ scaleX: meter }}
                className="absolute -top-px left-0 h-px w-full origin-left bg-asymmetri-red"
              />
              {antiPitch.asymmetric.map((t, i) => (
                <AsymRow key={t} d={d} i={i} text={t} />
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.p
          style={{ opacity: resolveOp, y: resolveY }}
          className="font-chakra-petch text-xl font-bold uppercase md:text-3xl"
        >
          <span className="mr-3 inline-block h-[0.8em] w-[0.22em] -skew-x-[26deg] bg-asymmetri-red align-[-0.05em]" aria-hidden />
          {antiPitch.resolve}
        </motion.p>
      </div>
    </section>
  );
}
