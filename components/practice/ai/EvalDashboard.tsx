"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { SectionHead } from "@/components/practice/SectionHead";

const CASES = 48;
// Deterministic outcomes: two regressions caught in this example run.
const FAIL = new Set([13, 37]);
const SPANS = [
  { name: "planner", start: 0, dur: 0.32 },
  { name: "memory.recall", start: 0.32, dur: 0.08 },
  { name: "retriever.search", start: 0.4, dur: 0.41 },
  { name: "rerank", start: 0.81, dur: 0.12 },
  { name: "llm.generate", start: 0.93, dur: 1.38 },
  { name: "critic.check", start: 2.31, dur: 0.36 },
  { name: "tool:mcp crm.update", start: 2.67, dur: 0.28 },
];
const TOTAL = 3.1;
const HISTORY = [
  { v: "v8", s: 78 },
  { v: "v9", s: 83 },
  { v: "v10", s: 81 },
  { v: "v11", s: 88 },
  { v: "v12", s: 91.7 },
  { v: "v13", s: 95.8 },
];
const KPIS = [
  { k: "Task success", to: 95.8, fmt: (v: number) => `${v.toFixed(1)}%`, delta: "+4.1 vs v12" },
  { k: "p95 latency", to: 3.1, fmt: (v: number) => `${v.toFixed(1)}s`, delta: "−0.6s" },
  { k: "Cost per task", to: 0.028, fmt: (v: number) => `$${v.toFixed(3)}`, delta: "−18%" },
  { k: "Groundedness", to: 0.97, fmt: (v: number) => v.toFixed(2), delta: "+0.03" },
];
const RUN_MS = 4200;

/**
 * Evaluation and observability as a live example: a regression suite runs,
 * cells tick pass or fail, KPIs count up and a trace waterfall draws in.
 */
