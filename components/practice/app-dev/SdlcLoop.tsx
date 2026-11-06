"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { sdlc, sdlcTools } from "@/lib/site-content";
import { clamp01, useEnterProgress } from "./hooks";

// Terminal detail per stage. Illustrative run, labelled as such in the window.
const details: Record<string, { what: string; artefact: string; agent: string }> = {
  Brief: { what: "requirements captured", artefact: "brief.md · stories drafted", agent: "intake agent" },
  Plan: { what: "agentic planning", artefact: "sprint planned · tasks linked", agent: "planner" },
  Design: { what: "design system synced", artefact: "tokens → components", agent: "design" },
  Build: { what: "ai-aided code", artefact: "branch feat/checkout · PR opened", agent: "engineer + agent" },
  Review: { what: "automated review passed", artefact: "tests green · review approved", agent: "reviewer" },
  Release: { what: "continuous delivery", artefact: "deployed → production", agent: "pipeline" },
};

const N = sdlc.length;
const T0 = 0.1; // first stage starts
const STEP = 0.12; // scroll per stage
const stageAt = (i: number) => T0 + i * STEP;
const DONE = stageAt(N) + 0.02;

/* Commit graph geometry (viewBox 600 × 150). */
const X0 = 20;
const X1 = 580;
const MAIN_Y = 118;
const branches = [
  { name: "feat/brief", from: 70, to: 200, y: 70 },
  { name: "feat/design-system", from: 170, to: 380, y: 30 },
  { name: "feat/checkout", from: 300, to: 470, y: 70 },
  { name: "fix/review", from: 420, to: 520, y: 30 },
];
const commits = [
  ...branches.flatMap((b) => {
    const n = Math.max(2, Math.round((b.to - b.from) / 50));
    return Array.from({ length: n }, (_, k) => ({
      x: b.from + 22 + (k * (b.to - b.from - 44)) / Math.max(n - 1, 1),
      y: b.y,
    }));
  }),
  ...[X0, 200, 380, 470, 520].map((x) => ({ x, y: MAIN_Y })),
];
const branchPath = (b: (typeof branches)[number]) =>
  `M${b.from} ${MAIN_Y} C${b.from + 18} ${MAIN_Y}, ${b.from + 4} ${b.y}, ${b.from + 22} ${b.y} L${b.to - 22} ${b.y} C${b.to - 4} ${b.y}, ${b.to - 18} ${MAIN_Y}, ${b.to} ${MAIN_Y}`;

