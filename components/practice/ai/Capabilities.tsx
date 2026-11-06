"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { SectionHead } from "@/components/practice/SectionHead";
import { capabilityDetail } from "./content";
import styles from "./ai.module.css";

type Kind = (typeof capabilityDetail)[number]["kind"];
const W = "rgba(255,255,255,0.85)";
const DIM = "rgba(255,255,255,0.3)";
const RED = "#cd1717";

function Box({ x, y, w = 48, h = 24, label, hot }: { x: number; y: number; w?: number; h?: number; label: string; hot?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={hot ? RED : "#000"} stroke={hot ? RED : W} />
      <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fill="#fff" className="font-mono text-[8px] uppercase">
        {label}
      </text>
    </g>
  );
}

function Packet({ path, dur, red, reduce, begin = "0s" }: { path: string; dur: number; red?: boolean; reduce: boolean; begin?: string }) {
  if (reduce) return null;
  return (
    <rect x={-3} y={-3} width={6} height={6} fill={red ? RED : "#fff"}>
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={path} begin={begin} />
    </rect>
  );
}

function Schematic({ kind, reduce }: { kind: Kind; reduce: boolean }) {
  const draw = (len: number) => ({ className: styles.draw, style: { ["--len" as string]: len } });
  let body: React.ReactNode = null;
  if (kind === "runtime") {
    const loop = "M44 34 H124 M148 46 V86 M124 98 H44 M20 86 V46";
    body = (
      <>
        <path d={loop} stroke={DIM} fill="none" {...draw(240)} />
        <path d="M172 98 H206 V78" stroke={W} fill="none" />
        <Packet path="M44 34 H148 V98 H44 V34" dur={3.2} reduce={reduce} />
        <Box x={20} y={22} label="Plan" />
        <Box x={124} y={22} label="Execute" />
        <Box x={124} y={86} label="Check" hot />
        <Box x={20} y={86} label="Recover" />
        <Box x={180} y={54} w={52} label="Done" />
      </>
    );
  } else if (kind === "orchestration") {
    body = (
      <>
        <path d="M120 40 L44 92 M120 40 L120 92 M120 40 L196 92" stroke={DIM} fill="none" {...draw(260)} />
        <Box x={92} y={16} w={56} label="Supervisor" hot />
        <Box x={20} y={92} label="Research" />
        <Box x={96} y={92} label="Draft" />
        <Box x={172} y={92} label="Review" />
        <Packet path="M120 40 L44 92" dur={1.6} reduce={reduce} />
        <Packet path="M120 40 L120 92" dur={1.6} reduce={reduce} begin="0.4s" />
        <Packet path="M120 40 L196 92" dur={1.6} reduce={reduce} begin="0.8s" red />
      </>
    );
  } else if (kind === "rag") {
    const dots = [
      [104, 44], [114, 54], [98, 62], [124, 40], [130, 66], [110, 76], [120, 86], [138, 52], [100, 92],
    ];
    body = (
      <>
        {[0, 1, 2].map((k) => (
          <rect key={k} x={16 + k * 4} y={36 + k * 6} width={40} height={52} fill="#000" stroke={k === 2 ? W : DIM} />
        ))}
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={30} y1={58 + k * 8} x2={56} y2={58 + k * 8} stroke={DIM} />
        ))}
        {dots.map(([x, y], i) => (
          <rect key={i} x={x - 2} y={y - 2} width={4} height={4} fill={i % 3 === 0 ? RED : W} />
        ))}
        <path d="M64 64 H90 M150 64 H172" stroke={DIM} {...draw(60)} />
        <Box x={172} y={52} w={54} label="Context" hot />
        <Packet path="M64 64 H90 M150 64 H172" dur={2} reduce={reduce} />
      </>
    );
  } else if (kind === "data") {
    body = (
      <>
        <path d="M44 30 C 80 30, 80 64, 108 64 M44 64 H108 M44 98 C 80 98, 80 64, 108 64 M164 64 H196" stroke={DIM} fill="none" {...draw(260)} />
        <Box x={12} y={18} w={32} label="CRM" />
        <Box x={12} y={52} w={32} label="ERP" />
        <Box x={12} y={86} w={32} label="Logs" />
        <rect x={108} y={44} width={56} height={40} fill="#000" stroke={W} />
        <text x={136} y={62} textAnchor="middle" fill="#fff" className="font-mono text-[8px] uppercase">Lakehouse</text>
        <text x={136} y={74} textAnchor="middle" fill={RED} className="font-mono text-[7px] uppercase">✓ contracts</text>
        <Box x={196} y={52} w={34} label="Serve" hot />
        <Packet path="M44 30 C 80 30, 80 64, 108 64" dur={1.8} reduce={reduce} />
        <Packet path="M44 98 C 80 98, 80 64, 108 64" dur={1.8} reduce={reduce} begin="0.6s" />
        <Packet path="M164 64 H196" dur={1} reduce={reduce} red />
      </>
    );
  } else if (kind === "eval") {
    body = (
      <>
        <path d="M24 110 H220 M24 110 V20" stroke={DIM} />
        <path d="M24 50 H220" stroke={RED} strokeDasharray="4 4" />
        <text x={218} y={44} textAnchor="end" fill={RED} className="font-mono text-[7px] uppercase">Release gate</text>
        <path d="M24 98 L56 90 L88 80 L120 84 L152 62 L184 52 L216 38" stroke={W} fill="none" strokeWidth={1.5} {...draw(240)} />
        {[[56, 90], [88, 80], [120, 84], [152, 62], [184, 52], [216, 38]].map(([x, y], i) => (
          <rect key={i} x={x - 2.5} y={y - 2.5} width={5} height={5} fill={i === 2 ? RED : "#fff"} />
        ))}
      </>
    );
  } else {
    body = (
      <>
        <path d="M68 64 H112 M136 64 H172" stroke={DIM} {...draw(120)} />
        <Box x={20} y={52} label="Agent" />
        <path d="M112 34 H136 V94 H112" stroke={RED} fill="none" strokeWidth={2} />
        <text x={124} y={28} textAnchor="middle" fill={RED} className="font-mono text-[7px] uppercase">Policy</text>
        <Box x={172} y={52} label="Tool" />
        <text x={124} y={112} textAnchor="middle" fill={W} className="font-mono text-[7px] uppercase">✕ injection blocked</text>
        <Packet path="M68 64 H112" dur={1.4} reduce={reduce} red />
        <Packet path="M136 64 H172" dur={1.4} reduce={reduce} begin="0.7s" />
      </>
    );
  }
  return (
    <svg viewBox="0 0 240 124" className="w-full" fill="none" aria-hidden>
      {body}
    </svg>
  );
}