export function EvalDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  const [run, setRun] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      raf.current = requestAnimationFrame(() => setT(1));
      return () => cancelAnimationFrame(raf.current);
    }
    const start = performance.now();
    const tick = (now: number) => {
      const v = Math.min((now - start) / RUN_MS, 1);
      setT(v);
      if (v < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, reduce, run]);

  const done = Math.floor(Math.min(t / 0.8, 1) * CASES);
  const passed = Array.from({ length: done }, (_, i) => i).filter((i) => !FAIL.has(i)).length;
  const k = Math.min(t / 0.85, 1);
  const kEase = 1 - Math.pow(1 - k, 3);
  const traceT = Math.min(Math.max((t - 0.15) / 0.7, 0), 1) * TOTAL;

  return (
    <section data-chapter="Evaluation" className="relative bg-black px-6 py-28 text-white md:px-16 md:py-36">
      <SectionHead
        kicker="04 · Evaluation and observability"
        title={["Measured,", ["not hoped."]]}
        body="Every agent ships with an eval suite, tracing and production monitors. Quality, latency and cost per task are numbers on a dashboard, not opinions in a meeting."
      />

      <div ref={ref} className="mt-16 border border-white/15 bg-[#0a0a0a]">
        {/* Title bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 md:px-6">
          <span className="flex items-center gap-3">
            <span className="bg-white px-1.5 py-0.5 font-semibold text-black">Example</span>
            <span>Eval run · support-agent v13 vs v12</span>
          </span>
          <span className="flex items-center gap-4">
            <span>Illustrative values</span>
            <button
              type="button"
              onClick={() => {
                setT(0);
                setRun((r) => r + 1);
              }}
              className="cursor-pointer border border-white/30 px-2.5 py-1 text-white transition-colors hover:border-asymmetri-red hover:bg-asymmetri-red focus-visible:outline-2 focus-visible:outline-asymmetri-red"
            >
              ↻ Re-run suite
            </button>
          </span>
        </div>

        {/* KPIs */}
        <dl className="grid grid-cols-2 border-b border-white/15 lg:grid-cols-4">
          {KPIS.map((kp, i) => (
            <div
              key={kp.k}
              className={`border-white/15 p-4 md:p-6 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{kp.k}</dt>
              <dd className="mt-2 font-chakra-petch text-3xl font-bold tabular-nums md:text-5xl">
                {kp.fmt(kp.to * kEase)}
              </dd>
              <dd className={`mt-1 font-mono text-[10px] uppercase tracking-[0.15em] transition-opacity ${k >= 1 ? "text-asymmetri-red opacity-100" : "opacity-0"}`}>
                {kp.delta}
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid lg:grid-cols-[1fr_1.3fr]">
          {/* Regression suite */}
          <div className="border-b border-white/15 p-4 md:p-6 lg:border-r lg:border-b-0">
            <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              <span>Regression suite</span>
              <span className="text-white tabular-nums">
                {passed} / {CASES} passed
              </span>
            </div>
            <ol className="mt-4 grid grid-cols-12 gap-1" aria-label="Example test cases">
              {Array.from({ length: CASES }, (_, i) => {
                const state = i < done ? (FAIL.has(i) ? "fail" : "pass") : i === done && t < 1 ? "run" : "idle";
                return (
                  <li
                    key={i}
                    className={`aspect-square border transition-colors duration-200 ${
                      state === "pass"
                        ? "border-white/70 bg-white/80"
                        : state === "fail"
                          ? "border-asymmetri-red bg-asymmetri-red"
                          : state === "run"
                            ? "kit-blink border-white"
                            : "border-white/15"
                    }`}
                  >
                    <span className="sr-only">
                      Case {i + 1}: {state}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-5 space-y-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
              <p className={done > 13 ? "text-asymmetri-red" : "opacity-30"}>✕ case 14 · refund over limit · approval skipped</p>
              <p className={done > 37 ? "text-asymmetri-red" : "opacity-30"}>✕ case 38 · citation missing · groundedness 0.61</p>
              <p className={t >= 1 ? "text-white" : "opacity-30"}>▸ gate · 2 regressions · blocked from release</p>
            </div>

            {/* Version history */}
            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Task success by version</p>
              <div className="mt-3 flex h-28 items-end gap-2">
                {HISTORY.map((h, i) => {
                  const last = i === HISTORY.length - 1;
                  const grow = Math.min(Math.max((t - i * 0.08) / 0.4, 0), 1);
                  return (
                    <div key={h.v} className="flex flex-1 flex-col items-center gap-1.5">
                      <span className="font-mono text-[9px] text-white/60 tabular-nums">{grow >= 1 ? h.s : ""}</span>
                      <div
                        className={`w-full origin-bottom ${last ? "bg-asymmetri-red" : "bg-white/25"}`}
                        style={{ height: `${(h.s - 60) * 2}px`, transform: `scaleY(${grow})` }}
                      />
                      <span className="font-mono text-[9px] text-white/50">{h.v}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trace waterfall */}
          <div className="p-4 md:p-6">
            <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              <span>Trace · ticket #4471</span>
              <span className="text-white tabular-nums">{traceT.toFixed(2)}s</span>
            </div>
            <ol className="mt-4 space-y-2">
              {SPANS.map((s) => {
                const shown = Math.min(Math.max((traceT - s.start) / s.dur, 0), 1);
                const llm = s.name === "llm.generate";
                return (
                  <li key={s.name} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 md:grid-cols-[10rem_1fr]">
                    <span className={`truncate font-mono text-[10px] uppercase tracking-[0.1em] ${shown > 0 ? "text-white" : "text-white/30"}`}>
                      {s.name}
                    </span>
                    <span className="relative h-5 bg-white/[0.04]">
                      <span
                        className={`absolute inset-y-0 origin-left ${llm ? "bg-asymmetri-red" : "bg-white/70"}`}
                        style={{
                          left: `${(s.start / TOTAL) * 100}%`,
                          width: `${(s.dur / TOTAL) * 100}%`,
                          transform: `scaleX(${shown})`,
                        }}
                      />
                      {shown >= 1 && (
                        <span
                          className="absolute top-1/2 -translate-y-1/2 pl-1.5 font-mono text-[9px] text-white/60"
                          style={{ left: `${((s.start + s.dur) / TOTAL) * 100}%` }}
                        >
                          {s.dur.toFixed(2)}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 grid grid-cols-3 gap-px bg-white/15 font-mono text-[10px] uppercase tracking-[0.12em]">
              {[
                ["Tokens", "6.4k"],
                ["Tool calls", "2"],
                ["Verdict", "Pass"],
              ].map(([a, b]) => (
                <div key={a} className="bg-[#0a0a0a] p-3">
                  <p className="text-white/45">{a}</p>
                  <p className={`mt-1 text-sm ${a === "Verdict" && traceT >= TOTAL ? "text-asymmetri-red" : "text-white"}`}>
                    {traceT >= TOTAL ? b : "…"}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 font-geist text-sm leading-relaxed text-white/55">
              We trace every step an agent takes, score runs against golden datasets, and gate releases on regressions. The same telemetry watches production for drift in quality, latency and cost.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