function Line({ p, at, children }: { p: MotionValue<number>; at: number; children: ReactNode }) {
  const clipPath = useTransform(p, [at, at + 0.05], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const opacity = useTransform(p, [at, at + 0.01], [0, 1]);
  return (
    <motion.div style={{ clipPath, opacity }} className="whitespace-pre">
      {children}
    </motion.div>
  );
}

/**
 * "We run on what we build": FinishLine drives a release while you scroll.
 * The terminal logs each stage, a commit graph draws itself branch by branch
 * and the pipeline lights stage by stage until production.
 */
export function SdlcLoop() {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref);
  const enter = useEnterProgress(ref);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(-1);
  useMotionValueEvent(p, "change", (v) => {
    let s = -1;
    for (let i = 0; i < N; i++) if (v >= stageAt(i) + 0.04) s = i;
    if (v >= DONE) s = N;
    if (s !== stage) setStage(s);
  });
  const lit = reduce ? N : stage;

  // Iris from the red section into the black terminal room.
  const clipPath = useTransform(enter, (v) => `circle(${v * 150}% at 50% 100%)`);
  const titleY = useTransform(p, [0, 0.12], [60, 0]);
  const head = useTransform(p, (v) => X0 + clamp01((v - T0) / (DONE - T0)) * (X1 - X0));
  const clipW = useTransform(head, (h) => h + 8);
  const headX = useTransform(head, (h) => h - 6);
  const done = useTransform(p, [DONE, DONE + 0.03], [0, 1]);

  return (
    <section
      ref={ref}
      id="ai-driven-delivery"
      data-chapter="AI-driven SDLC"
      aria-labelledby="ad-sdlc"
      className="relative h-[300vh] bg-asymmetri-red"
    >
      <motion.div
        style={{ clipPath: reduce ? undefined : clipPath }}
        className="sticky top-0 grid h-screen items-center gap-6 overflow-hidden bg-black px-6 pt-20 pb-6 text-white md:px-16 lg:grid-cols-[1fr_1.15fr] lg:gap-12"
      >
        <motion.div style={{ y: reduce ? 0 : titleY }} className="space-y-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-asymmetri-red md:text-xs">
            <ScrambleText text="The AI-driven software company" />
          </p>
          <h2 id="ad-sdlc" className="font-chakra-petch text-3xl leading-none font-bold uppercase md:text-5xl xl:text-6xl">
            We run on what we build.{" "}
            <span className="text-asymmetri-red">
              The whole SDLC is <span className="whitespace-nowrap">AI-driven.</span>
            </span>
          </h2>
          <p className="max-w-lg font-geist text-sm text-white/65 xl:text-lg">
            FinishLine is our agentic project management operating spine. It connects intent, planning,
            execution, evidence and delivery across the company, while specialist AI tools augment every
            discipline. People own the decisions; agents shorten the loop.
          </p>
          <ul className="hidden max-w-lg flex-wrap gap-1.5 sm:flex">
            {sdlcTools.map((t) => (
              <li key={t} className="border border-white/20 px-2 py-1 font-geist text-[11px] text-white/75">
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="overflow-hidden border border-white/20 bg-[#0d0d0d] shadow-[0_0_100px_-24px_rgba(205,23,23,0.55)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="size-2.5 bg-asymmetri-red" />
            <span className="size-2.5 bg-white/25" />
            <span className="size-2.5 bg-white/25" />
            <span className="ml-3 truncate font-mono text-[10px] text-white/45 md:text-[11px]">
              finishline · asymmetri/ops · example run
            </span>
          </div>

          {/* terminal */}
          <div className="space-y-1.5 overflow-hidden p-4 font-mono text-[10px] leading-relaxed text-white/85 md:p-5 xl:text-[13px]">
            <Line p={p} at={0.04}>
              <span className="text-asymmetri-red">$</span> finishline run --brief {'"hard problem"'}
            </Line>
            {sdlc.map((s, i) => {
              const d = details[s.stage];
              return (
                <Line key={s.stage} p={p} at={stageAt(i)}>
                  <span className="text-white/40">›</span> {s.stage.toLowerCase().padEnd(8, " ")}
                  <span className="text-white/55">{d.what.padEnd(24, " ")}</span>
                  <span className="hidden text-white/35 md:inline">{d.artefact} </span>
                  <span className="text-asymmetri-red">✓</span>
                </Line>
              );
            })}
            <motion.div style={{ opacity: reduce ? 1 : done }} className="pt-1 text-white">
              ● evidence logged · intent → delivery connected
              <span className="fat-cursor !relative ml-2 inline-block !h-3.5 !w-2 bg-asymmetri-red align-middle" aria-hidden />
            </motion.div>
          </div>

          {/* commit graph */}
          <div className="border-t border-white/10 px-4 pt-3 md:px-5" aria-hidden>
            <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
              <span>git · main</span>
              <span>{lit >= N ? "tag v-next · released" : lit >= 0 ? `on ${sdlc[lit].stage.toLowerCase()}` : "waiting"}</span>
            </div>
            <svg viewBox="0 0 600 150" className="mt-1 h-auto w-full">
              <defs>
                <clipPath id="ad-git-clip">
                  <motion.rect x="0" y="0" height="150" style={{ width: reduce ? 600 : clipW }} />
                </clipPath>
              </defs>
              {/* ghost of the full graph */}
              <g stroke="rgba(255,255,255,0.08)" fill="none" strokeWidth="1.5">
                <line x1={X0} x2={X1} y1={MAIN_Y} y2={MAIN_Y} />
                {branches.map((b) => (
                  <path key={b.name} d={branchPath(b)} />
                ))}
              </g>
              <g clipPath="url(#ad-git-clip)">
                <line x1={X0} x2={X1} y1={MAIN_Y} y2={MAIN_Y} stroke="#fff" strokeWidth="2" />
                {branches.map((b) => (
                  <g key={b.name}>
                    <path d={branchPath(b)} stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none" />
                    <text x={b.from + 26} y={b.y - 8} fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">
                      {b.name}
                    </text>
                  </g>
                ))}
                {commits.map((c, i) => (
                  <rect key={i} x={c.x - 4} y={c.y - 4} width="8" height="8" fill={c.y === MAIN_Y ? "#fff" : "#0d0d0d"} stroke="#fff" strokeWidth="1.5" />
                ))}
                <rect x={X1 - 7} y={MAIN_Y - 7} width="14" height="14" fill="#cd1717" />
              </g>
              <motion.g style={{ x: reduce ? X1 - 6 : headX }}>
                <rect x="0" y={MAIN_Y - 6} width="12" height="12" fill="#cd1717" />
                <text x="6" y={MAIN_Y + 24} fill="#cd1717" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  HEAD
                </text>
              </motion.g>
            </svg>
          </div>

          {/* pipeline */}
          <ol className="grid grid-cols-3 border-t border-white/10 sm:grid-cols-6">
            {sdlc.map((s, i) => {
              const on = lit >= i;
              const now = lit === i;
              return (
                <li
                  key={s.stage}
                  className={`relative border-white/10 px-2 py-2.5 transition-colors duration-300 not-last:border-r ${
                    on ? "bg-asymmetri-red text-white" : "text-white/40"
                  }`}
                >
                  <span className="block font-mono text-[9px] uppercase tracking-[0.2em]">
                    {String(i + 1).padStart(2, "0")} {on ? "✓" : ""}
                  </span>
                  <span className="block font-chakra-petch text-xs font-bold uppercase md:text-sm">{s.stage}</span>
                  <span className={`hidden font-geist text-[10px] md:block ${on ? "text-white/80" : "text-white/30"}`}>
                    {s.practice}
                  </span>
                  {now && <span className="kit-blink absolute top-2 right-2 size-1.5 bg-white" aria-hidden />}
                </li>
              );
            })}
          </ol>
        </div>
      </motion.div>
    </section>
  );
}
