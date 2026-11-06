"use client";

import { useEffect, useRef, useState } from "react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { useActive } from "./hooks";

// Cheap deterministic hash in [0, 1).
const rnd = (a: number, b = 0) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const STEPS = ["plan", "tool", "tool", "ckpt", "tool", "retry", "tool", "done"];
const CASES = ["refund-edge", "multi-hop", "policy-cite", "tool-fail", "long-ctx", "handoff"];

function Panel({
  title,
  n,
  on,
  children,
}: {
  title: string;
  n: number;
  on: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative border p-3 transition-[border-color,opacity,background-color] duration-500 xl:p-4 ${
        on ? "border-asymmetri-red bg-asymmetri-red/[0.07] opacity-100" : "border-white/15 opacity-55"
      }`}
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-white/60">
        <span className={on ? "text-white" : undefined}>
          <span className="mr-2 text-asymmetri-red">{String(n + 1).padStart(2, "0")}</span>
          {title}
        </span>
        {on && <span className="kit-blink inline-block size-1.5 bg-asymmetri-red" />}
      </div>
      {children}
    </div>
  );
}

/**
 * Track A visual: four live instruments, one per open question. The question
 * on screen lights its instrument. All values are illustrative.
 */
export function AiInstruments({ active }: { active: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const run = useActive(ref);
  const [tick, setTick] = useState(7);

  useEffect(() => {
    if (!run || reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 420);
    return () => clearInterval(id);
  }, [run, reduce]);

  const head = tick % (STEPS.length + 2);
  const passCount = CASES.filter((_, i) => rnd(i, Math.floor(tick / 6)) > 0.22).length;
  const costs = Array.from({ length: 22 }, (_, i) => {
    const x = i + tick;
    return 0.85 - (i / 22) * 0.45 + (rnd(x) - 0.5) * 0.18;
  });

  return (
    <div ref={ref} className="grid grid-cols-2 gap-2 sm:gap-3" aria-hidden>
      <Panel title="Runtime · trace" n={0} on={active === 0}>
        <div className="flex gap-1">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`block aspect-square w-full border transition-colors duration-300 ${
                  i < head
                    ? s === "retry"
                      ? "border-white/60 bg-transparent"
                      : "border-white bg-white"
                    : i === head
                      ? "border-asymmetri-red bg-asymmetri-red"
                      : "border-white/20"
                } ${s === "ckpt" ? "rotate-45 scale-75" : ""}`}
              />
              <span className="h-2 font-mono text-[7px] uppercase text-white/40">{s === "tool" || s === "plan" ? "" : s}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white/50">
          Step {String(Math.min(head + 1, STEPS.length)).padStart(2, "0")}/08 ·{" "}
          {head > 3 ? "checkpoint saved · resumable" : "running"}
        </p>
      </Panel>

      <Panel title="Memory · 96 cells" n={1} on={active === 1}>
        <div className="grid grid-cols-12 gap-[3px]">
          {Array.from({ length: 96 }, (_, i) => {
            const hit = rnd(i, tick) > 0.93;
            const age = rnd(i, Math.floor(tick / 4));
            return (
              <span
                key={i}
                className="block aspect-square transition-colors duration-300"
                style={{
                  background: hit ? "#cd1717" : `rgba(255,255,255,${(0.06 + age * 0.4).toFixed(2)})`,
                }}
              />
            );
          })}
        </div>
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.15em] text-white/50">
          Retrieve · decay · cite
        </p>
      </Panel>

      <Panel title="Eval · example run" n={2} on={active === 2}>
        <ul className="space-y-1 font-mono text-[9px] uppercase tracking-[0.1em]">
          {CASES.map((c, i) => {
            const ok = rnd(i, Math.floor(tick / 6)) > 0.22;
            return (
              <li key={c} className="flex justify-between text-white/60">
                <span>case/{c}</span>
                <span className={ok ? "text-white" : "text-asymmetri-red"}>{ok ? "pass" : "fail"}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex items-center gap-2">
          <span className="block h-1 flex-1 bg-white/10">
            <span
              className="block h-full bg-white transition-[width] duration-500"
              style={{ width: `${(passCount / CASES.length) * 100}%` }}
            />
          </span>
          <span className="font-mono text-[9px] text-white tabular-nums">
            {passCount}/{CASES.length}
          </span>
        </div>
      </Panel>

      <Panel title="Cost per task" n={3} on={active === 3}>
        <svg viewBox="0 0 220 70" className="h-16 w-full" preserveAspectRatio="none">
          <line x1="0" y1="20" x2="220" y2="20" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 4" />
          <polyline
            fill="none"
            stroke="#cd1717"
            strokeWidth="1.5"
            points={costs.map((c, i) => `${((i / 21) * 220).toFixed(1)},${(70 - c * 60).toFixed(1)}`).join(" ")}
          />
        </svg>
        <p className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-white/50">
          <span>Baseline ---</span>
          <span>Route · cache · distil</span>
        </p>
      </Panel>
    </div>
  );
}