function Spec({ c, reduce }: { c: (typeof capabilityDetail)[number]; reduce: boolean }) {
  return (
    <div className="border border-black bg-black p-5 text-white md:p-7">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
        <span>Spec sheet</span>
        <span className="text-asymmetri-red">● Live</span>
      </div>
      <div className="mt-4 border border-white/10 bg-[#0a0a0a] p-3">
        <Schematic kind={c.kind} reduce={reduce} />
      </div>
      <p className="mt-5 font-geist text-base leading-relaxed text-white/80 md:text-lg">{c.what}</p>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">You receive</p>
      <ul className="mt-3 grid gap-px bg-white/10 sm:grid-cols-2">
        {c.deliverables.map((d, i) => (
          <li
            key={d}
            className={`flex gap-3 bg-black py-2.5 pr-2 font-geist text-sm ${styles.chipIn}`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="font-mono text-[10px] text-asymmetri-red">{String(i + 1).padStart(2, "0")}</span>
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Six capabilities as a switchboard: pick a row and its spec sheet powers
 * up with a live schematic, what we do and what you receive. On small
 * screens the sheet opens under its row.
 */
export function Capabilities() {
  const [active, setActive] = useState(0);
  const reduce = !!useReducedMotion();

  return (
    <section data-chapter="Capabilities" className="relative bg-white px-6 py-28 text-black md:px-16 md:py-36">
      <SectionHead
        tone="light"
        kicker="05 · Capabilities"
        title={["What we", ["engineer."]]}
        body="Six capabilities, one accountable system. Pick one to see what we build and what you take away."
      />

      <div className="mt-16 grid gap-x-12 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[repeat(6,auto)_1fr]">
        {capabilityDetail.map((c, i) => {
          const on = i === active;
          return (
            <div key={c.name} className="lg:contents">
              <h3 className="lg:col-start-1">
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`ai-cap-${i}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group relative flex w-full cursor-pointer items-baseline gap-5 overflow-hidden border-t border-black/20 py-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-asymmetri-red md:py-7 ${i === capabilityDetail.length - 1 ? "border-b" : ""}`}
                >
                  <span
                    className={`absolute inset-0 origin-left bg-asymmetri-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "scale-x-100" : "scale-x-0"}`}
                    aria-hidden
                  />
                  <span className={`relative pl-3 font-mono text-[10px] md:text-xs ${on ? "text-white" : "text-asymmetri-red"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`relative font-chakra-petch text-2xl leading-none font-bold uppercase transition-[color,transform] duration-300 md:text-4xl ${on ? "translate-x-2 text-white" : "group-hover:translate-x-1"}`}
                  >
                    {c.name}
                  </span>
                  <span className={`relative ml-auto pr-3 font-mono text-sm transition-transform ${on ? "rotate-45 text-white" : ""}`} aria-hidden>
                    +
                  </span>
                </button>
              </h3>
              <div
                id={`ai-cap-${i}`}
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:col-start-2 lg:row-span-7 lg:row-start-1 lg:grid-rows-[1fr] lg:self-start lg:sticky lg:top-24 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 lg:pointer-events-none"}`}
              >
                <div className="overflow-hidden">
                  <div className="pt-2 pb-6 lg:p-0">{on ? <Spec c={c} reduce={reduce} /> : <SpecStatic c={c} />}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Inactive sheets keep their copy in the DOM for crawlers without running animations. */
function SpecStatic({ c }: { c: (typeof capabilityDetail)[number] }) {
  return (
    <div className="border border-black bg-black p-5 text-white md:p-7">
      <p className="font-geist text-base leading-relaxed text-white/80">{c.what}</p>
      <ul className="mt-4 space-y-1 font-geist text-sm">
        {c.deliverables.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </div>
  );
}
