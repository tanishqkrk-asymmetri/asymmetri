"use client";

import { useRef } from "react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import {
  motion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { maturityPath, processSteps } from "@/lib/site-content";

const pad = (n: number) => String(n).padStart(2, "0");
const LINE_START = 0.08;
const LINE_END = 0.85;
// Node i sits at 10%, 30%, 50%... of the line; it lights when the line reaches it.
const reachAt = (i: number, n: number) =>
  LINE_START + (LINE_END - LINE_START) * ((i + 0.5) / n);

function Node({
  p,
  i,
  n,
  name,
  body,
}: {
  p: MotionValue<number>;
  i: number;
  n: number;
  name: string;
  body: string;
}) {
  const t = reachAt(i, n);
  const on = useTransform(p, [t - 0.01, t], [0, 1]);
  const dot = useTransform(on, [0, 1], ["#0a0a0a", "#cd1717"]);
  const dotScale = useTransform(p, [t - 0.01, t, t + 0.03], [1, 1.8, 1]);
  const textOpacity = useTransform(on, [0, 1], [0.2, 1]);
  const filter = useTransform(on, [0, 1], ["blur(4px)", "blur(0px)"]);
  const y = useTransform(on, [0, 1], [16, 0]);

  return (
    <li className="relative flex flex-col items-start">
      <motion.span
        style={{ background: dot, scale: dotScale }}
        className="relative z-10 -mt-[7px] size-3.5 border-2 border-white"
        aria-hidden
      />
      <motion.div style={{ opacity: textOpacity, filter, y }} className="mt-6 pr-3">
        <span className="font-mono text-[10px] text-asymmetri-red">{pad(i + 1)}</span>
        <h3 className="text-base font-bold uppercase sm:text-xl lg:text-3xl xl:text-4xl">{name}</h3>
        <p className="mt-2 max-w-[14rem] font-geist text-xs text-white/65 md:text-sm">
          {body}
        </p>
      </motion.div>
    </li>
  );
}

function PathWord({
  p,
  i,
  n,
  word,
}: {
  p: MotionValue<number>;
  i: number;
  n: number;
  word: string;
}) {
  const t = reachAt(i, n);
  const color = useTransform(
    p,
    [t - 0.01, t],
    ["rgba(255,255,255,0.18)", i === n - 1 ? "#cd1717" : "#ffffff"],
  );
  return (
    <motion.li style={{ color }} className="flex items-center gap-3">
      {word}
      {i < n - 1 && <span className="text-white/25">→</span>}
    </motion.li>
  );
}

/** Frame → Design → Engineer → Prove → Operate, drawn as a live pipeline. */
export function ProcessPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useSectionProgress(ref);
  const line = useTransform(p, [LINE_START, LINE_END], [0, 1]);
  const headY = useTransform(p, [0, 0.08], [60, 0]);
  const headOpacity = useTransform(p, [0, 0.06], [0, 1]);
  const tagOpacity = useTransform(p, [0.86, 0.92], [0, 1]);

  return (
    <div
      ref={ref}
      id="how-we-work"
      className="relative h-[320vh] bg-black font-chakra-petch text-white"
    >
      <div className="heroDark sticky top-0 flex h-screen flex-col justify-between overflow-hidden bg-black px-6 pt-24 pb-12 md:px-16">
        <motion.header style={{ y: headY, opacity: headOpacity }} className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red md:text-xs">
            How we work · One accountable loop
          </p>
          <h2 className="max-w-4xl text-3xl font-bold uppercase leading-none md:text-7xl">
            From opportunity to{" "}
            <span className="text-asymmetri-red">operating capability.</span>
          </h2>
          <p className="max-w-xl font-geist text-sm text-white/60 md:text-base">
            Strategy, design and engineering stay connected from the first
            question to the production system.
          </p>
        </motion.header>

        <div className="relative">
          <div className="relative h-[2px] bg-white/15">
            <motion.div
              style={{ scaleX: line }}
              className="absolute inset-0 origin-left bg-asymmetri-red"
            />
          </div>
          <ol className="grid grid-cols-5">
            {processSteps.map((s, i) => (
              <Node
                key={s.name}
                p={p}
                i={i}
                n={processSteps.length}
                name={s.name}
                body={s.body}
              />
            ))}
          </ol>
        </div>

        <div className="space-y-3">
          <ol className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] md:text-sm">
            {maturityPath.map((w, i) => (
              <PathWord key={w} p={p} i={i} n={maturityPath.length} word={w} />
            ))}
          </ol>
          <motion.p
            style={{ opacity: tagOpacity }}
            className="font-geist text-sm text-white/55"
          >
            Creative exploration up front. Production discipline all the way
            through.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
