"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReduceMotion as useReducedMotion } from "@/hooks/useReduceMotion";
import { SectionHead } from "@/components/practice/SectionHead";
import { ScrambleText } from "@/components/practice/ScrambleText";
import { autonomy } from "./content";
import styles from "./ai.module.css";

const CX = 240;
const CY = 240;
const R = 200;
const angleFor = (v: number) => 180 - v * 60;
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [Math.round((CX + Math.cos(a) * r) * 100) / 100, Math.round((CY - Math.sin(a) * r) * 100) / 100] as const;
};

function Dial({ value, onPick }: { value: number; onPick: (i: number) => void }) {
  const ang = angleFor(value);
  const [ex, ey] = pt(ang, R);
  const ticks = Array.from({ length: 37 }, (_, i) => i * 5);
  return (
    <svg viewBox="0 0 480 290" className="w-full max-w-xl" aria-hidden>
      {/* Track and filled arc */}
      <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
      <path
        d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${ex} ${ey}`}
        fill="none"
        stroke="#000"
        strokeWidth={10}
        className="transition-all duration-500"
      />
      {ticks.map((d) => {
        const major = d % 60 === 0;
        const [x1, y1] = pt(d, R - 14);
        const [x2, y2] = pt(d, R - (major ? 34 : 22));
        return (
          <line
            key={d}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={180 - d <= value * 60 + 0.1 ? "#000" : "rgba(255,255,255,0.55)"}
            strokeWidth={major ? 2 : 1}
          />
        );
      })}
      {/* Needle */}
      <g style={{ transform: `rotate(${-ang}deg)`, transformOrigin: `${CX}px ${CY}px` }} className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <line x1={CX} y1={CY} x2={CX + R - 44} y2={CY} stroke="#fff" strokeWidth={3} />
        <rect x={CX + R - 52} y={CY - 6} width={12} height={12} fill="#000" stroke="#fff" />
      </g>
      <rect x={CX - 14} y={CY - 14} width={28} height={28} fill="#000" />
      <rect x={CX - 5} y={CY - 5} width={10} height={10} fill="#cd1717" />
      {autonomy.map((a, i) => {
        const [x, y] = pt(angleFor(i), R + 18);
        const anchor = i === 0 ? "start" : i === 3 ? "end" : "middle";
        return (
          <text
            key={a.name}
            x={i === 0 ? x - 8 : i === 3 ? x + 8 : x}
            y={i === 0 || i === 3 ? y + 30 : y - 4}
            textAnchor={anchor}
            onClick={() => onPick(i)}
            className="cursor-pointer font-mono text-[13px] uppercase tracking-[0.15em]"
            fill={Math.round(value) === i ? "#000" : "rgba(255,255,255,0.75)"}
          >
            {i === 3 ? "Multi-agent" : a.name}
          </text>
        );
      })}
    </svg>
  );
}

/** Who acts at each setting: H = human, A = agent, S = supervisor, ▣ = outcome. */
function Topology({ setting }: { setting: number }) {
  const box = (x: number, y: number, label: string, kind: "h" | "a" | "o", key?: string) => (
    <g key={key ?? `${label}${x}${y}`}>
      <rect
        x={x - 22}
        y={y - 22}
        width={44}
        height={44}
        fill={kind === "h" ? "#fff" : kind === "o" ? "none" : "#000"}
        stroke={kind === "o" ? "#000" : kind === "h" ? "#fff" : "#000"}
        strokeWidth={kind === "o" ? 2 : 1}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        className="font-mono text-[11px] font-semibold"
        fill={kind === "h" ? "#cd1717" : kind === "o" ? "#000" : "#fff"}
      >
        {label}
      </text>
    </g>
  );
  const line = (x1: number, y1: number, x2: number, y2: number, dashed = false, key?: string) => (
    <line
      key={key ?? `${x1}${y1}${x2}${y2}`}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={dashed ? "#fff" : "#000"}
      strokeWidth={dashed ? 1.5 : 2}
      className={dashed ? styles.dash : undefined}
    />
  );
  const tag = (x: number, y: number, t: string) => (
    <text key={t + x} x={x} y={y} textAnchor="middle" className="font-mono text-[9px] uppercase tracking-[0.15em]" fill="rgba(255,255,255,0.85)">
      {t}
    </text>
  );
  const scenes = [
    // Assist
    [line(82, 100, 148, 100, true), line(192, 100, 258, 100), box(60, 100, "AI", "a"), box(170, 100, "YOU", "h"), box(280, 100, "▣", "o"), tag(115, 88, "suggests"), tag(225, 88, "acts")],
    // Copilot
    [line(82, 100, 148, 100), line(192, 100, 258, 100), box(60, 100, "AI", "a"), box(170, 100, "YOU", "h"), box(280, 100, "▣", "o"), tag(115, 88, "drafts"), tag(225, 88, "approve"), tag(170, 140, "every action")],
    // Agent
    [line(82, 130, 258, 130), line(170, 62, 170, 130, true), box(60, 130, "AI", "a"), box(170, 40, "YOU", "h"), box(280, 130, "▣", "o"), tag(128, 118, "plans · acts"), tag(212, 92, "exceptions")],
    // Multi-agent
    [
      line(82, 120, 148, 60),
      line(82, 120, 148, 120),
      line(82, 120, 148, 180),
      line(192, 60, 258, 120),
      line(192, 120, 258, 120),
      line(192, 180, 258, 120),
      line(60, 52, 60, 98, true),
      box(60, 30, "YOU", "h"),
      box(60, 120, "SUP", "a"),
      box(170, 60, "A1", "a"),
      box(170, 120, "A2", "a"),
      box(170, 180, "A3", "a"),
      box(280, 120, "▣", "o"),
      tag(100, 78, "policy"),
    ],
  ];
  return (
    <svg viewBox="0 0 320 210" className="w-full max-w-sm" aria-hidden>
      {scenes.map((s, i) => (
        <g key={i} className={`transition-opacity duration-500 ${i === setting ? "opacity-100" : "opacity-0"}`}>
          {s}
        </g>
      ))}
    </svg>
  );
}

/**
 * Human-in-the-loop as a control: drag the dial from Assist to a
 * multi-agent system and watch who decides, what needs approval and which
 * guardrails switch on.
 */
export function AutonomyDial() {
  const [value, setValue] = useState(0);
  const touched = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -30% 0px" });
  const reduce = useReducedMotion();
  const setting = Math.round(value);
  const a = autonomy[setting];

  // A one-time sweep hints that the dial is live.
  useEffect(() => {
    if (!inView || reduce) return;
    const seq = [1, 2, 3, 2];
    const ids = seq.map((v, i) =>
      window.setTimeout(() => {
        if (!touched.current) setValue(v);
      }, 600 + i * 1300),
    );
    return () => ids.forEach(clearTimeout);
  }, [inView, reduce]);

  const pick = (i: number) => {
    touched.current = true;
    setValue(i);
  };

  return (
    <section data-chapter="Autonomy" className="relative overflow-hidden bg-asymmetri-red px-6 py-28 text-white md:px-16 md:py-36">
      <SectionHead
        kicker="03 · Human in the loop"
        title={["Autonomy is", ["a setting."]]}
        body="Not a leap of faith. We design the control model first, then raise autonomy one notch at a time, as evaluations earn the trust."
        className="[&_.text-asymmetri-red]:text-black"
      />

      <div ref={ref} className="mt-16 grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="flex flex-col items-center gap-8">
          <Dial value={value} onPick={pick} />
          <div className="w-full max-w-xl">
            <label htmlFor="ai-autonomy" className="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
              <span>Autonomy level</span>
              <span className="text-black">
                {String(setting + 1).padStart(2, "0")} / 04
              </span>
            </label>
            <input
              id="ai-autonomy"
              type="range"
              min={0}
              max={3}
              step={1}
              value={setting}
              aria-valuetext={a.name}
              onChange={(e) => pick(Number(e.target.value))}
              className="h-10 w-full cursor-grab appearance-none bg-transparent active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white [&::-moz-range-thumb]:size-7 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-black [&::-moz-range-track]:h-[3px] [&::-moz-range-track]:bg-white/40 [&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:bg-white/40 [&::-webkit-slider-thumb]:-mt-3 [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-black"
            />
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {autonomy.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={i === setting}
                  className={`cursor-pointer border px-2 py-2 text-left font-mono text-[9px] uppercase tracking-[0.12em] transition-colors md:text-[10px] ${i === setting ? "border-black bg-black text-white" : "border-white/40 hover:bg-white hover:text-asymmetri-red"}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/40 pt-8" aria-live="polite">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">Setting</p>
          <h3 className="mt-2 font-chakra-petch text-5xl leading-[0.9] font-bold uppercase md:text-7xl">
            <ScrambleText text={a.name} trigger="none" replayKey={setting} duration={0.5} />
          </h3>
          <p className="mt-3 font-chakra-petch text-xl font-semibold text-black md:text-2xl">{a.line}</p>
          <div className="mt-6 flex items-center gap-6">
            <Topology setting={setting} />
          </div>
          <dl className="mt-6 divide-y divide-white/30 border-y border-white/30">
            {(
              [
                ["Who decides", a.decides],
                ["Approvals", a.approvals],
                ["Guardrails", a.guardrails],
                ["Best for", a.bestFor],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 md:grid-cols-[9rem_1fr]">
                <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{k}</dt>
                <dd key={v} className={`${styles.wipeIn} font-geist text-sm leading-snug md:text-base`}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
            Human touchpoints
            <span className="flex gap-1" aria-hidden>
              {[0, 1, 2, 3].map((k) => (
                <span key={k} className={`size-3 border border-white transition-colors duration-300 ${k < a.touch ? "bg-white" : ""}`} />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
